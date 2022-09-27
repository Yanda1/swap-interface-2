import { useEffect, useState, useMemo } from 'react';
import {
	BINANCE_EXCHANGE_INFO,
	BINANCE_PRICE_TICKER,
	isTokenSelected,
	isNetworkSelected,
	PROTOCOL_FEE_FACTOR
} from '../helpers';
import { DestinationNetworks } from '../helpers';
import destinationNetworks from '../data/destinationNetworks.json';
import { useEtherBalance, useEthers } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import { useStore, START_TOKEN } from '../helpers';
import type { Price } from '../helpers';
import axios from 'axios';

type Ticker = {
	baseAsset: string;
	symbol: string;
	quoteAsset: string;
	filters: any[];
};

export const useBinance = () => {
	// TODO: error handling if API calls fail
	const [allPrices, setAllPrices] = useState<Price[]>([]);
	const [allFilteredPrices, setAllFilteredPrices] = useState<Price[]>([]);
	const [allPairs, setAllPairs] = useState<Ticker[]>([]);
	const [allFilteredPairs, setAllFilteredPairs] = useState<Ticker[]>([]);
	const {
		state: { destinationToken, destinationNetwork, fees }
	} = useStore();
	const { account } = useEthers();
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

	const uniqueTokens: string[] = Object.keys(destinationNetworks).reduce(
		(tokens: string[], network: string) => {
			const networkTokens = Object.keys(
				destinationNetworks?.[network as DestinationNetworks]?.['tokens']
			);

			const allTokens = [...tokens, networkTokens];

			return [...new Set(allTokens.flat(1))];
		},
		['GLMR']
	);

	const isSymbol = (symbol: string): boolean => {
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
	};

	const getPrice = () => {
		// TODO: convert to helper and use it in fee.tsx as well
		let edgePrice = 0;
		let ticker: undefined | Price = allFilteredPrices.find(
			(x: Price) => x.symbol === START_TOKEN + destinationToken
		);
		if (ticker) {
			edgePrice = Number(ticker?.price);
		} else {
			ticker = allFilteredPrices.find((x: any) => x.symbol === destinationToken + START_TOKEN);
			edgePrice = 1 / Number(ticker?.price);
		}

		return edgePrice;
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
				const notionalMinAmount = notional.minNotional * getPrice();
				const { minQty, maxQty } = lot;
				const lotSizeMinAmount = minQty; // TODO: once we offer more than GLMR this has to be refined => minQty * baseAsset (which is already GLMR)
				const lotSizeMaxAmount = maxQty;
				const walletMaxAmount = walletBalance && parseFloat(formatEther(walletBalance)).toFixed(3);

				minAmount = (
					Math.max(tokenMinAmount, notionalMinAmount, lotSizeMinAmount) * PROTOCOL_FEE_FACTOR
				).toString();
				maxAmount = (
					Math.min(lotSizeMaxAmount, Number(walletMaxAmount)) - fees.NETWORK.amount
				).toString();

				return { minAmount, maxAmount };
			}
		}

		return null;
	}, [destinationToken, account, allFilteredPairs]);

	useEffect(() => {
		void getExchangeInfo();
		void getTickerData();
	}, []);

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

		if (allPrices) {
			const filteredPrices = allPrices.filter((price: any) => isSymbol(price.symbol));
			setAllFilteredPrices(filteredPrices);
		}
	}, [allPairs, allPrices]);

	return { ...marginalCosts, allFilteredPairs, allFilteredPrices };
};
