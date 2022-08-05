import React from 'react';
import ReactDOM from 'react-dom/client';
import type { Config } from '@usedapp/core';
import { DAppProvider, Moonbeam } from '@usedapp/core';
import App from './App';
import { FontStyles } from './styles';
import { AuthProvider } from './helpers';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const config: Config = {
	readOnlyChainId: Moonbeam.chainId,
	readOnlyUrls: {
		[Moonbeam.chainId]: 'https://rpc.api.moonbeam.network',
		// [Localhost.chainId]: 'http://127.0.0.1:8545',
	},
	networks: [Moonbeam],
};

root.render(
	<React.StrictMode>
		<DAppProvider config={config}>
			<AuthProvider>
				<FontStyles/>
				<App/>
			</AuthProvider>
		</DAppProvider>

	</React.StrictMode>
);
