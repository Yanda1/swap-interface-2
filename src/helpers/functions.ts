import type { Breakpoint, Theme } from './../styles';
import { useState, useLayoutEffect } from 'react';
import { breakpoint } from './../styles';

export const isLightTheme = (theme: Theme) => theme.name === 'light';

const useWindowSize = () => {
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

export const useBreakpoint = (size: Breakpoint) => {
	const [windowWidth, windowHeight] = useWindowSize();

	return {
		isBreakpointWidth: windowWidth < breakpoint[size],
		isBreakpointHeight: windowHeight < breakpoint[size]
	};
};

export const realParseFloat = (s: string): string => {
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
