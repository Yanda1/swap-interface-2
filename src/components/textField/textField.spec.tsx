import { AlignProps, SizeProps, TextField, TypeProps } from './textField';
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

	it.each<[boolean, TypeProps, SizeProps, AlignProps, boolean, string]>([
		[false, 'text', 'small', 'left', false, 'description'],
		[true, 'number', 'regular', 'right', true, 'description'],
		[true, 'search', 'small', 'center', false, ''],
		[false, 'number', 'small', 'left', true, 'description']
	])(
		'should match snapshot for value disabled: %s, type: %s, size: %s, align: %s, error: %s and description: %s',
		(disabled, type, size, align, error, description) => {
			const { getByPlaceholderText } = render(
				<AuthProvider>
					<TextField
						disabled={disabled}
						value="Test value"
						placeholder="placeholder"
						align={align}
						description={description}
						type={type}
						size={size}
						error={error}
						onChange={() => console.log('value changed')}
					/>
				</AuthProvider>
			);

			expect(getByPlaceholderText(/placeholder/i)).toMatchSnapshot();
		}
	);
});
