import 'jest-styled-components';
import { render } from '@testing-library/react';
import { IconButton } from './iconButton';
import { AuthProvider } from '../../helpers';
import { darkTheme, pxToRem, spacing } from '../../styles';
import userEvent from '@testing-library/user-event';

describe('IconButton', () => {
	it('should render a disabled IconButton with img and Text', () => {
		const { getByRole } = render(
			<AuthProvider>
				<IconButton disabled icon="GLMR" onClick={() => console.log('Start token')}></IconButton>
			</AuthProvider>
		);
		const btn = getByRole('button');
		const img = getByRole('img');

		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('alt', 'GLMR');
		expect(img).toHaveStyle(`width: ${pxToRem(42)}; height: ${pxToRem(42)}; cursor: pointer; margin-right: ${pxToRem(0)};`);

		expect(btn).toMatchSnapshot();
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveStyle(
			`
			background: ${darkTheme.icon.default};
			padding: ${spacing[8]};
			border: 1px solid ${darkTheme.default};
			border-radius: ${pxToRem(6)};
			`);

		expect(btn).toContainElement(img);
		expect(btn).toHaveAttribute('disabled');


		void userEvent.hover(btn);
		expect(btn).toHaveStyleRule('opacity', '0.8', {
			modifier: ':hover'
		});
		expect(btn).toHaveStyleRule('outline', 'none', {
			modifier: ':active'
		});
		expect(btn).toHaveStyleRule('outline', `1px solid ${darkTheme.default}`, {
			modifier: ':focus-visible'
		});
	});

	it('should render a IconButton with icon only', () => {
		const { getByRole } = render(
			<AuthProvider>
				<IconButton iconOnly icon="GLMR"></IconButton>
			</AuthProvider>
		);
		const img = getByRole('img');
		expect(img).toMatchSnapshot();

		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('alt', 'GLMR');
		expect(img).toHaveStyle(`width: ${pxToRem(25)}; height: ${pxToRem(25)}; cursor: pointer; margin-right: ${pxToRem(10)}`);
	});
});
