export type Breakpoint = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

export const breakpoint: { [key in Breakpoint]: number } = {
	xxs: 375,
	xs: 480,
	s: 760,
	m: 1062,
	l: 1300,
	xl: 1760,
	xxl: 1920
};

export const viewport = {
	375: '23.4375rem',
	480: '30rem',
	760: '47.5rem',
	1062: '66.375rem',
	1300: '81.25rem',
	1760: '110rem',
	1920: '120rem'
};

export type BreakpointOrNumber = Breakpoint | number;

export const mediaQuery = (
	maxBreakpoint: BreakpointOrNumber,
	minBreakpoint?: BreakpointOrNumber
): string =>
	`${
		minBreakpoint
			? `@media (min-width: ${
					typeof minBreakpoint !== 'number' && breakpoint[minBreakpoint]
			  }px) and `
			: ''
	}${!minBreakpoint ? '@media ' : ''}(max-width: ${
		(typeof maxBreakpoint !== 'number' && breakpoint[maxBreakpoint]) || maxBreakpoint
	}px)`;

export const pxToRem = (px: number): string => `${px / 16}rem`;
