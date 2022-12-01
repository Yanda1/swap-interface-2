import type { Config } from 'jest';

const config: Config = {
	transformIgnorePatterns: ['/node_modules/(?!axios)/)']
};

export default config;
