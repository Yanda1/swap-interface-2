import { Dispatch, SetStateAction } from 'react';
import destinationNetworks from '../data/destinationNetworks.json';
import { CONTRACT_ADDRESSES } from '../helpers';

export type Networks = typeof destinationNetworks;
export type DestinationNetworks = keyof Networks;
export type ContractAdress = keyof typeof CONTRACT_ADDRESSES;

export type ApiAuthType = { access: string; is_kyced: boolean; refresh: string };

export type Price = { symbol: string; price: string };
export type Fee = { amount: number; currency: string };
export type GraphType = false | { distance: number; path: string[] };

export type TransactionData = {
	blockNumber: number;
	header: {
		timestamp: number;
		symbol: string;
		scoin: string;
		fcoin: string;
		samt: string;
		net: string;
	};
	content: {
		qty: string;
		price: string;
		timestamp: number;
		cexFee: string;
		withdrawFee: string;
		success: boolean;
	} | null;
	gasFee: string;
	withdrawl: {
		amount: string;
		withdrawFee: string;
		url: string;
	} | null;
};

export type SetValue<T> = Dispatch<SetStateAction<T>>;
