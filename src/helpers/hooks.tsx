import { useEffect, useState } from 'react';
import { useLocalStorage, BINANCE_EXCHANGE_INFO, BINANCE_PRICE_TICKER } from '../helpers';
import { DestinationNetworks } from '../styles';
import destinationNetworks from '../data/destinationNetworks.json';
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
	VerificationEnum
} from '.';

type JwtType = {
	iss: string;
	exp: number;
	type: string;
};

export const message = {
	ignore: 'ignore'
};

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
	const [allPrices, setAllPrices] = useState<{ symbol: string; price: string }[]>([]);
	const [allFilteredPrices, setAllFilteredPrices] = useState<{ symbol: string; price: string }[]>(
		[]
	);
	const [allPairs, setAllPairs] = useState([]);
	const [allFilteredPairs, setAllFilteredPairs] = useState([]);

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

	useEffect(() => {
		void getExchangeInfo();
		void getTickerData();
	}, []);

	useEffect(() => {
		if (allPairs) {
			const filteredPairs = allPairs.filter((pair: any) => isSymbol(pair.symbol));
			setAllFilteredPairs(filteredPairs);
		}

		if (allPrices) {
			const filteredPrices = allPrices.filter((price: any) => isSymbol(price.symbol));
			setAllFilteredPrices(filteredPrices);
		}
	}, [allPairs, allPrices]);

	return { allFilteredPairs, allFilteredPrices };
};
