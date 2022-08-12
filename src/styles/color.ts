export type ThemeName = 'light' | 'dark';

export type Theme = {
	name: ThemeName;
	default: string;
	pure: string;
	arrow: string;
	font: {
		default: string;
		pure: string;
	};
	background: {
		default: string;
		mobile: string;
	};
	color: {
		pure: string;
		default: string;
	};
	button: {
		default: string;
		error: string;
		warning: string;
		icon: string;
		disabled: string;
		selected: string;
		success: string;
	};
	modal: {
		default: string;
	};
};

export const lightTheme: Theme = {
	name: 'light',
	default: '#5A5A5A',
	pure: '#5A5A5A',
	arrow: '#ADADAD',
	font: {
		default: '#5A5A5A',
		pure: '#5A5A5A',
	},
	background: {
		default: '#FFF',
		mobile: '#F0F0F0'
	},
	color: {
		default: '#5A5A5A',
		pure: '#5A5A5A',
	},
	button: {
		default: '#00A8E8',
		error: '#DE3434',
		warning: '#FD862F',
		icon: '#172631',
		disabled: '#6D6D6D',
		selected: 'transparent',
	},
	modal: {
		default: '#212426',
	}
};

export const darkTheme: Theme = {
	name: 'dark',
	default: '#8C8D8F', // TODO: refactor font colors
	pure: '#FFF',  // TODO: refactor font colors
	arrow: '#D9D9D9',
	font: {
		default: '#8C8D8F',
		pure: '#FFF'
	},
	background: {
		default: '#161B20',
		mobile: '#1C2125'
	},
	color: {
		pure: '#FFF',
		default: '#8C8D8F',
	},
	button: {
		default: '#00A8E8',
		error: '#DE3434',
		warning: '#FD862F',
		icon: '#172631',
		disabled: '#6D6D6D',
		selected: 'transparent',
		success: '#18C108'
	},
	modal: {
		default: '#212426',
	}
};
