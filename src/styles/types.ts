import type { Theme } from '../styles';
import destinationNetworks from '../data/destinationNetworks.json';
import { CONTRACT_ADDRESSES } from '../helpers';

export type ThemeProps = {
	theme: Theme;
};

export type ColorType = 'default' | 'error' | 'warning' | 'icon' | 'success';

export type Networks = typeof destinationNetworks;
export type DestinationNetworks = keyof Networks;
export type ContractAdress = keyof typeof CONTRACT_ADDRESSES;

export type ApiAuthType = { access: string; is_kyced: boolean; refresh: string };
