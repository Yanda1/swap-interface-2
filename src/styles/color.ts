export type Theme = 'light' | 'dark';

export type Colors = {
  name: Theme;
  default: string;
  pure: string;
  background: {
    default: string;
  };
  button: {
    default: string;
    error: string;
    warning: string;
    icon: string;
    disabled: string;
  };
};

export const lightTheme: Colors = {
  name: 'light',
  default: '#5A5A5A',
  pure: '#5A5A5A',
  background: {
    default: '#FFF',
  },
  button: {
    default: '#00A8E8',
    error: '#DE3434',
    warning: '#FD862F',
    icon: '#172631',
    disabled: '#6D6D6D',
  },
};

export const darkTheme: Colors = {
  name: 'dark',
  pure: '#FFF',
  default: '#8C8D8F',
  background: {
    default: '#161B20',
  },
  button: {
    default: '#00A8E8',
    error: '#DE3434',
    warning: '#FD862F',
    icon: '#172631',
    disabled: '#6D6D6D',
  },
};
