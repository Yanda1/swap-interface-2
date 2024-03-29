import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { darkTheme } from '../styles';
import type { ColorType, Theme } from '../styles';

// TODO: should the enums be moved to the types.ts?
export enum VerificationEnum {
	ACCOUNT = 'SET_ACCOUNT_CONNECTED',
	NETWORK = 'SET_NETWORK_CONNECTED',
	USER = 'SET_USER_VERIFIED',
	ACCESS = 'SET_ACCESS_TOKEN',
	REFRESH = 'SET_REFRESH_TOKEN'
}

export enum ThemeEnum {
	THEME = 'SET_THEME'
}

export enum AmountEnum {
	AMOUNT = 'SET_AMOUNT'
}

export enum SourceEnum {
	NETWORK = 'SET_SOURCE_NETWORK',
	TOKEN = 'SET_SOURCE_TOKEN'
}

export enum DestinationEnum {
	WALLET = 'SET_DESTINATION_WALLET',
	NETWORK = 'SET_DESTINATION_NETWORK',
	TOKEN = 'SET_DESTINATION_TOKEN',
	ADDRESS = 'SET_DESTINATION_ADDRESS',
	AMOUNT = 'SET_DESTINATION_AMOUNT',
	MEMO = 'SET_DESTINATION_MEMO'
}

export enum KycEnum {
	STATUS = 'SET_KYC_STATUS'
}

export enum KycStatusEnum {
	PROCESS = 'PROCESS',
	INITIAL = 'INITIAL',
	REVIEW = 'REVIEW',
	REFUSED = 'REFUSED',
	PASS = 'PASS',
	DISABLE = 'DISABLE',
	REJECT = 'REJECT'
}

export enum BasicStatusEnum {
	INITIAL = 'INITIAL',
	PROCESS = 'PROCESS',
	REVIEW = 'REVIEW',
	PASS = 'PASS',
	REJECT = 'REJECT',
	SKIP = 'SKIP'
}

export enum ButtonEnum {
	BUTTON = 'SET_BUTTON_STATUS'
}

export enum ProductIdEnum {
	PRODUCTID = 'PRODUCTID'
}

export enum PairEnum {
	PAIR = 'PAIR'
}

export enum DefaultSelectEnum {
	WALlET = 'Select Wallet',
	TOKEN = 'Select Token',
	NETWORK = 'Select Network'
}

type SourceNetworks = 'ETH' | 'GLMR' | DefaultSelectEnum.NETWORK;

type VerificationAction = {
	type: VerificationEnum;
	payload: boolean | string;
};

type KycAction = {
	type: KycEnum;
	payload: KycStatusEnum;
};

type ButtonAction = {
	type: ButtonEnum;
	payload: { color: string; text: string };
};

type ThemeAction = {
	type: ThemeEnum;
	payload: Theme;
};

type SourceAction = {
	type: SourceEnum;
	payload: string;
};

type DestinationAction = {
	type: DestinationEnum;
	payload: string;
};

type AmountAction = {
	type: AmountEnum;
	payload: string;
};

type ProductIdAction = {
	type: ProductIdEnum;
	payload: string;
};

type PairAction = {
	type: PairEnum;
	payload: string;
};

type Action =
	| VerificationAction
	| ButtonAction
	| KycAction
	| ThemeAction
	| SourceAction
	| DestinationAction
	| AmountAction
	| ProductIdAction
	| PairAction;

type State = {
	isUserVerified: boolean;
	account: string;
	isNetworkConnected: boolean;
	kycStatus: KycStatusEnum;
	accessToken: string;
	refreshToken: string;
	buttonStatus: { color: string; text: string };
	theme: Theme;
	sourceNetwork: string;
	sourceToken: string;
	destinationWallet: string;
	destinationNetwork: string;
	destinationToken: string;
	destinationAddress: string;
	destinationAmount: string;
	destinationMemo: string;
	amount: string;
	productId: string;
	pair: string;
};

enum ButtonName {
	CONNECT_WALLET = 'CONNECT_WALLET',
	CHANGE_NETWORK = 'CHANGE_NETWORK',
	PASS_KYC = 'PASS_KYC',
	CHECK_KYC = 'CHECK_KYC',
	LOGIN = 'LOGIN'
}

