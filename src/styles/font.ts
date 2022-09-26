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
	normal: 'normal',
	italic: 'italic'
};

export const fontSize = {
	12: '0.75rem',
	14: '0.875rem',
	16: '1rem',
	18: '1.125rem',
	20: '1.25rem',
	22: '1.375rem',
	24: '1.5rem',
	26: '1.625',
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
