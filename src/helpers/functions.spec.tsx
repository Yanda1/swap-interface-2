import { lightTheme, darkTheme } from '../styles';
import {
	isLightTheme,
	realParseFloat,
	beautifyNumbers,
	isNetworkSelected,
	isTokenSelected
} from '../helpers';

describe('Helpers should return the correct values', () => {
	it(' isLightTheme() function should return the correct theme', () => {
		expect(isLightTheme(lightTheme)).toBeTruthy();
		expect(isLightTheme(darkTheme)).not.toBeTruthy();
	});

	it('realParseFloat() function should return the correct value', () => {
		expect(realParseFloat('2,28343')).toBe('2.28343');
		expect(realParseFloat('2,243.91')).toBe('2243.91');
		expect(realParseFloat('6.81')).toBe('6.81');
		expect(realParseFloat('9.876,54')).toBe('9876.54');
	});

	it('beautifyNumbers() function should return the correct value', () => {
		expect(beautifyNumbers({ n: '12.00000000001' })).toBe('12.00000000001');
		expect(beautifyNumbers({ n: '12.0010000000' })).toBe('12.001');
		expect(beautifyNumbers({ n: 12.00000000001 })).toBe('12.00000000001');
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
});
