import { useEffect, useState, useMemo } from 'react';
import {
	useLocalStorage,
	BINANCE_EXCHANGE_INFO,
	BINANCE_PRICE_TICKER,
	isTokenSelected,
	isNetworkSelected
} from '../helpers';
import { DestinationNetworks } from '../styles';
import destinationNetworks from '../data/destinationNetworks.json';
import { useEtherBalance, useEthers } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import axios from 'axios';
import {
	initialStorage,
	LOCAL_STORAGE_AUTH,
	BASE_URL,
	routes,
	useStore,
	VerificationEnum,
	startToken
} from '../helpers';

type JwtType = {
	iss: string;
	exp: number;
	type: string;
};

export const message = {
	ignore: 'ignore'
};

type Ticker = {
	baseAsset: string;
	symbol: string;
	quoteAsset: string;
	filters: any[];
};

export type Price = { symbol: string; price: string };

export const useAxios = () => {
	const [storage, setStorage] = useLocalStorage(LOCAL_STORAGE_AUTH, initialStorage);
	const {
		state: { accessToken, refreshToken },
		dispatch
	} = useStore();

	const axiosInstance = axios.create({
		baseURL: BASE_URL,
		headers: { Authorization: `Bearer ${accessToken}` }
	});

	axiosInstance.interceptors.request.use(
		async (req) => {
			const access: JwtType = jwt_decode(accessToken);
			const isAccessTokenExpired = dayjs.unix(access?.exp).diff(dayjs()) < 1;

			if (!isAccessTokenExpired) return req;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			req.headers!.Authorization = `Bearer ${refreshToken}`;

			const refresh: JwtType = jwt_decode(refreshToken);
			const isRefreshTokenExpired = dayjs.unix(refresh?.exp).diff(dayjs()) < 1;

			if (!isRefreshTokenExpired) return req;

			const newTokens = await axios.post(
				`${BASE_URL}${routes.refresh}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${refreshToken}`,
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				}
			);
			dispatch({ type: VerificationEnum.ACCESS, payload: newTokens.data.access });
			dispatch({ type: VerificationEnum.REFRESH, payload: newTokens.data.refresh });
			setStorage({ ...storage, access: newTokens.data.access, refresh: newTokens.data.refresh });
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			req.headers!.Authorization = `Bearer ${newTokens.data.access}`;

			return req;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	axiosInstance.interceptors.response.use(
		(res) => res,
		(error) => {
			if (Object.keys(error).length === 1 && 'message' in error) error.message = message.ignore;

			return Promise.reject(error);
		}
	);

	return axiosInstance;
};

export const useBinanceApi = () => {
	// TODO: error handling if API calls fail
	const [allPrices, setAllPrices] = useState<Price[]>([]);
	const [allFilteredPrices, setAllFilteredPrices] = useState<Price[]>([]);
	const [allPairs, setAllPairs] = useState<Ticker[]>([]);
	const [allFilteredPairs, setAllFilteredPairs] = useState<Ticker[]>([]);
	const {
		state: { destinationToken, destinationNetwork }
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
			(x: Price) => x.symbol === startToken + destinationToken
		);
		if (ticker) {
			edgePrice = Number(ticker?.price);
		} else {
			ticker = allFilteredPrices.find((x: any) => x.symbol === destinationToken + startToken);
			edgePrice = 1 / Number(ticker?.price);
		}

		return edgePrice;
	};

	const marginalCosts = useMemo(() => {
		let minAmount = '';
		let maxAmount = '';
		if (isTokenSelected(destinationToken) && isNetworkSelected(destinationNetwork) && account) {
			const tokenMinAmount =
				// @ts-ignore
				destinationNetworks?.[destinationNetwork]?.['tokens']?.[destinationToken]?.['withdrawMin'];
			const [pair] = allFilteredPairs.filter(
				(pair: Ticker) =>
					pair.symbol === startToken + destinationToken ||
					pair.symbol === destinationToken + startToken
			);
			const { filters } = pair; // TODO: app broke once
			const [lot, notional] = filters;
			const notionalMinAmount = notional.minNotional;
			const { minQty, maxQty } = lot;
			const lotSizeMinAmount = minQty * getPrice();
			const lotSizeMaxAmount = maxQty * getPrice();
			const walletMaxAmount = walletBalance && parseFloat(formatEther(walletBalance)).toFixed(3);

			minAmount = Math.max(tokenMinAmount, notionalMinAmount, lotSizeMinAmount).toString();
			maxAmount = Math.min(lotSizeMaxAmount, Number(walletMaxAmount)).toString();
			console.log({ minAmount, maxAmount });

			return { minAmount, maxAmount };
		}

		return null;
	}, [destinationToken, account]);

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