type ButtonStatus = { [key in ButtonName]: { color: ColorType; text: string } };

export const button: ButtonStatus = {
	CONNECT_WALLET: { color: 'default', text: 'Connect Wallet' },
	CHANGE_NETWORK: { color: 'error', text: 'Change Network' },
	PASS_KYC: { color: 'warning', text: 'Pass KYC' },
	CHECK_KYC: { color: 'success', text: 'Check KYC' },
	LOGIN: { color: 'default', text: 'Login' }
};

const initialState: State = {
	isUserVerified: false,
	account: '',
	isNetworkConnected: false,
	accessToken: '',
	refreshToken: '',
	kycStatus: KycStatusEnum.PROCESS,
	buttonStatus: button.CONNECT_WALLET,
	theme: darkTheme,
	destinationWallet: DefaultSelectEnum.WALlET,
	sourceNetwork: DefaultSelectEnum.NETWORK as SourceNetworks,
	sourceToken: DefaultSelectEnum.TOKEN,
	destinationNetwork: DefaultSelectEnum.NETWORK,
	destinationToken: DefaultSelectEnum.TOKEN,
	destinationAddress: '',
	destinationAmount: '',
	destinationMemo: '',
	amount: '',
	productId: '',
	pair: ''
};

type Dispatch = (action: Action) => void;

const AuthContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

const authReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case VerificationEnum.ACCOUNT:
			return { ...state, account: action.payload as string };
		case VerificationEnum.NETWORK:
			return { ...state, isNetworkConnected: action.payload as boolean };
		case VerificationEnum.USER:
			return { ...state, isUserVerified: action.payload as boolean };
		case VerificationEnum.ACCESS:
			return { ...state, accessToken: action.payload as string };
		case VerificationEnum.REFRESH:
			return { ...state, refreshToken: action.payload as string };
		case KycEnum.STATUS:
			return { ...state, kycStatus: action.payload };
		case ButtonEnum.BUTTON:
			return { ...state, buttonStatus: action.payload };
		case ThemeEnum.THEME:
			return { ...state, theme: action.payload };
		case AmountEnum.AMOUNT:
			return { ...state, amount: action.payload };
		case SourceEnum.NETWORK:
			return { ...state, sourceNetwork: action.payload as SourceNetworks };
		case SourceEnum.TOKEN:
			return { ...state, sourceToken: action.payload };
		case DestinationEnum.WALLET:
			return { ...state, destinationWallet: action.payload };
		case DestinationEnum.NETWORK:
			return { ...state, destinationNetwork: action.payload };
		case DestinationEnum.TOKEN:
			return { ...state, destinationToken: action.payload };
		case DestinationEnum.ADDRESS:
			return { ...state, destinationAddress: action.payload };
		case DestinationEnum.AMOUNT:
			return { ...state, destinationAmount: action.payload };
		case DestinationEnum.MEMO:
			return { ...state, destinationMemo: action.payload };
		case ProductIdEnum.PRODUCTID:
			return { ...state, productId: action.payload };
		case PairEnum.PAIR:
			return { ...state, pair: action.payload };
		default:
			return state;
	}
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);
	const value = { state, dispatch };
	const { account, isNetworkConnected, kycStatus, isUserVerified } = state;

	useEffect(() => {
		if (!account) {
			dispatch({
				type: ButtonEnum.BUTTON,
				payload: button.CONNECT_WALLET
			});
		}

		if (!isNetworkConnected && account) {
			dispatch({
				type: ButtonEnum.BUTTON,
				payload: button.CHANGE_NETWORK
			});
		}

		if (account && !isUserVerified && isNetworkConnected) {
			dispatch({ type: ButtonEnum.BUTTON, payload: button.LOGIN });
		}

		if (kycStatus === KycStatusEnum.PASS && isNetworkConnected && account) {
			dispatch({ type: VerificationEnum.USER, payload: true });
		}

		if (kycStatus !== KycStatusEnum.PASS) {
			dispatch({ type: VerificationEnum.USER, payload: false });
		}
	}, [account, isNetworkConnected, kycStatus, isUserVerified]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useStore = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useStore must be used within a AuthProvider');
	}

	return context;
};
