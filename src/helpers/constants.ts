import { Mainnet, Moonbeam } from '@usedapp/core';

export const LOCAL_STORAGE_THEME = 'darkMode';
export const LOCAL_STORAGE_AUTH = 'auth';
export const LOCAL_STORAGE_HISTORY = 'history';

export const INITIAL_STORAGE = {
	access: '',
	refresh: '',
	account: '',
	isKyced: false
};

export const MESSAGE = {
	ignore: 'ignore',
	failed: 'Request failed'
};

export const BIZ_ENTRY_KEY = 'BMYBIT';
export const BINANCE_PROD_URL = 'https://api.commonservice.io';
export const BINANCE_DEV_URL = 'https://dip-qacb.sdtaop.com';
export const BINANCE_SCRIPT =
	'https://static.saasexch.com/static/binance/static/kyc-ui/sdk/0.0.2/sdk.js';
export const BINANCE_PRICE_TICKER = 'https://www.binance.com/api/v3/ticker/price';
export const BINANCE_EXCHANGE_INFO = 'https://api.binance.com/api/v3/exchangeInfo';

export const BASE_URL = 'https://auth-app-aq3rv.ondigitalocean.app/';
// https://auth-app-aq3rv.ondigitalocean.app/account/withdraw/details?id=7ef91f76c79b4793b417e32fbffd73b8
export const MOONBEAM_URL = 'https://rpc.api.moonbeam.network';
export const ETHEREUM_URL = 'https://mainnet.infura.io/v3';

export const routes = {
	getNonce: 'nonce?address=',
	auth: 'auth',
	kycToken: 'kyc/token',
	kycStatus: 'kyc/status',
	refresh: 'auth/refresh',
	transactionDetails: 'account/withdraw/details?id='
};

export const PROTOCOL_FEE = 0.002;
export const BINANCE_FEE = 0.002;
export const PROTOCOL_FEE_FACTOR = 1 / (1 - PROTOCOL_FEE);
export const FEE_CURRENCY = 'USDT';

export const ESTIMATED_NETWORK_TRANSACTION_GAS = 55_437;
export const SERVICE_ADDRESS = '0xeB56c1d19855cc0346f437028e6ad09C80128e02';

export const WEI_TO_GLMR = 1 / 1_000_000_000_000_000_000;

export const CONTRACT_ADDRESSES = {
	1: '0xa9EB7218Fd8153c93aD1b4acf42330E7044E75A1',
	1284: '0xb8F18F75D5513F2fAA6477f0b54cC676eaedcAC4'
};

export const CHAINS = {
	// TODO: add types
	'1284': { name: 'GLMR', network: Moonbeam.chainId },
	'1': { name: 'ETH', network: Mainnet.chainId }
};

export const NETWORK_TO_ID = {
	GLMR: '1284',
	ETH: '1'
};

export type ChainIds = keyof typeof CHAINS;

export const GRAPH_URLS = {
	1: 'https://api.thegraph.com/subgraphs/name/yanda1/moonbeam-yanda', // TODO: needs to be replaced with the ETH_GRAP_URL
	1284: 'https://api.thegraph.com/subgraphs/name/yanda1/moonbeam-yanda'
};

export const BLOCKS_AMOUNT = 30;

export const makeId = (length: number) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
};
