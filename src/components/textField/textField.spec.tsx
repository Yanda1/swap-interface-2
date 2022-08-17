import { TextField } from './textField';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';

describe('TextField', () => {
	it('should match snapshot', () => {
		const { getByPlaceholderText } = render(
			<AuthProvider>
				<TextField
					disabled
					value="Test Value"
					placeholder="placeholder"
					type="number"
					description={'Text Field Component'} />
			</AuthProvider>
		);
		const textField = getByPlaceholderText(/placeholder/i);
		expect(textField).toMatchSnapshot();
	});

	it('should match style', () => {
		const { getByPlaceholderText } = render(
			<AuthProvider>
				<TextField
					disabled
					value="Test Value"
					placeholder="placeholder"
					type="number"
					description={'Text Field Component'} />
			</AuthProvider>
		);
		const textField = getByPlaceholderText(/placeholder/i);
		expect(textField).toHaveStyle('border-radius: 0.375rem; font-size: 1rem; line-height: 1.25rem; padding: 1.125rem 0;');
	});

	it('should set props correctly', () => {
		const { getByPlaceholderText } = render(
			<AuthProvider>
				<TextField
					disabled
					value="value"
					placeholder="placeholder"
					type="number"
				/>
			</AuthProvider>
		);
		const textField = getByPlaceholderText(/placeholder/i) as HTMLInputElement;
		expect(textField.placeholder).toBe('placeholder');
		expect(textField.readOnly).toBe(true);
		expect(textField.type).toBe('number');
		expect(textField.lang).toBe('en');
	});
});
