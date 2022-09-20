import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import {
	BASE_URL,
	BINANCE_DEV_URL,
	BINANCE_SCRIPT,
	BIZ_ENTRY_KEY,
	BINANCE_EXCHANGE_INFO,
	BINANCE_PRICE_TICKER
} from '../helpers';
import axios from 'axios';
import destinationNetworks from '../data/destinationNetworks.json';
import type { ApiAuthType, DestinationNetworks } from '../styles';

export enum STATUS_ENUM {
	NONCE = 'NONCE',
	AUTH = 'AUTH',
	PASS = 'PASS'
}

export const routes = {
	getNonce: 'nonce?address=',
	auth: 'auth',
	kycToken: 'kyc/token',
	kycStatus: 'kyc/status',
	refresh: 'auth/refresh'
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

export const getAuthTokensFromNonce = async (account: string, library: any) => {
	try {
		const res = await axios.request({
			url: `${BASE_URL}${routes.getNonce}${account}`
		});
		try {
			const msg = getMetamaskMessage(res.data.nonce);
			const signature = await library?.send('personal_sign', [account, msg]);
			try {
				const tokenRes = await axios.request({
					url: `${BASE_URL}${routes.auth}`,
					method: 'POST',
					data: { address: account, signature }
				});

				return tokenRes.data as ApiAuthType;
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
