import { pxToRem, mediaQuery } from '../styles';

describe('Styles functions should return the correct values', () => {
	it(' pxToRem() function should return the correct number in rem', () => {
		expect(pxToRem(428)).toEqual('26.75rem');
		expect(pxToRem(160)).toEqual('10rem');
		expect(pxToRem(100)).toEqual('6.25rem');
		expect(pxToRem(50)).toEqual('3.125rem');
		expect(pxToRem(25)).toEqual('1.5625rem');
	});

	it(' mediaQuery() function should return the correct values', () => {
		expect(mediaQuery('xxs')).toEqual('@media (max-width: 375px)');
		expect(mediaQuery('s')).toEqual('@media (max-width: 760px)');
		expect(mediaQuery('m')).toEqual('@media (max-width: 1000px)');
		expect(mediaQuery('l')).toEqual('@media (max-width: 1300px)');
		expect(mediaQuery('xl')).toEqual('@media (max-width: 1760px)');
		expect(mediaQuery('xxl')).toEqual('@media (max-width: 1920px)');
	});
});
