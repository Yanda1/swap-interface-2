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
	useStore,
	NETWORK_TO_ID
} from '../helpers';
import type { GraphType, DestinationNetworks, Price, Fee } from '../helpers';
import CONTRACT_DATA from '../data/YandaMultitokenProtocolV1.json';
import { useEthers, useGasPrice, useEtherBalance, useTokenBalance } from '@usedapp/core';
import { BigNumber, utils, providers } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { formatEther, formatUnits } from '@ethersproject/units';
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
			sourceNetwork,
			destinationToken,
			destinationNetwork,
			amount,
			isNetworkConnected,
			destinationAddress,
			account,
			availableSourceNetworks: SOURCE_NETWORKS,
			availableDestinationNetworks: DESTINATION_NETWORKS,
		}
	} = useStore();

	const { chainId, library: web3Provider } = useEthers();
	const sourceTokenData = useMemo(
		() =>
			// eslint-disable-next-line
			SOURCE_NETWORKS ?
				// @ts-ignore
				// eslint-disable-next-line
				SOURCE_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.['tokens'][sourceToken]
			: {},
		[SOURCE_NETWORKS, sourceToken]
	);
	const gasPrice = useGasPrice();
	const contractAddress = CONTRACT_ADDRESSES?.[chainId as keyof typeof CONTRACT_ADDRESSES] || '';
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const contract = new Contract(contractAddress, contractInterface, web3Provider);

	if (web3Provider && isNetworkConnected && !(web3Provider instanceof providers.FallbackProvider)) {
		contract.connect(web3Provider.getSigner());
	}
	const walletBalance = useEtherBalance(account);
	const tokenBalance = useTokenBalance(sourceTokenData?.contractAddr, account);

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
			DESTINATION_NETWORKS && isNetworkSelected(sourceNetwork) && isTokenSelected(sourceToken)
				? // @ts-ignore
				  Object.keys(DESTINATION_NETWORKS[NETWORK_TO_ID[sourceNetwork]]?.[sourceToken]).reduce(
						(tokens: string[], network: string) => {
							const networkTokens = Object.keys(
								// @ts-ignore
								DESTINATION_NETWORKS[NETWORK_TO_ID[sourceNetwork]]?.[sourceToken]?.[
									network as DestinationNetworks
								]?.['tokens']
							);

							const allTokens = [...tokens, networkTokens];

							return [...new Set(allTokens.flat(1))];
						},
						[sourceToken]
				  )
				: [],
		[DESTINATION_NETWORKS, sourceToken]
	);

	const uniquePairs: string[] = useMemo(
		() => {
			if(uniqueTokens) {
				const result = [];
				// let k = 0;

				// for (let i = 0; i < uniqueTokens.length - 1; i++) {
				// 	k++;
				// 	for (let j = k; j < uniqueTokens.length; j++) {
				// 		result.push(uniqueTokens[i] + uniqueTokens[j]);
				// 		result.push(uniqueTokens[j] + uniqueTokens[i]);
				// 	}
				// }
				
				// TODO: use above logic for "double-swap" P.S. need performance improvement
				for (let i = 0; i < uniqueTokens.length - 1; i++) {
					result.push(uniqueTokens[i] + sourceToken);
					result.push(sourceToken + uniqueTokens[i]);
				}
				
				return result;
			} else {
				return [];
			}
		},
		[uniqueTokens, sourceToken]
	);

	useEffect(() => {
		if (allPairs) {
			const filteredPairs = allPairs
				.filter((pair: any) => uniquePairs.includes(pair.symbol))
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
	}, [allPairs, uniqueTokens]);

	useEffect(() => {
		if (allPrices) {
			const filteredPrices = allPrices.filter((price: any) => uniquePairs.includes(price.symbol));
			setAllFilteredPrices(filteredPrices);
		}
	}, [allPrices, uniqueTokens]);

	const getPrice = useCallback(
		(base: string, quote: string): number => {
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
		},
		[allFilteredPrices]
	);

	const withdrawFee = useMemo((): Fee => {
		if (isTokenSelected(destinationToken)) {
			const withdrawFee =
				// @ts-ignore
				DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
					'tokens'
				]?.[destinationToken]?.['withdrawFee'];

			return { amount: +withdrawFee, currency: destinationToken, name: 'Withdrawal' };
		} else {
			return { amount: 0, currency: destinationToken, name: 'Withdrawal' };
		}
	}, [destinationToken, sourceToken]);

	const protocolFee = useMemo((): Fee => {
		if (amount) {
			return { amount: +amount * PROTOCOL_FEE, currency: sourceToken, name: 'Protocol' };
		} else {
			return { amount: 0, currency: sourceToken, name: 'Protocol' };
		}
	}, [amount]);

	useEffect(() => {
		if (isTokenSelected(destinationToken) && isTokenSelected(sourceToken)) {
			const namedValues = {
				scoin: sourceToken,
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
	}, [destinationToken, destinationAddress, sourceNetwork, sourceToken]);

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
				amount: +utils.formatEther(calculatedFee['_hex']),
				currency: sourceToken,
				name: 'Network'
			};
		} else {
			return { amount: 0, currency: sourceToken, name: 'Network' };
		}
	}, [gasAmount, sourceToken]);

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
			let result = +amount;
			const graphPath: GraphType = cexGraph.bfs(sourceToken, destinationToken);

			if (graphPath) {
				const allCexFees: Fee[] = [];
				for (let i = 0; i < graphPath.distance; i++) {
					let edgePrice = 0;
					let ticker: undefined | Price = allFilteredPrices.find(
						(x: Price) => x.symbol === graphPath.path[i] + graphPath.path[i + 1]
					);
					if (ticker) {
						edgePrice = +ticker?.price;
					} else {
						ticker = allFilteredPrices.find(
							(x: any) => x.symbol === graphPath.path[i + 1] + graphPath.path[i]
						);
						edgePrice = 1 / Number(ticker?.price);
					}
					result *= edgePrice;
					allCexFees.push({
						amount: result * BINANCE_FEE,
						currency: graphPath.path[i + 1],
						name: 'CEX'
					});
				}

				return allCexFees;
			} else {
				return [{ amount: 0, currency: sourceToken, name: 'CEX' }];
			}
		} else {
			return [{ amount: 0, currency: sourceToken, name: 'CEX' }];
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

	const percentageOfAllFeesToAmount = useMemo(
		() => (amount ? (allFees.amount / (getPrice(sourceToken, FEE_CURRENCY) * +amount)) * 100 : ''),
		[allFees.amount, destinationToken, amount]
	);

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
				DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
					'tokens'
				]?.[destinationToken]?.['withdrawMin'];
			const [pair] = allFilteredPairs.filter(
				(pair: Ticker) =>
					pair.symbol === `${sourceToken}${destinationToken}` ||
					pair.symbol === `${destinationToken}${sourceToken}`
			);
			if (pair) {
				const { filters } = pair;
				const [lot, notional] = filters;
				let notionalMinAmount = +notional.minNotional;
				const price = getPrice(destinationToken, sourceToken);
				if (destinationToken === pair.quoteAsset) {
					notionalMinAmount *= price;
				}
				const tokenMinAmount4Withdrawal = +destTokenMinWithdrawal * price;

				const { minQty, maxQty } = lot;
				const lotSizeMinAmount = +minQty * getPrice(destinationToken, sourceToken);
				const lotSizeMaxAmount = +maxQty * getPrice(destinationToken, sourceToken);
				const walletMaxAmount = walletBalance && formatEther(walletBalance);
				const tokenMaxAmount =
					tokenBalance && +formatUnits(tokenBalance, sourceTokenData?.decimals);
				minAmount = (
					Math.max(tokenMinAmount4Withdrawal, notionalMinAmount, lotSizeMinAmount) *
					PROTOCOL_FEE_FACTOR
				).toString();

				if (sourceTokenData?.isNative) {
					maxAmount = (
						Math.min(lotSizeMaxAmount, Number(walletMaxAmount)) - networkFee.amount
					).toString();
				} else {
					maxAmount = Math.min(lotSizeMaxAmount, Number(tokenMaxAmount)).toString();
				}
			}
		}

		return { minAmount, maxAmount };
	}, [destinationToken, account, networkFee, allFilteredPairs, tokenBalance, walletBalance]);

	return {
		...marginalCosts,
		withdrawFee,
		protocolFee,
		networkFee,
		cexFee,
		allFees,
		getPrice,
		percentageOfAllFeesToAmount
	};
};
