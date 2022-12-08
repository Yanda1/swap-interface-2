import 'jest-styled-components';
import { render } from '@testing-library/react';
import { IconButton } from './iconButton';
import { AuthProvider } from '../../helpers';

describe('IconButton', () => {
	it('should render a disabled IconButton with img and Text', () => {
		const { getByTestId } = render(
			<AuthProvider>
				<IconButton disabled icon="ETH" />
			</AuthProvider>
		);

		expect(getByTestId('icon-button')).toMatchSnapshot();
	});

	it('should render a IconButton with icon only', () => {
		const { getByTestId } = render(
			<AuthProvider>
				<IconButton iconOnly icon="ETH" />
			</AuthProvider>
		);

		expect(getByTestId('icon-button')).toMatchSnapshot();
	});
});
