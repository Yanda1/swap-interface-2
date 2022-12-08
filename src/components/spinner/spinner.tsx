import styled, { css } from 'styled-components';
import { useStore } from '../../helpers';
import { pxToRem } from '../../styles';
import type { ColorType } from '../../styles';

export type SpinnerSizeProps = 'small' | 'medium';

type Props = {
	size?: SpinnerSizeProps;
	color?: string;
};

export const Spinner = styled.div(({ size = 'small', color = 'default' }: Props) => {
	const {
		state: { theme }
	} = useStore();
	const borderColor = color === 'warning' ? '#FFF' : theme.button[color as ColorType];
	const borderTopColor =
		color === 'warning' ? theme.button[color as ColorType] : theme.background.default;

	return css`
		display: inline-block;
		width: ${pxToRem(size === 'small' ? 16 : 24)};
		height: ${pxToRem(size === 'small' ? 16 : 24)};
		border: 2px solid ${borderColor};
		border-radius: 50%;
		border-top-color: ${borderTopColor};
		animation: spin 1s ease-in-out infinite;
		-webkit-animation: spin 1s ease-in-out infinite;

		@keyframes spin {
			to {
				-webkit-transform: rotate(360deg);
			}
		}
	`;
});
