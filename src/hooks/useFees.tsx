import { useEffect, useState, useMemo, useCallback } from 'react';
import {
	BINANCE_EXCHANGE_INFO,
	BINANCE_PRICE_TICKER,
	CONTRACT_ADDRESSES,
	ESTIMATED_NETWORK_TRANSACTION_GAS,
	isTokenSelected,
	makeId,
	PROTOCOL_FEE,
	SERVICE_ADDRESS,
	Graph,
	BINANCE_FEE,
	FEE_CURRENCY,
	PROTOCOL_FEE_FACTOR,
	isNetworkSelected,
	useStore
} from '../helpers';
import type { Price, Fee } from '../helpers';
import type { GraphType, DestinationNetworks } from '../helpers';
import CONTRACT_DATA from '../data/YandaMultitokenProtocolV1.json';
import sourceNetworks from '../data/sourceNetworks.json';
import destinationNetworks from '../data/destinationNetworks.json';
import { useEthers, useGasPrice, useEtherBalance, useTokenBalance } from '@usedapp/core';
import { BigNumber, utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { formatEther } from '@ethersproject/units';
import axios from 'axios';

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
			sourceToken,
			destinationToken,
			destinationNetwork,
			amount,
			isNetworkConnected,
			destinationAddress,
			account
		}
	} = useStore();

	const { chainId, library: web3Provider } = useEthers();
	const sourceTokenData =
		// @ts-ignore
		sourceNetworks[chainId?.toString()]?.tokens[sourceToken];
	const gasPrice = useGasPrice();
	const contractAddress = CONTRACT_ADDRESSES?.[chainId as keyof typeof CONTRACT_ADDRESSES] || '';
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const contract = new Contract(contractAddress, contractInterface, web3Provider);

	if (web3Provider && isNetworkConnected) {
		contract.connect(web3Provider.getSigner());
	}
	const walletBalance = useEtherBalance(account);

	const tokenContractAddr = '0x4Fabb145d64652a948d72533023f6E7A623C7C53';
	const tokenBalance = useTokenBalance(tokenContractAddr, account);

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
				['ETH']
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

	const withdrawFee = useMemo((): Fee => {
		if (isTokenSelected(destinationToken)) {
			const withdrawFee =
				// @ts-ignore
				destinationNetworks[destinationNetwork]?.['tokens']?.[destinationToken]?.['withdrawFee'];

			return { amount: Number(withdrawFee), currency: destinationToken };
		} else {
			return { amount: 0, currency: sourceToken };
		}
	}, [destinationToken]);

	const protocolFee = useMemo((): Fee => {
		if (amount) {
			return { amount: Number(amount) * PROTOCOL_FEE, currency: sourceToken };
		} else {
			return { amount: 0, currency: sourceToken };
		}
	}, [amount]);

	useEffect(() => {
		if (isTokenSelected(destinationToken)) {
			const namedValues = {
				scoin: 'ETH',
				samt: utils.parseEther('10').toString(),
				fcoin: destinationToken,
				net: destinationNetwork,
				daddr: destinationAddress
			};
			const shortNamedValues = JSON.stringify(namedValues);
			const productId = utils.id(makeId(32));

			if (sourceTokenData?.isNative) {
				contract.estimateGas['createProcess(address,bytes32,string)'](
					SERVICE_ADDRESS,
					productId,
					shortNamedValues
				)
					.then((gas: any) => {
						setGasAmount(gas);
					})
					.catch((err) => {
						throw new Error(err);
						// TODO: @Daniel:  add Toast to inform user?
					});
			} else {
				contract.estimateGas['createProcess(address,address,bytes32,string)'](
					sourceTokenData?.contractAddr,
					SERVICE_ADDRESS,
					productId,
					shortNamedValues
				)
					.then((gas: any) => {
						setGasAmount(gas);
					})
					.catch((err) => {
						throw new Error(err);
						// TODO: @Daniel:  add Toast to inform user?
					});
			}
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
				currency: sourceToken
			};
		} else {
			return { amount: 0, currency: sourceToken };
		}
	}, [gasAmount]);

	useEffect(() => {
		const localGraph = new Graph();
		for (let i = 0; i < allFilteredPairs.length; i++) {
			localGraph.addEdge(allFilteredPairs[i].baseAsset, allFilteredPairs[i].quoteAsset);
			if (allFilteredPairs.length === localGraph.edges) {
				setCexGraph(localGraph);
			}
		}
	}, [allFilteredPairs]);

	const cexFee = useMemo((): Fee[] => {
		if (cexGraph && isTokenSelected(destinationToken)) {
			let result = Number(amount);
			const graphPath: GraphType = cexGraph.bfs(sourceToken, destinationToken);

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
				return [{ amount: 0, currency: sourceToken }];
			}
		} else {
			return [{ amount: 0, currency: sourceToken }];
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

	const marginalCosts = useMemo(() => {
		let minAmount = '';
		let maxAmount = '';
		if (
			isTokenSelected(destinationToken) &&
			isNetworkSelected(destinationNetwork) &&
			account &&
			allFilteredPairs
		) {
			const destTokenMinWithdrawal =
				// @ts-ignore
				destinationNetworks?.[destinationNetwork]?.['tokens']?.[destinationToken]?.['withdrawMin'];
			const [pair] = allFilteredPairs.filter(
				(pair: Ticker) =>
					pair.symbol === sourceToken + destinationToken ||
					pair.symbol === destinationToken + sourceToken
			);
			if (pair) {
				const { filters } = pair;
				const [lot, notional] = filters;
				let notionalMinAmount = +notional.minNotional;
				const price = getPrice(destinationToken, sourceToken);
				if (destinationToken === pair.quoteAsset) {
					notionalMinAmount *= price;
				}
				const tokenMinAmount4Withdrawal = destTokenMinWithdrawal * price;

				const { minQty, maxQty } = lot;
				const lotSizeMinAmount = +minQty * getPrice(sourceToken, sourceToken);
				const lotSizeMaxAmount = +maxQty * getPrice(sourceToken, sourceToken); // TODO: check if numbers only modified when displayed to user (not)
				const walletMaxAmount = walletBalance && formatEther(walletBalance);
				const tokenMaxAmount = tokenBalance && parseFloat(formatEther(tokenBalance)).toFixed(3);

				console.log(tokenMinAmount4Withdrawal, notionalMinAmount, lotSizeMinAmount);
				minAmount = (
					Math.max(tokenMinAmount4Withdrawal, notionalMinAmount, lotSizeMinAmount) *
					PROTOCOL_FEE_FACTOR
				).toString();

				if (chainId) {
					const sourceTokenData =
						// @ts-ignore
						sourceNetworks[chainId.toString()]?.tokens[sourceToken];

					if (sourceTokenData?.isNative) {
						maxAmount = (
							Math.min(lotSizeMaxAmount, Number(walletMaxAmount)) - networkFee.amount
						).toString();
					} else {
						maxAmount = Math.min(lotSizeMaxAmount, Number(tokenMaxAmount)).toString();
					}
				}
			}
		}

		return { minAmount, maxAmount };
	}, [destinationToken, account, networkFee]);

	return {
		...marginalCosts,
		withdrawFee,
		protocolFee,
		networkFee,
		cexFee,
		allFees,
		getPrice
	};
};
