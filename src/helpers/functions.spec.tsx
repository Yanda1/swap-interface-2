import { lightTheme, darkTheme } from '../styles';
import {isLightTheme} from '../helpers';

describe('Helpers should return the correct values', () => {
	it(' isLightTheme() function should return the correct theme', () => {
		expect(isLightTheme(lightTheme)).toBeTruthy();
		expect(isLightTheme(darkTheme)).not.toBeTruthy();
	});
});
