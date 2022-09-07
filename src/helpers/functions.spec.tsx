import { lightTheme, darkTheme } from '../styles';
import { isLightTheme, realParseFloat } from '../helpers';

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
});
