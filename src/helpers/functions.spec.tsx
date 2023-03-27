import { darkTheme, lightTheme } from '../styles';
import {
	beautifyNumbers,
	formatDate,
	hexToRgbA,
	isArrayType,
	isLightTheme,
	isNetworkSelected,
	isSwapConfirmed,
	isSwapFailed,
	isSwapRejected,
	isTokenSelected
} from '../helpers';

describe('Helpers should return the correct values', () => {
	it(' isLightTheme() function should return the correct theme', () => {
		expect(isLightTheme(lightTheme)).toBeTruthy();
		expect(isLightTheme(darkTheme)).not.toBeTruthy();
	});

	it('beautifyNumbers() function should return the correct value', () => {
		expect(beautifyNumbers({ n: '12.00000000001', digits: 11 })).toBe('12.00000000001');
		expect(beautifyNumbers({ n: '12.0010000000' })).toBe('12.001');
		expect(beautifyNumbers({ n: 12.00000000001, digits: 11 })).toBe('12.00000000001');
		expect(beautifyNumbers({ n: 12.001 })).toBe('12.001');
	});

	it('isNetworkSelected() function should return the correct value', () => {
		expect(isNetworkSelected('Select Network')).toBe(false);
		expect(isNetworkSelected('')).toBe(false);
		expect(isNetworkSelected('BNB')).toBe(true);
	});

	it('isTokenSelected() function should return the correct value', () => {
		expect(isTokenSelected('Select Token')).toBe(false);
		expect(isTokenSelected('')).toBe(false);
		expect(isTokenSelected('ETH')).toBe(true);
	});

	it('isArrayType() function should return the correct value', () => {
		expect(isArrayType({})).toBe(false);
		expect(isArrayType('string')).toBe(false);
		expect(isArrayType([{}])).toBe(true);
		expect(isArrayType([{ age: 12, name: 'test' }, 'string'])).toBe(true);
	});

	it('hexToRgbA() function should return the correct value', () => {
		expect(hexToRgbA('#000000', '0.5')).toBe('rgba(0,0,0,0.5)');
		expect(hexToRgbA('#b80213')).toBe('rgba(184,2,19,1)');
	});

	it('isSwapRejected() function should return the correct value', () => {
		expect(isSwapRejected('Exception', 'user rejected transaction')).toBe(true);
		expect(isSwapRejected('Exception', 'user confirmed transaction')).toBe(false);
		expect(isSwapRejected('Success', 'user rejected transaction')).toBe(false);
		expect(isSwapRejected('Success', 'user confirmed transaction')).toBe(false);
	});

	it('isSwapFailed() function should return the correct value', () => {
		expect(isSwapFailed('Fail')).toBe(true);
		expect(isSwapFailed('Exception')).toBe(false);
		expect(isSwapFailed('Success')).toBe(false);
	});

	it('isSwapConfirmed() function should return the correct value', () => {
		expect(isSwapConfirmed('Success')).toBe(true);
		expect(isSwapConfirmed('Exception')).toBe(false);
		expect(isSwapConfirmed('Fail')).toBe(false);
	});

	it('formatDate() function should return the correct value', () => {
		expect(formatDate(1669895567)).toBe('01/12/2022 11:52:47');
		expect(formatDate(undefined)).toBe('n/a');
	});
});
