import { useEffect, useState, useMemo, useCallback } from 'react';
import {
	BINANCE_EXCHANGE_INFO,
	BINANCE_PRICE_TICKER,
	CONTRACT_ADDRESSES,
	ESTIMATED_NETWORK_TRANSACTION_GAS,
	Fee,
	isTokenSelected,
	makeId,
	PROTOCOL_FEE,
	serviceAddress,
	START_TOKEN,
	Graph,
	BINANCE_FEE,
	FEE_CURRENCY,
	PROTOCOL_FEE_FACTOR,
	isNetworkSelected
} from '../helpers';
import type { GraphType, DestinationNetworks } from '../helpers';
import CONTRACT_DATA from '../data/YandaExtendedProtocol.json';
import destinationNetworks from '../data/destinationNetworks.json';
import { useEthers, useGasPrice, useEtherBalance } from '@usedapp/core';
import { BigNumber, utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
// import { formatEther } from '@ethersproject/units';
import { useStore } from '../helpers';
import type { Price } from '../helpers';
import axios from 'axios';
import { formatEther } from 'ethers/lib/utils';

type Ticker = {
	baseAsset: string;
	symbol: string;
	quoteAsset: string;
	filters: any[];
};

export const useFees = () => {
	// TODO: error handling if API calls fail
	const [allPrices, setAllPrices] = useState<Price[]>([]);
	const [allFilteredPrices, setAllFilteredPrices] = useState<Price[]>([]);
	const [allPairs, setAllPairs] = useState<Ticker[]>([]);
	const [cexGraph, setCexGraph] = useState<Graph>();
	const [gasAmount, setGasAmount] = useState(null);

	const [allFilteredPairs, setAllFilteredPairs] = useState<Ticker[]>([]);
	const {
		state: {
			destinationToken,
			destinationNetwork,
			amount,
			isNetworkConnected,
			destinationAddress,
			account
		}
	} = useStore();

	const { chainId, library: web3Provider } = useEthers();
	const gasPrice = useGasPrice();
	const contractAddress = CONTRACT_ADDRESSES?.[chainId as keyof typeof CONTRACT_ADDRESSES] || '';
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const contract = new Contract(contractAddress, contractInterface, web3Provider);

	if (web3Provider && isNetworkConnected) {
		contract.connect(web3Provider.getSigner());
	}
	const walletBalance = useEtherBalance(account);

	const getExchangeInfo = async () => {
		try {
			const res = await axios.request({ url: BINANCE_EXCHANGE_INFO });
			setAllPairs(res.data.symbols);
		} catch (e: any) {
			throw new Error(e);
		}
	};

	const getTickerData = async () => {
		try {
			const res = await axios.request({ url: BINANCE_PRICE_TICKER });
			setAllPrices(res.data);
		} catch (e: any) {
			throw new Error(e);
		}
	};

	useEffect(() => {
		void getExchangeInfo();
		void getTickerData();
	}, []);

	const uniqueTokens: string[] = useMemo(
		() =>
			Object.keys(destinationNetworks).reduce(
				(tokens: string[], network: string) => {
					const networkTokens = Object.keys(
						destinationNetworks?.[network as DestinationNetworks]?.['tokens']
					);

					const allTokens = [...tokens, networkTokens];

					return [...new Set(allTokens.flat(1))];
				},
				['GLMR']
			),
		[]
	);

	const isSymbol = useCallback(
		(symbol: string): boolean => {
			let k = 0;

			for (let i = 0; i < uniqueTokens.length - 1; i++) {
				k++;
				for (let j = k; j < uniqueTokens.length; j++) {
					if (
						uniqueTokens[i] + uniqueTokens[j] === symbol ||
						uniqueTokens[j] + uniqueTokens[i] === symbol
					) {
						return true;
					}
				}
			}

			return false;
		},
		[uniqueTokens]
	);

	const getPrice = (base: string, quote: string): number => {
		const ticker = allFilteredPrices.find((x: Price) => x.symbol === base + quote);
		if (ticker) {
			return +ticker.price;
		} else {
			const reverseTicker = allFilteredPrices.find((x: Price) => x.symbol === quote + base);

			if (reverseTicker) {
				return 1 / +reverseTicker.price;
			} else {
				return 1;
			}
		}
	};

	const marginalCosts = useMemo(() => {
		let minAmount = '';
		let maxAmount = '';
		if (
			isTokenSelected(destinationToken) &&
			isNetworkSelected(destinationNetwork) &&
			account &&
			allFilteredPairs
		) {
			const tokenMinAmount =
				// @ts-ignore
				destinationNetworks?.[destinationNetwork]?.['tokens']?.[destinationToken]?.['withdrawMin'];
			const [pair] = allFilteredPairs.filter(
				(pair: Ticker) =>
					pair.symbol === START_TOKEN + destinationToken ||
					pair.symbol === destinationToken + START_TOKEN
			);
			if (pair) {
				const { filters } = pair; // TODO: app broke
				const [lot, notional] = filters;
				const notionalMinAmount = notional.minNotional * getPrice(destinationToken, START_TOKEN);
				const { minQty, maxQty } = lot;
				const lotSizeMinAmount = minQty * getPrice(START_TOKEN, START_TOKEN);
				const lotSizeMaxAmount = maxQty * getPrice(START_TOKEN, START_TOKEN);
				const walletMaxAmount = walletBalance && parseFloat(formatEther(walletBalance)).toFixed(3);

				minAmount = (
					Math.max(tokenMinAmount, notionalMinAmount, lotSizeMinAmount) * PROTOCOL_FEE_FACTOR
				).toString();
				maxAmount = (
					Math.min(lotSizeMaxAmount, Number(walletMaxAmount)) - networkFee.amount
				).toString();
			}
		}

		return { minAmount, maxAmount };
	}, [destinationToken, account, allFilteredPairs]);

	useEffect(() => {
		if (allPairs) {
			const filteredPairs = allPairs
				.filter((pair: any) => isSymbol(pair.symbol))
				.map((pair: any) => {
					return {
						baseAsset: pair.baseAsset,
						quoteAsset: pair.quoteAsset,
						symbol: pair.symbol,
						filters: pair.filters.filter(
							(filter: any) =>
								filter.filterType === 'LOT_SIZE' || filter.filterType === 'MIN_NOTIONAL'
						)
					};
				});
			setAllFilteredPairs(filteredPairs);
		}
	}, [allPairs]);

	useEffect(() => {
		if (allPrices) {
			const filteredPrices = allPrices.filter((price: any) => isSymbol(price.symbol));
			setAllFilteredPrices(filteredPrices);
		}
	}, [allPrices]);

	const withdrawFee = useMemo((): Fee => {
		if (isTokenSelected(destinationToken)) {
			const withdrawFee =
				// @ts-ignore
				destinationNetworks[destinationNetwork]?.['tokens']?.[destinationToken]?.['withdrawFee'];

			return { amount: Number(withdrawFee), currency: destinationToken };
		} else {
			return { amount: 0, currency: START_TOKEN };
		}
	}, [destinationToken]);

	const protocolFee = useMemo((): Fee => {
		if (amount) {
			return { amount: Number(amount) * PROTOCOL_FEE, currency: START_TOKEN };
		} else {
			return { amount: 0, currency: START_TOKEN };
		}
	}, [amount]);

	useEffect(() => {
		if (isTokenSelected(destinationToken)) {
			const namedValues = {
				scoin: 'GLMR',
				samt: utils.parseEther('10').toString(),
				fcoin: destinationToken,
				net: destinationNetwork,
				daddr: destinationAddress
			};
			const shortNamedValues = JSON.stringify(namedValues);
			const productId = utils.id(makeId(32));

			contract.estimateGas
				.createProcess(serviceAddress, productId, shortNamedValues)
				.then((gas: any) => {
					setGasAmount(gas);
				})
				.catch((err) => {
					throw new Error(err);
					// TODO: @Daniel:  add Toast to inform user?
				});
		}
	}, [destinationToken, destinationAddress]);

	const networkFee = useMemo((): Fee => {
		if (gasAmount && gasPrice) {
			const calculatedProcessFee = BigNumber.from(gasAmount['_hex']).mul(
				BigNumber.from(gasPrice['_hex'])
			);
			const calculatedTransactionFee = BigNumber.from(ESTIMATED_NETWORK_TRANSACTION_GAS).mul(
				BigNumber.from(gasPrice['_hex'])
			);
			const calculatedFee = BigNumber.from(calculatedProcessFee).add(
				BigNumber.from(calculatedTransactionFee)
			);

			return {
				amount: Number(utils.formatEther(calculatedFee['_hex'])),
				currency: START_TOKEN
			};
		} else {
			return { amount: 0, currency: START_TOKEN };
		}
	}, [gasAmount]);

	useEffect(() => {
		const localGraph = new Graph();
		for (let i = 0; i < allFilteredPairs.length; i++) {
			// @ts-ignore
			localGraph.addEdge(allFilteredPairs[i].baseAsset, allFilteredPairs[i].quoteAsset);
			if (allFilteredPairs.length === localGraph.edges) {
				setCexGraph(localGraph);
			}
		}
	}, [allFilteredPairs]);

	const cexFee = useMemo((): Fee[] => {
		if (cexGraph && isTokenSelected(destinationToken)) {
			let result = Number(amount);
			const graphPath: GraphType = cexGraph.bfs(START_TOKEN, destinationToken);

			if (graphPath) {
				const allCexFees: Fee[] = [];
				for (let i = 0; i < graphPath.distance; i++) {
					let edgePrice = 0;
					let ticker: undefined | Price = allFilteredPrices.find(
						(x: Price) => x.symbol === graphPath.path[i] + graphPath.path[i + 1]
					);
					if (ticker) {
						edgePrice = Number(ticker?.price);
					} else {
						ticker = allFilteredPrices.find(
							(x: any) => x.symbol === graphPath.path[i + 1] + graphPath.path[i]
						);
						edgePrice = 1 / Number(ticker?.price);
					}
					result *= edgePrice;
					allCexFees.push({
						amount: result * BINANCE_FEE,
						currency: graphPath.path[i + 1]
					});
				}

				return allCexFees;
			} else {
				return [{ amount: 0, currency: START_TOKEN }];
			}
		} else {
			return [{ amount: 0, currency: START_TOKEN }];
		}
	}, [destinationToken, amount]);

	const allFees = useMemo((): Fee => {
		const allFees = [...cexFee, withdrawFee, protocolFee, networkFee].reduce(
			(total: number, fee: Fee) =>
				fee.currency === FEE_CURRENCY
					? (total += fee.amount)
					: (total += fee.amount * getPrice(fee.currency, FEE_CURRENCY)),
			0
		);

		return { amount: allFees, currency: FEE_CURRENCY };
	}, [withdrawFee, networkFee, protocolFee, cexFee]);

	return {
		...marginalCosts,
		allFilteredPairs,
		allFilteredPrices,
		withdrawFee,
		protocolFee,
		networkFee,
		cexFee,
		allFees
	};
};
