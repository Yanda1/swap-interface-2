import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Modal } from './modal';
import { darkTheme, pxToRem, spacing } from '../../styles';

describe('Modal', () => {
	it('should render a modal with background mobile and large size', () => {
		const { getByTestId, getByText } = render(
			<AuthProvider>
				<Modal showModal setShowModal={() => console.log()} background="mobile" width="large" />
			</AuthProvider>
		);

		const modal = getByTestId('modal-container');
		expect(modal).toMatchSnapshot();
		expect(modal).toBeInTheDocument();
		expect(modal).toHaveStyle(`
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			display: block;
			justify-content: center;
			align-items: center;
			z-index: 100;
			width: ${pxToRem(605)};
			max-width: calc(100% - ${spacing[64]});
			background-color: ${darkTheme.background.mobile};
			border: 1px solid ${darkTheme.default};
			border-radius: ${pxToRem(6)};
			padding: ${spacing[12]};
			`);

		const mobileMedia = '(max-width:375px)';

		expect(modal).toHaveStyleRule('max-width', `${pxToRem(347)}`, {
			media: mobileMedia,
		});
		expect(modal).toHaveStyleRule('width', `calc(100% - ${pxToRem(10)})`, {
			media: mobileMedia,
		});
		expect(modal).toHaveStyleRule('border-radius', `${pxToRem(28)}`, {
			media: mobileMedia,
		});
		expect(modal).toHaveStyleRule('border', 'none', {
			media: mobileMedia,
		});
		expect(modal).toHaveStyleRule('margin', '0 auto', {
			media: mobileMedia,
		});
		expect(modal).toHaveStyleRule('margin-top', `${spacing[48]}`, {
			media: mobileMedia,
		});

		const closeIcon = getByText('✖');
		expect(closeIcon).toBeInTheDocument();
		expect(closeIcon).toHaveStyle(`
			cursor: pointer;
			position: fixed;
			top: ${pxToRem(10)};
			right: ${pxToRem(10)};
			font-size: ${pxToRem(16)};
			line-height: ${pxToRem(22)};
			color: ${darkTheme.font.pure};
			`);
	});

	it('should render modal with small size and default background', () => {
			const { getByTestId } = render(
				<AuthProvider>
					<Modal showModal setShowModal={() => console.log()} background="default" width="small" />
				</AuthProvider>
			);

			const modal = getByTestId('modal-container');
			expect(modal).toHaveStyle(`
			width: ${pxToRem(478)};
			background-color: ${darkTheme.background.default};
			`);
		}
	);
});
