import { TextField } from './textField';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';

describe('TextField', () => {
	it('should render without errors', () => {
		const { getByPlaceholderText } = render(
			<AuthProvider>
				<TextField
					value="Test value"
					placeholder="placeholder"
					onChange={() => console.log('value changed')}
				/>
			</AuthProvider>
		);

		expect(getByPlaceholderText(/placeholder/i)).toBeTruthy();
	});

	it.each<[boolean, string, string, boolean]>([
		[false, 'text', 'small', false],
		[true, 'number', 'regular', true],
		[true, 'search', 'small', false]
	])(
		'should match snapshot for value disabled: %s, type: %s, size: %s and error: %s',
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
						onChange={() => console.log('value changed')}
					/>
				</AuthProvider>
			);

			expect(getByPlaceholderText(/placeholder/i)).toMatchSnapshot();
		}
	);
});
