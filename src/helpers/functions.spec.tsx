import { lightTheme, darkTheme } from '../styles';
import {
	isLightTheme,
	beautifyNumbers,
	isNetworkSelected,
	isTokenSelected,
	hexToRgbA,
	isArrayType,
	isSwapRejected
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
});
