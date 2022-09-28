export type ThemeName = 'light' | 'dark';

export type Theme = {
	name: ThemeName;
	font: {
		default: string;
		pure: string;
	};
	background: {
		default: string;
		mobile: string;
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
	};
};

export const lightTheme: Theme = {
	name: 'light',
	font: {
		default: '#5A5A5A',
		pure: '#5A5A5A'
	},
	background: {
		default: '#FFF',
		mobile: '#F0F0F0'
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
		default: '#212426'
	}
};

export const darkTheme: Theme = {
	name: 'dark',
	font: {
		default: '#8C8D8F',
		pure: '#FFF'
	},
	background: {
		default: '#161B20',
		mobile: '#1C2125'
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
		default: '#212426'
	}
};

export const theme: { light: Theme; dark: Theme } = { light: lightTheme, dark: darkTheme };
