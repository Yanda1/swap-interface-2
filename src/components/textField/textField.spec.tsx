import { TextField } from './textField';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';

describe('TextField', () => {
	it.each<[boolean, string, string, boolean]>([
		[false, 'text', 'small', false],
		[true, 'number', 'regular', true],
		[true, 'search', 'small', false]
	])(
		'should match snapshot for value disabled %s, %s, type %s and size %s',
		(disabled, type, size, error) => {
			const { getByPlaceholderText } = render(
				<AuthProvider>
					<TextField
						disabled={disabled}
						value="Test value"
						placeholder="placeholder"
						// @ts-ignore
						type={type}
						// @ts-ignore
						size={size}
						error={error}
						description={'Text Field Component'}
					/>
				</AuthProvider>
			);

			expect(getByPlaceholderText(/placeholder/i)).toMatchSnapshot();
		}
	);
});
