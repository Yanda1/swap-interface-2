export type ThemeName = 'light' | 'dark';

export type Theme = {
	name: ThemeName;
	font: {
		default: string;
		pure: string;
		select: string;
	};
	background: {
		default: string;
		mobile: string;
		history: string;
	};
	icon: {
		default: string;
	};
	button: {
		default: string;
		error: string;
		warning: string;
		icon: string;
		disabled: string;
		success: string;
		wallet: string;
		transparent: string;
	};
	modal: {
		default: string;
		background: string;
		shadow: string;
		border: string;
	};
};

export const lightTheme: Theme = {
	name: 'light',
	font: {
		default: '#5A5A5A',
		pure: '#5A5A5A',
		select: '#B4B4B4'
	},
	background: {
		default: '#FFF',
		mobile: '#F0F0F0',
		history: '#494949'
	},
	icon: {
		default: '#E8F0F6'
	},
	button: {
		default: '#00A8E8',
		error: '#DE3434',
		warning: '#FD862F',
		icon: '#172631',
		disabled: '#6D6D6D',
		success: '#18C108',
		wallet: '#505050',
		transparent: 'transparent'
	},
	modal: {
		default: '#E5E5E5',
		background: '#D6D6D6',
		shadow: '#868686',
		border: '#E5E5E5'
	}
};

export const darkTheme: Theme = {
	name: 'dark',
	font: {
		default: '#8C8D8F',
		pure: '#FFF',
		select: '#B4B4B4'
	},
	background: {
		default: '#161B20',
		mobile: '#1C2125',
		history: '#494949'
	},
	icon: {
		default: '#172631'
	},
	button: {
		default: '#00A8E8',
		error: '#DE3434',
		warning: '#FD862F',
		icon: '#172631',
		disabled: '#6D6D6D',
		success: '#18C108',
		wallet: '#505050',
		transparent: 'transparent'
	},
	modal: {
		default: '#1C2125',
		background: '#212426',
		shadow: '#0A0A0A',
		border: '#505050'
	}
};

export const theme: { light: Theme; dark: Theme } = { light: lightTheme, dark: darkTheme };
