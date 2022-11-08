import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import type { Config } from '@usedapp/core';
import { DAppProvider, Mainnet, Moonbeam } from '@usedapp/core';
import App from './App';
import { AuthProvider } from './helpers';
import { ToastProvider } from './components';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const config: Config = {
	readOnlyChainId: Mainnet.chainId,
	readOnlyUrls: {
		[Mainnet.chainId]: 'https://eth-mainnet-public.unifra.io',
		[Moonbeam.chainId]: 'https://rpc.api.moonbeam.network',

		// [Localhost.chainId]: 'http://127.0.0.1:8545',
	},
	networks: [Mainnet, Moonbeam]
};

root.render(
	<StrictMode>
		<DAppProvider config={config}>
			<AuthProvider>
				<ToastProvider>
					<App />
				</ToastProvider>
			</AuthProvider>
		</DAppProvider>
	</StrictMode>
);
