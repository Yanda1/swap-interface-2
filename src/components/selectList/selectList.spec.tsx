import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { SelectList } from './selectList';

describe('SelectList', () => {
	const networksList = ['ETH', 'BTC', 'USDT'];
	it('should render a select list with 3 items', () => {
		const { getByTestId } = render(
			<AuthProvider>
				<SelectList value="NETWORK" data={networksList} placeholder="Network Name" />
			</AuthProvider>
		);

		expect(getByTestId('select-list')).toMatchSnapshot();
	});
});
