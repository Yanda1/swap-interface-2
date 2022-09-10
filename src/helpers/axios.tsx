import { useCallback, useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import {
	BASE_URL,
	BINANCE_DEV_URL,
	BINANCE_SCRIPT,
	BIZ_ENTRY_KEY,
	BINANCE_EXCHANGE_INFO,
	BINANCE_PRICE_TICKER
} from './index';
import axios from 'axios';
import destinationNetworks from '../data/destinationNetworks.json';

export enum STATUS_ENUM {
	NONCE = 'NONCE',
	AUTH = 'AUTH',
	PASS = 'PASS'
}

type LocalStorageProps = {
	isKyced: boolean;
	refresh: string;
	access: string;
	account: string;
};

export const apiCall = {
	getNonce: 'nonce?address=',
	auth: 'auth',
	kycToken: 'kyc/token',
	kycStatus: 'kyc/status',
	refresh: 'refresh'
};

export const getMetamaskMessage = (nonce: string): string =>
	`0x${Buffer.from('Please sign this one time nonce: ' + nonce, 'utf8').toString('hex')}`;

export const loadBinanceKycScript = (cb?: any) => {
	const existingId = document.getElementById('binance-kcy-script');

	if (!existingId) {
		const binanceSdkScript = document.createElement('script');
		binanceSdkScript.src = BINANCE_SCRIPT;
		binanceSdkScript.id = 'binance-kcy-script';
		document.body.appendChild(binanceSdkScript);

		binanceSdkScript.onload = () => {
			if (cb) cb();
		};
	}
	if (existingId && cb) cb();
};

export const makeBinanceKycCall = (authToken: string) => {
	// @ts-ignore
	const binanceKyc = new BinanceKyc({
		authToken,
		bizEntityKey: BIZ_ENTRY_KEY,
		apiHost: BINANCE_DEV_URL,
		onMessage: ({ typeCode }: any) => {
			if (typeCode === '102') {
				binanceKyc.switchVisible(true);
			}
		}
	});
};

const getStorageValue = (key: string) => {
	const defaultValue = {
		access: '',
		refresh: '',
		account: '',
		isKyced: false
	} as LocalStorageProps;

	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem(key);

		return saved ? (JSON.parse(saved) as LocalStorageProps) : defaultValue;
	}
};

export const useLocalStorage = (key: string) => {
	const [value, setValue] = useState(() => {
		return getStorageValue(key);
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue];
};

export const getAuthTokensFromNonce = async (account: string, library: any) => {
	try {
		const res = await axios.request({
			url: `${BASE_URL}${apiCall.getNonce}${account}`
		});
		try {
			const msg = getMetamaskMessage(res.data.nonce);
			const signature = await library?.send('personal_sign', [account, msg]);
			try {
				const tokenRes = await axios.request({
					url: `${BASE_URL}${apiCall.auth}`,
					method: 'POST',
					data: { address: account, signature }
				});

				return tokenRes.data as { access: string; is_kyced: boolean; refresh: string }; // TODO: define Type
			} catch (err: any) {
				throw new Error(err);
			}
		} catch (err: any) {
			throw new Error(err);
		}
	} catch (err: any) {
		throw new Error(err);
	}
};

export const useKyc = (
	authToken: string
): { loading: boolean; error: any; kycStatus: string; kycToken: string } => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [kycStatus, setKycStatus] = useState('');
	const [kycToken, setKycToken] = useState('');

	const fetchData = useCallback(
		async (authToken: string): Promise<void> => {
			try {
				setLoading(true);
				const statusRes = await axios.request({
					// TODO: check typing and if kycStatus is from right place
					url: `${BASE_URL}${apiCall.kycStatus}`,
					headers: {
						Authorization: `Bearer ${authToken}`
					}
				});
				setKycStatus(statusRes.data.statusInfo.kycStatus);
			} catch (err: any) {
				setError(err);
			} finally {
				setLoading(false);
			}

			try {
				setLoading(true);
				const tokenRes = await axios.request({
					url: `${BASE_URL}${apiCall.kycToken}`,
					headers: {
						Authorization: `Bearer ${authToken}`
					}
				});
				setKycToken(tokenRes.data.token);
			} catch (err: any) {
				setError(err);
			} finally {
				setLoading(false);
			}
		},
		[authToken]
	);

	useEffect(() => {
		void fetchData(authToken);
	}, [fetchData]);

	return { loading, error, kycStatus, kycToken };
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
			// @ts-ignore
			const networkTokens = Object.keys(destinationNetworks?.[network]?.['tokens']);

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
