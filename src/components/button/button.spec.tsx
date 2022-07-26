import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
	it('should render a button', () => {
		render(<Button onClick={() => console.log('test')}>First Button</Button>);
		expect(screen.getByText(/First Button/)).toBeInTheDocument();
	});
});
