import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Button } from './button';
import type { ColorType } from '../../styles';

describe('Button', () => {
	it.each<[boolean, boolean, string, ColorType]>([
		[true, false, 'secondary', 'warning'],
		[false, false, 'secondary', 'success'],
		[false, false, 'secondary', 'warning'],
		[true, false, 'pure', 'default'],
		[true, false, 'primary', 'transparent'],
		[true, false, 'primary', 'default']
	])(
		'should match snapshot for values disabled: %s, isLoading: %s, variant: %s and color: %s',
		(disabled, isLoading, variant, color) => {
			const { getByText } = render(
				<AuthProvider>
					<Button
						// @ts-ignore
						variant={variant}
						disabled={disabled}
						color={color}
						isLoading={isLoading}
						onClick={() => console.log('test')}>
						Test Button
					</Button>
				</AuthProvider>
			);

			expect(getByText(/Test Button/)).toMatchSnapshot();
		}
	);
});
