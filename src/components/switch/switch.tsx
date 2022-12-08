import styled, { css } from 'styled-components';
import { useStore } from '../../helpers';
import { pxToRem } from '../../styles';

const StyledSwitch = styled.input(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		width: ${pxToRem(50)};
		height: ${pxToRem(22)};
		display: inline-block;
		position: relative;
		border-radius: ${pxToRem(18)};
		overflow: hidden;
		outline: none;
		border: none;
		cursor: pointer;
		background-color: transparent;
		border: 1px solid ${theme.font.secondary};
		transition: background-color ease 0.3s;

		&:before {
			content: '';
			display: block;
			position: absolute;
			width: ${pxToRem(16)};
			height: ${pxToRem(16)};
			background: ${theme.font.default};
			left: 2px;
			top: 2px;
			border-radius: ${pxToRem(18)};
			transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
		}

		&:checked {
			background-color: ${theme.button.default};
			border-color: ${theme.button.default};

			&:before {
				background: ${theme.background.secondary};
			}
		}

		&:checked:before {
			left: ${pxToRem(31)};
		}
	`;
});

export const Switch = () => {
	return <StyledSwitch type="checkbox" data-testid="switch" />;
};
