import 'jest-styled-components';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { SelectList } from './selectList';
import { darkTheme, fontSize, pxToRem, spacing } from '../../styles';

describe('SelectList', () => {
	const networksList = ['ETH', 'BTC', 'USDT'];
	it('should render a select list with 3 items', () => {
		const { getByRole, getByText, getAllByRole, getByTestId } = render(
			<AuthProvider>
				<SelectList value="NETWORK" data={networksList} placeholder="Network Name" />
			</AuthProvider>
		);

		const element = getByTestId('custom');
		const title = getByText('SELECT NETWORK');
		const input = getByRole('textbox');
		const list = getByRole('list');
		const listItem = getByText('ETH');
		const icon = getByRole('img', { name: 'ETH' });

		expect(element).toMatchSnapshot();
		expect(element).toHaveStyle(`
			display: flex;
			flex-direction: column;
			flex: 0 1 ${pxToRem(178)};
			border: 1px solid ${darkTheme.default};
			height: ${pxToRem(478)};
			padding: 0 ${spacing[10]};
			background: ${darkTheme.background.default};
			border-radius: ${pxToRem(6)};
		`);

		expect(title).toHaveTextContent('SELECT NETWORK');
		expect(title).toHaveStyle(
			`
			font-size: ${fontSize[16]};
			line-height: ${fontSize[22]};
			color: ${darkTheme.font.pure};
			margin: ${spacing[20]} ${spacing[12]} ${spacing[12]};
			`
		);

		expect(input).toHaveStyle(
			`
			background: none;
			text-align: left;
			font-size: ${fontSize[16]};
			line-height: ${fontSize[20]};
			padding: ${spacing[18]} ${spacing[12]};
			color: ${darkTheme.font.pure};
			border: 1px solid ${darkTheme.default};
			border-radius: ${pxToRem(6)};
			cursor: pointer;
			transition: all 0.2s ease-in-out;
			width: calc(100% - ${pxToRem(26)});
			`
		);

		void userEvent.hover(input);
		expect(input).toHaveStyleRule('border-color', `${darkTheme.font.pure}`, {
			modifier: ':hover'
		});
		expect(input).toHaveStyleRule('outline', 'none', {
			modifier: ':hover'
		});
		expect(input).toHaveStyleRule('border-color', `${darkTheme.font.pure}`, {
			modifier: ':active'
		});
		expect(input).toHaveStyleRule('outline', 'none', {
			modifier: ':active'
		});

		expect(list).toHaveStyle(
			`
			overflow-y: auto;
			padding: 0;
			`
		);

		expect(getAllByRole('listitem').length).toBe(networksList.length);
		expect(listItem).toHaveAttribute('value', 'NETWORK');
		expect(listItem).toHaveStyle(
			`
			display: flex;
			align-items: center;
			cursor: pointer;
			font-size: ${fontSize[16]};
			color: ${darkTheme.font.pure};
			line-height: ${fontSize[22]};
			margin: ${spacing[10]} 0;
			border-radius: ${pxToRem(6)};
			padding: ${spacing[12]} ${spacing[10]};
			border: 1px solid transparent;`
		);

		expect(icon).toHaveStyle(
			`
			cursor: pointer;
			margin-right: ${spacing[10]};
			width: ${pxToRem(25)};
			height: ${pxToRem(25)};`
		);

		expect(icon).toHaveAttribute('src', 'ETH.png');
	});

	it('should render an empty select list', () => {
		const networksList: any = [];
		const { getByTestId } = render(
			<AuthProvider>
				<SelectList value="NETWORK" data={networksList} placeholder="Network Name" />
			</AuthProvider>
		);

		const element = getByTestId('custom');
		expect(element).toMatchSnapshot();

		const warningContainer = screen.getByText('Please choose network.');
		expect(warningContainer).toBeInTheDocument();

		expect(warningContainer).toHaveStyle(`
		font-size: ${fontSize[16]};
		line-height: ${fontSize[22]};
		color: ${darkTheme.font.pure};
		margin: ${spacing[20]} ${spacing[12]} ${spacing[12]};
		`);
	});
});
