import type { Breakpoint, BreakpointOrNumber, Theme } from './../styles';
import { breakpoint } from './../styles';
import { useLayoutEffect, useState } from 'react';
import { format, utcToZonedTime } from 'date-fns-tz';

export const isLightTheme = (theme: Theme): boolean => theme.name === 'light';
const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

export const isNetworkSelected = (network: string) =>
	network !== 'Select Network' && network !== ''; // TODO: refine both functions - nullish check - and create enum for "Select Network / Token"

export const isArrayType = (value: any) => typeof value === 'object' && Array.isArray(value);

export const isTokenSelected = (token: string) => token !== 'Select Token' && token !== '';

type BeautifyNumbers = {
	n: string | number;
	digits?: number;
};

const trimZeros = (res: string): string =>
	res.slice(-1) === '0' && res.slice(-2, -1) !== '.' ? trimZeros(res.slice(0, -1)) : res;

export const beautifyNumbers = ({ n, digits = 8 }: BeautifyNumbers): string => {
	let res = '';
	if (!n) return '';
	if (typeof n === 'number') {
		res = n.toFixed(digits);
	} else {
		res = (+n).toFixed(digits);
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

export const hexToRgbA = (hex: string, alpha = '1'): string => {
	const [r, g, b] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));

	return `rgba(${r},${g},${b},${alpha})`;
};

export const isSwapRejected = (status: string, errorMessage: any) =>
	status === 'Exception' && errorMessage === 'user rejected transaction';

export const formatDate = (ts: number | undefined): string =>
	ts ? format(utcToZonedTime(new Date(ts * 1000), timeZone), 'dd/MM/yyyy HH:mm:ss') : 'n/a';
