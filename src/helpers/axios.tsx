import { useCallback, useEffect, useState } from 'react';
import { BASE_URL, BINANCE_DEV_URL, BINANCE_SCRIPT, BIZ_ENTRY_KEY } from './index';
import axios from 'axios';

export enum STATUS_ENUM {
	NONCE = 'NONCE',
	AUTH = 'AUTH',
	PASS = 'PASS'
}

type LocalStorageProps = {
	is_kyced: string;
	refresh: string;
	access: string;
	account: string;
} | null;

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

const getStorageValue = (key: string, defaultValue: LocalStorageProps) => {
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem(key);

		return saved !== null ? (JSON.parse(saved) as object) : defaultValue;
	}
};

export const useLocalStorage = (key: string, defaultValue: LocalStorageProps) => {
	const [value, setValue] = useState(() => {
		return getStorageValue(key, defaultValue);
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

				return tokenRes.data as string; // TODO: if is_kyced TRUE store in localStorage
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
		async (authToken: string) => {
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
		// eslint-disable-next-line
		[authToken]
	);

	useEffect(() => {
		fetchData(authToken).catch((err) => console.log(err)); // TODO: check promise call
		// eslint-disable-next-line
	}, [fetchData]);

	return { loading, error, kycStatus, kycToken };
};
