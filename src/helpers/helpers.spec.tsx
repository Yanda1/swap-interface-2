
import { render, fireEvent, screen, findByText, getByRole } from '@testing-library/react';
import { lightTheme, darkTheme } from '../styles';
import { pxToRem } from '../styles';
import {isLightTheme, useBreakpoint} from '../helpers';
import { useState, useLayoutEffect } from 'react';
import { breakpoint } from './../styles';

describe('Helpers should return the correct values', () => {

	it(' isLightTheme function should return the correct theme', () => {
		expect(isLightTheme(lightTheme)).toBeTruthy();
		expect(isLightTheme(darkTheme)).not.toBeTruthy();
	});
});
