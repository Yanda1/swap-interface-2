import 'jest-styled-components';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../helpers';
import { darkTheme, lightTheme, MAIN_MAX_WIDTH, pxToRem } from '../../styles';
import { Button } from './button';

describe('Button', () => {
	it('should render a default button', async () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')}>Primary default Button</Button>
			</AuthProvider>
		);
		expect(screen.getByText(/Primary default Button/)).toHaveStyle(
			`background-color: ${lightTheme.button.default}; color: #FFF; border: 1px solid transparent; max-width: ${MAIN_MAX_WIDTH}; cursor: pointer;`
		);
		expect(getByText(/Primary default Button/)).toMatchSnapshot();

		const btn = getByText(/Primary default Button/);
		await userEvent.hover(btn);
		expect(btn).toHaveStyleRule('opacity', '0.8', {
			modifier: ':hover'
		});
	});

	it('should render a secondary default button', async () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant={'secondary'}>
					Secondary default Button
				</Button>
			</AuthProvider>
		);
		expect(screen.getByText(/Secondary default Button/)).toHaveStyle(
			`background-color: transparent; color: ${lightTheme.button.default}; border: 1px solid ${
				lightTheme.button.default
			}; max-width: ${pxToRem(160)}`
		);
		expect(getByText(/Secondary default Button/)).toMatchSnapshot();

		const btn = getByText(/Secondary default Button/);
		await userEvent.hover(btn);
		expect(btn).toHaveStyleRule('box-shadow', `0 0 0 1px ${lightTheme.button.default}`, {
			modifier: ':hover'
		});
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

		const btn = getByText(/Secondary icon Button/);
		await userEvent.hover(btn);

		expect(btn).toHaveStyleRule('opacity', '0.8', {
			modifier: ':hover'
		});
	});

	it('should render a secondary warning button', async () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant={'secondary'} color={'warning'}>
					Secondary warning Button
				</Button>
			</AuthProvider>
		);
		expect(screen.getByText(/Secondary warning Button/)).toHaveStyle(
			`background-color: ${
				lightTheme.button.warning
			}; color: #FFF; border: 1px solid #FFF; max-width: ${pxToRem(160)}`
		);
		expect(getByText(/Secondary warning Button/)).toMatchSnapshot();

		const btn = getByText(/Secondary warning Button/);
		await userEvent.hover(btn);

		expect(btn).toHaveStyleRule('opacity', '0.8', {
			modifier: ':hover'
		});
	});

	it('should render a secondary error button', async () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant={'secondary'} color={'error'}>
					Secondary error Button
				</Button>
			</AuthProvider>
		);
		expect(screen.getByText(/Secondary error Button/)).toHaveStyle(
			`background-color: ${
				lightTheme.button.error
			}; color: #FFF; border: 1px solid #FFF; max-width: ${pxToRem(160)}`
		);

		expect(getByText(/Secondary error Button/)).toMatchSnapshot();

		const btn = getByText(/Secondary error Button/);
		await userEvent.hover(btn);

		expect(btn).toHaveStyleRule('opacity', '0.8', {
			modifier: ':hover'
		});
	});

	it('should render a primary disabled button', async () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant="primary" color="default" disabled>
					Primary disabled Button
				</Button>
			</AuthProvider>
		);
		expect(screen.getByText(/Primary disabled Button/)).toHaveStyle(
			`background-color: ${lightTheme.button.disabled}; color: ${darkTheme.font.default}; border: 1px solid transparent; max-width: ${MAIN_MAX_WIDTH}`
		);

		expect(getByText(/Primary disabled Button/)).toMatchSnapshot();

		const btn = getByText(/Primary disabled Button/);
		await userEvent.hover(btn);
		expect(btn).toMatchSnapshot();
		expect(btn).toHaveStyleRule('opacity', '0.8', {
			modifier: ':hover'
		});
	});

	it('should render a pure button', async () => {
		const { getByText } = render(
			<AuthProvider>
				<Button onClick={() => console.log('test')} variant={'pure'}>
					Secondary pure Button
				</Button>
			</AuthProvider>
		);
		expect(screen.getByText(/Secondary pure Button/)).toHaveStyle(
			`background-color: transparent; color: #FFF; border: 1px solid transparent; max-width: ${pxToRem(
				160
			)}`
		);

		expect(getByText(/Secondary pure Button/)).toMatchSnapshot();

		const btn = getByText(/Secondary pure Button/);
		await userEvent.hover(btn);

		expect(btn).toHaveStyleRule('opacity', '0.8', {
			modifier: ':hover'
		});
	});
});
