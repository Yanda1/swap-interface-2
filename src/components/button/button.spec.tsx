import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { lightTheme } from '../../styles';
import { Button } from './button';

describe('Button Component', () => {
	it('should render a default button', () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')}>First Button</Button>
			</AuthProvider>
		);
		expect(getByText(/First Button/)).toHaveStyle(
			`background-color: ${lightTheme.button.default}; color: #FFF;}`
		);
	});
});
