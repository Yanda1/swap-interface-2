import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Button } from './button';

describe('Button', () => {
	it('should render a default button', () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')}>Primary default Button</Button>
			</AuthProvider>
		);

		expect(getByText(/Primary default Button/)).toMatchSnapshot();
	});

	it('should render a secondary default button', async () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant={'secondary'}>
					Secondary default Button
				</Button>
			</AuthProvider>
		);

		expect(getByText(/Secondary default Button/)).toMatchSnapshot();
	});

	it('should render a secondary icon button', async () => {
		const { getByText, getByRole } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant="secondary" icon="moonbeam">
					Secondary icon Button
				</Button>
			</AuthProvider>
		);
		expect(getByRole('img')).toBeInTheDocument();
		expect(getByText(/Secondary icon Button/)).toMatchSnapshot();
	});

	it('should render a secondary warning button', async () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant={'secondary'} color={'warning'}>
					Secondary warning Button
				</Button>
			</AuthProvider>
		);

		expect(getByText(/Secondary warning Button/)).toMatchSnapshot();
	});

	it('should render a secondary error button', async () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant={'secondary'} color={'error'}>
					Secondary error Button
				</Button>
			</AuthProvider>
		);

		expect(getByText(/Secondary error Button/)).toMatchSnapshot();
	});

	it('should render a primary disabled button', () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant="primary" color="default" disabled>
					Primary disabled Button
				</Button>
			</AuthProvider>
		);

		expect(getByText(/Primary disabled Button/)).toMatchSnapshot();
	});

	it('should render a pure button', async () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant={'pure'}>
					Secondary pure Button
				</Button>
			</AuthProvider>
		);

		expect(getByText(/Secondary pure Button/)).toMatchSnapshot();
	});
});
