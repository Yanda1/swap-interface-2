import 'jest-styled-components';
import { render } from '@testing-library/react';
import { Arrow } from '../../components';
import { AuthProvider } from '../../helpers';

describe('Arrow', () => {
	it('should render a default button', () => {
		const { getByTestId } = render(
			<AuthProvider>
				<Arrow open={true} />
			</AuthProvider>
		);

		expect(getByTestId('arrow')).toMatchSnapshot();
	});
});
