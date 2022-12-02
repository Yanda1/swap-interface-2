import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Spinner } from '../../components';
import type { SpinnerSizeProps } from '../../components';
import { darkTheme } from '../../styles';

describe('Switch', () => {
	it.each<[SpinnerSizeProps, string]>([
		['small', darkTheme.background.default],
		['medium', darkTheme.background.tertiary]
	])('should match snapshot for a %s sized spinner', (size, color) => {
		const { getByTestId } = render(
			<AuthProvider>
				<Spinner size={size} color={color} data-testid="spinner" />
			</AuthProvider>
		);

		expect(getByTestId('spinner')).toMatchSnapshot();
	});
});
