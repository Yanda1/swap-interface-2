import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Portal } from '..';

describe('Switch', () => {
	it('should render a large portal', () => {
		const { getByText } = render(
			<AuthProvider>
				<Portal size="large" isOpen={true} handleClose={() => console.log('close portal')}>
					portal
				</Portal>
			</AuthProvider>
		);

		expect(getByText('portal')).toMatchSnapshot();
	});

	it('should render a small portal ', () => {
		const { getByText } = render(
			<AuthProvider>
				<Portal isOpen={true} handleClose={() => console.log('close portal')}>
					portal
				</Portal>
			</AuthProvider>
		);

		expect(getByText('portal')).toMatchSnapshot();
	});
});
