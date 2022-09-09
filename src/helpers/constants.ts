import { pxToRem } from '../styles';

export const LOCAL_STORAGE_THEME = 'current-theme';
export const LOCAL_STORAGE_AUTH = 'tiwanaku';

export const BIZ_ENTRY_KEY = 'YANDA';
export const BINANCE_PROD_URL = 'https://api.commonservice.io';
export const BINANCE_DEV_URL = 'https://dip-qacb.sdtaop.com';
export const BINANCE_SCRIPT =
	'https://static.saasexch.com/static/binance/static/kyc-ui/sdk/0.0.2/sdk.js';
export const BINANCE_PRICE_TICKER = 'https://www.binance.com/api/v3/ticker/price';
export const BINANCE_EXCHANGE_INFO = 'https://api.binance.com/api/v3/exchangeInfo';

export const BASE_URL = 'https://auth-app-aq3rv.ondigitalocean.app/';
export const MOONBEAM_URL = 'https://rpc.api.moonbeam.network';

export const PROTOCOL_FEE = 0.002;
export const BINANCE_FEE = 0.002;
export const startToken = 'GLMR';
export const ESTIMATED_NETWORK_TRANSACTION_GAS = 55_437;
export const serviceAddress = '0xeB56c1d19855cc0346f437028e6ad09C80128e02';

export const CONTRACT_ADDRESSES = {
	1284: '0x76df36994aA2C3551895679D15F5e99d064A90fB',
	1287: '0x2d249342F1F6D549CE8253782c8A2b9218c68fB2',
	// 1281: '0xb91C2eeaA0c475115069a6ED4bc601337a22788E',
	31337: '0x0165878A594ca255338adfa4d48449f69242Eb8F'
};

export const makeId = (length: number) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
};

export const defaultBorderRadius = pxToRem(6);

export const horizontalPadding = 10;
