import { createGlobalStyle } from 'styled-components';
import OpenSansBold from './fonts/OpenSans-Bold.ttf';
import OpenSansBoldItalic from './fonts/OpenSans-BoldItalic.ttf';
import OpenSansExtraBold from './fonts/OpenSans-ExtraBold.ttf';
import OpenSansExtraBoldItalic from './fonts/OpenSans-ExtraBoldItalic.ttf';
import OpenSansItalic from './fonts/OpenSans-Italic.ttf';
import OpenSansLight from './fonts/OpenSans-Light.ttf';
import OpenSansLightItalic from './fonts/OpenSans-LightItalic.ttf';
import OpenSansRegular from './fonts/OpenSans-Regular.ttf';
import OpenSansSemiBold from './fonts/OpenSans-SemiBold.ttf';
import OpenSansSemiBoldItalic from './fonts/OpenSans-SemiBoldItalic.ttf';

type FontWeight = 'thin' | 'regular' | 'semibold' | 'bold' | 'extrabold';
type FontStyle = 'normal' | 'italic';

export const fontFamily = '"Open Sans", Helvetica, Arial, sans-serif';

export const fontWeight: { [key in FontWeight]: number } = {
	thin: 100,
	regular: 400,
	semibold: 600,
	bold: 700,
	extrabold: 900
};

export const fontStyle: { [key in FontStyle]: string } = {
	normal: ' normal',
	italic: 'italic'
};

export type FontSize =
	| '12'
	| '14'
	| '16'
	| '20'
	| '24'
	| '28'
	| '32'
	| '36'
	| '40'
	| '44'
	| '48'
	| '52'
	| '60'
	| '72';

export const fontSize = {
	12: '0.75rem',
	14: '0.875rem',
	16: '1rem',
	20: '1.25rem',
	22: '1.375rem',
	24: '1.5rem',
	28: '1.75rem',
	32: '2rem',
	36: '2.25rem',
	40: '2.5rem',
	44: '2.75rem',
	48: '3rem',
	52: '3.25rem',
	60: '4rem',
	72: '5rem'
};

export const FontStyles = createGlobalStyle`
	@font-face {
		font-family: "Open Sans";
		font-style: ${fontStyle.normal};
		font-weight: ${fontWeight.bold};
		src: url(${OpenSansBold}) format("truetype");
		font-display: swap;
	}

	@font-face {
		font-family: "Open Sans";
		font-style: ${fontStyle.italic};
		font-weight: ${fontWeight.bold};
		src: url(${OpenSansBoldItalic}) format("truetype");
		font-display: swap;
	}

	@font-face {
		font-family: "Open Sans";
		font-style: ${fontStyle.normal};
		font-weight: ${fontWeight.extrabold};
		src: url(${OpenSansExtraBold}) format("truetype");
		font-display: swap;
	}

	@font-face {
		font-family: "Open Sans";
		font-style: ${fontStyle.italic};
		font-weight: ${fontWeight.extrabold};
		src: url(${OpenSansExtraBoldItalic}) format("truetype");
		font-display: swap;
	}

	@font-face {
		font-family: "Open Sans";
		font-style: ${fontStyle.italic};
		font-weight: ${fontWeight.regular};
		src: url(${OpenSansItalic}) format("truetype");
		font-display: swap;
	}

	@font-face {
		font-family: "Open Sans";
		font-style: ${fontStyle.normal};
		font-weight: ${fontWeight.thin};
		src: url(${OpenSansLight}) format("truetype");
		font-display: swap;
	}

	@font-face {
		font-family: "Open Sans";
		font-style: ${fontStyle.italic};
		font-weight: ${fontWeight.thin};
		src: url(${OpenSansLightItalic}) format("truetype");
		font-display: swap;
	}

	@font-face {
		font-family: "Open Sans";
		font-style: ${fontStyle.normal};
		font-weight: ${fontWeight.regular};
		src: url(${OpenSansRegular}) format("truetype");
		font-display: swap;
	}

	@font-face {
		font-family: "Open Sans";
		font-style: ${fontStyle.normal};
		font-weight: ${fontWeight.semibold};
		src: url(${OpenSansSemiBold}) format("truetype");
		font-display: swap;
	}

	@font-face {
		font-family: "Open Sans";
		font-style: ${fontStyle.italic};
		font-weight: ${fontWeight.semibold};
		src: url(${OpenSansSemiBoldItalic}) format("truetype");
		font-display: swap;
	}`;
