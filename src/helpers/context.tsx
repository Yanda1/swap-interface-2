import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import type { Theme } from '../styles';
import { darkTheme } from '../styles';
import type { ColorType } from '../components';

export enum VerificationEnum {
	ACCOUNT = 'SET_ACCOUNT_CONNECTED',
	NETWORK = 'SET_NETWORK_CONNECTED',
	USER = 'SET_USER_VERIFIED'
}

export enum ThemeEnum {
	THEME = 'SET_THEME'
}

export enum DestinationNetworkEnum {
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

type VerificationAction = {
	type: VerificationEnum;
	payload: boolean;
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

type DestinationNetworkAction = {
	type: DestinationNetworkEnum;
	payload: string;
};

type Action =
	| VerificationAction
	| ButtonAction
	| KycAction
	| ThemeAction
	| DestinationNetworkAction;

type State = {
	isUserVerified: boolean;
	isAccountConnected: boolean;
	isNetworkConnected: boolean;
	kycStatus: KycStatusEnum;
	buttonStatus: { color: string; text: string };
	theme: Theme;
	destinationWallet: string;
	destinationNetwork: string;
	destinationToken: string;
	destinationAddress: string;
	destinationAmount: string;
	destinationMemo: string;
};

type ButtonStatus = {
	// TODO: refactor type
	CONNECT_WALLET: { color: ColorType; text: string };
	CHANGE_NETWORK: { color: ColorType; text: string };
	PASS_KYC: { color: ColorType; text: string };
	CHECK_KYC: { color: ColorType; text: string };
	// GET_NONCE: { color: ColorType; text: string };
};

export const buttonText = {
	CONNECT_WALLET: 'Connect Wallet',
	CHANGE_NETWORK: 'Change Network',
	PASS_KYC: 'Pass KYC',
	CHECK_KYC: 'Check KYC'
	// GET_NONCE: 'Get Nonce'
};

export const buttonType: ButtonStatus = {
	CONNECT_WALLET: { color: 'default', text: buttonText.CONNECT_WALLET },
	CHANGE_NETWORK: { color: 'error', text: buttonText.CHANGE_NETWORK },
	PASS_KYC: { color: 'warning', text: buttonText.PASS_KYC },
	CHECK_KYC: { color: 'success', text: buttonText.CHECK_KYC }
	// GET_NONCE: { color: 'default', text: buttonText.GET_NONCE }
};

const initialState: State = {
	isUserVerified: false,
	isAccountConnected: false,
	isNetworkConnected: false,
	kycStatus: KycStatusEnum.PROCESS,
	buttonStatus: buttonType.CONNECT_WALLET,
	theme: darkTheme,
	destinationWallet: 'Select Wallet',
	destinationNetwork: 'Select Network',
	destinationToken: 'Select Token',
	destinationAddress: '',
	destinationAmount: '',
	destinationMemo: ''
};

type Dispatch = (action: Action) => void;

const AuthContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

const authReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case VerificationEnum.ACCOUNT:
			return { ...state, isAccountConnected: action.payload };
		case VerificationEnum.NETWORK:
			return { ...state, isNetworkConnected: action.payload };
		case KycEnum.STATUS:
			return { ...state, kycStatus: action.payload };
		case ButtonEnum.BUTTON:
			return { ...state, buttonStatus: action.payload };
		case VerificationEnum.USER:
			return { ...state, isUserVerified: action.payload };
		case ThemeEnum.THEME:
			return { ...state, theme: action.payload };
		case DestinationNetworkEnum.WALLET:
			return { ...state, destinationWallet: action.payload };
		case DestinationNetworkEnum.NETWORK:
			return { ...state, destinationNetwork: action.payload };
		case DestinationNetworkEnum.TOKEN:
			return { ...state, destinationToken: action.payload };
		case DestinationNetworkEnum.ADDRESS:
			return { ...state, destinationAddress: action.payload };
		case DestinationNetworkEnum.AMOUNT:
			return { ...state, destinationAmount: action.payload };
		case DestinationNetworkEnum.MEMO:
			return { ...state, destinationMemo: action.payload };
		default:
			return state;
	}
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);
	const value = { state, dispatch };
	const { isAccountConnected, isNetworkConnected, kycStatus } = state;

	useEffect(() => {
		if (!isAccountConnected) {
			dispatch({
				type: ButtonEnum.BUTTON,
				payload: buttonType.CONNECT_WALLET
			});
		}

		if (!isNetworkConnected && isAccountConnected) {
			dispatch({
				type: ButtonEnum.BUTTON,
				payload: buttonType.CHANGE_NETWORK
			});
		}

		// if (
		// 	(kycStatus === KycStatusEnum.REJECT ||
		// 		kycStatus === KycStatusEnum.REFUSED ||
		// 		kycStatus === KycStatusEnum.PROCESS) &&
		// 	isNetworkConnected &&
		// 	isAccountConnected
		// ) {
		// 	dispatch({
		// 		type: ButtonEnum.BUTTON,
		// 		payload: buttonType.PASS_KYC
		// 	});
		// }

		// if (kycStatus === KycStatusEnum.DISABLE || kycStatus === KycStatusEnum.REVIEW) {
		// 	dispatch({
		// 		type: ButtonEnum.BUTTON,
		// 		payload: buttonType.CHECK_KYC
		// 	});
		// }

		if (kycStatus === KycStatusEnum.PASS && isNetworkConnected && isAccountConnected) {
			dispatch({ type: VerificationEnum.USER, payload: true });
		}

		if (kycStatus !== KycStatusEnum.PASS || !isNetworkConnected || !isAccountConnected) {
			dispatch({ type: VerificationEnum.USER, payload: false });
		}
	}, [isAccountConnected, isNetworkConnected, kycStatus]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useStore = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useStore must be used within a AuthProvider');
	}

	return context;
};
