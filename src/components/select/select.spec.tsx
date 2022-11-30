import 'jest-styled-components';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import type { SelectProps } from '../../helpers';
import { Select } from '../../components';
import { pxToRem } from '../../styles';

describe('Select', () => {
	it('should render without errors', () => {
		const mockedOnChange = jest.fn();
		const { getByTestId } = render(
			<AuthProvider>
				<Select
					data={[{ name: 'Sort by', value: undefined, checked: true }]}
					checkedValue={'BASE'}
				/>
			</AuthProvider>
		);
		expect(getByTestId('select')).toBeTruthy();
	});

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

	it('should show options onClick', async () => {
		const mockedOnChange = jest.fn();
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

		const comp = getByTestId('select');
		expect(comp).toBeDefined();
		expect(comp).not.toBeNull();

		const button = comp.querySelector('button') as HTMLButtonElement;
		const list = comp.querySelector('ul') as HTMLUListElement;

		expect(list).toHaveStyle('max-height: 0');

		fireEvent.click(button);
		await waitFor(() => expect(list).toHaveStyle(`max-height: ${pxToRem(500)}`));
	});
});
