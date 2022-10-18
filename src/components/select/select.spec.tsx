import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Select } from '../../components';

describe('Select', () => {
	it('should match snapshot', () => {
		const data = [
			{ name: 'Sort by', checked: true },
			{ name: 'ETHGLMR', checked: false },
			{ name: 'BTCETH', checked: false },
			{ name: 'ETHKDJKF', checked: false }
		];
		const { getByTestId } = render(
			<AuthProvider>
				<Select data={data} />
			</AuthProvider>
		);
		expect(getByTestId('select')).toMatchSnapshot();
	});
});
