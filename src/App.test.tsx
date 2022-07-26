import { render } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './helpers';

test('renders without crashing', () => {
	render(
		<AuthProvider>
			<App />
		</AuthProvider>
	);
});
