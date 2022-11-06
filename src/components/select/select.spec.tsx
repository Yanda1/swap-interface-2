import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import type { SelectProps } from '../../helpers';
import { Select } from '../../components';

describe('Select', () => {
	it('should match snapshot', () => {
		const data: SelectProps[] = [
			{ name: 'Sort by', value: undefined, checked: true },
			{ name: 'Symbol', value: 'symbol', checked: false },
			{ name: 'Date', value: 'timestamp', checked: false },
			{ name: 'Base Asset', value: 'scoin', checked: false },
			{ name: 'Quote Asset', value: 'fcoin', checked: false }
		];

		const { getByTestId } = render(
			<AuthProvider>
				<Select data={data} checkedValue={'BASE'} />
			</AuthProvider>
		);
		expect(getByTestId('select')).toMatchSnapshot();
	});
});
