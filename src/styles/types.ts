import type { Theme } from '.';
import destinationNetworks from '../data/destinationNetworks.json';

export type ThemeProps = {
	theme: Theme;
};

export type networks = typeof destinationNetworks;
