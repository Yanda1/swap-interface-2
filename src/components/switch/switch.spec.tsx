import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Switch } from '../../components';

describe('Switch', () => {
	it('should render a default button', () => {
		const { getByTestId } = render(
			<AuthProvider>
				<Switch />
			</AuthProvider>
		);

		expect(getByTestId('switch')).toMatchSnapshot();
	});
});
