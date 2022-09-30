import { Buffer } from 'buffer';
import { BASE_URL, BINANCE_PROD_URL, BINANCE_SCRIPT, BIZ_ENTRY_KEY } from '../helpers';
import axios from 'axios';
import type { ApiAuthType } from '../helpers';

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
		apiHost: BINANCE_PROD_URL,
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
