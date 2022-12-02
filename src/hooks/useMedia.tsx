import { useState, useLayoutEffect } from 'react';
import type { Breakpoint, BreakpointOrNumber } from '../styles';
import { breakpoint } from '../styles';

const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
	navigator.userAgent
);

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
	const isStringType = typeof size === typeof 'string';

	return {
		isBreakpointWidth: windowWidth < (isStringType ? breakpoint[size as Breakpoint] : size),
		isBreakpointHeight: windowHeight < (isStringType ? breakpoint[size as Breakpoint] : size)
	};
};

export const useMedia = (size: BreakpointOrNumber) => {
	const { isBreakpointWidth, isBreakpointHeight } = useBreakpoint(size);

	return { isMobileDevice, mobileWidth: isBreakpointWidth, mobileHeight: isBreakpointHeight };
};
