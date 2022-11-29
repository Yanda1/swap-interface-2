import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Spinner } from '../../components';
import { darkTheme } from '../../styles';

describe('Switch', () => {
	it('should render a small spinner with default color', () => {
		const { getByTestId } = render(
			<AuthProvider>
				<Spinner size="small" color={darkTheme.background.default} data-testid="spinner" />
			</AuthProvider>
		);

		expect(getByTestId('spinner')).toMatchSnapshot();
	});

	it('should render a medium spinner with tertiary color', () => {
		const { getByTestId } = render(
			<AuthProvider>
				<Spinner size="medium" color={darkTheme.background.tertiary} data-testid="spinner" />
			</AuthProvider>
		);

		expect(getByTestId('spinner')).toMatchSnapshot();
	});
});
export {};
