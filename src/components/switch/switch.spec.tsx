import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Switch } from '../../components';

describe('Button', () => {
	it('should render a default button', () => {
		const { getByText } = render(
			<AuthProvider>
				<Switch />
			</AuthProvider>
		);

		expect(getByText(/Switch/)).toMatchSnapshot();
	});
});
