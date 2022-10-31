import type { Breakpoint, BreakpointOrNumber, Theme } from './../styles';
import { breakpoint } from './../styles';
import { useLayoutEffect, useState } from 'react';

export const isLightTheme = (theme: Theme): boolean => theme.name === 'light';

export const isNetworkSelected = (network: string) =>
	network !== 'Select Network' && network !== '';

export const isTokenSelected = (token: string) => token !== 'Select Token' && token !== '';

type BeautifyNumbers = {
	n: string | number;
	digits?: number;
};

const trimZeros = (res: string): string =>
	res.slice(-1) === '0' && res.slice(-2, -1) !== '.' ? trimZeros(res.slice(0, -1)) : res;

export const beautifyNumbers = ({ n, digits = 8 }: BeautifyNumbers): string => {
	let res = '';
	if (n === '') return 'n/a';
	if (typeof n === 'number') {
		res = n.toFixed(digits);
	} else {
		res = Number(n).toFixed(digits);
	}

	return trimZeros(res);
};

export const useWindowSize = () => {
	const [size, setSize] = useState([0, 0]);
	useLayoutEffect(() => {
		const updateSize = () => {
			setSize([window.innerWidth, window.innerHeight]);
		};
		window.addEventListener('resize', updateSize);
		updateSize();

		return () => window.removeEventListener('resize', updateSize);
	}, []);

	return size;
};

export const useBreakpoint = (size: BreakpointOrNumber) => {
	const [windowWidth, windowHeight] = useWindowSize();
	const isString = typeof size === typeof 'string';

	return {
		isBreakpointWidth: windowWidth < (isString ? breakpoint[size as Breakpoint] : size),
		isBreakpointHeight: windowHeight < (isString ? breakpoint[size as Breakpoint] : size)
	};
};

export const realParseFloat = (s: string): string => {
	if (s.split('').includes('e')) return s;
	s = s.replace(/[^\d,.-]/g, ''); // strip everything except numbers, dots, commas and negative sign
	if (
		navigator.language.substring(0, 2) !== 'de' &&
		/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(s)
	) {
		// if not in German locale and matches #,###.######
		s = s.replace(/,/g, ''); // strip out commas

		return s; // convert to number
	} else if (/^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(s)) {
		// either in German locale or not match #,###.###### and now matches #.###,########
		s = s.replace(/\./g, ''); // strip out dots
		s = s.replace(/,/g, '.'); // replace comma with dot

		return s;
	} // try #,###.###### anyway
	else {
		s = s.replace(/,/g, ''); // strip out commas

		return s; // convert to number
	}
};
