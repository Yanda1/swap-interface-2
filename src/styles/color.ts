export type ThemeName = 'light' | 'dark';

export type Theme = {
	name: ThemeName;
	default: string;
	pure: string;
	background: {
		default: string;
		mobile: string;
	};
	button: {
		default: string;
		error: string;
		warning: string;
		icon: string;
		disabled: string;
		success: string;
	};
};

export const lightTheme: Theme = {
	name: 'light',
	default: '#5A5A5A',
	pure: '#5A5A5A',
	background: {
		default: '#FFF',
		mobile: '#F0F0F0'
	},
	button: {
		default: '#00A8E8',
		error: '#DE3434',
		warning: '#FD862F',
		icon: '#172631',
		disabled: '#6D6D6D',
		success: '#18C108'
	}
};

export const darkTheme: Theme = {
	name: 'dark',
	pure: '#FFF',
	default: '#8C8D8F',
	background: {
		default: '#161B20',
		mobile: '#1C2125'
	},
	button: {
		default: '#00A8E8',
		error: '#DE3434',
		warning: '#FD862F',
		icon: '#172631',
		disabled: '#6D6D6D',
		success: '#18C108'
	}
};
