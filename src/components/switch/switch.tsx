import styled, { css } from 'styled-components';
import { useStore } from '../../helpers';

const StyledSwitch = styled.input(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		width: 50px;
		height: 22px;
		display: inline-block;
		position: relative;
		border-radius: 18px;
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
			width: 16px;
			height: 16px;
			background: ${theme.font.default};
			left: 2px;
			top: 2px;
			border-radius: 18px;
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
			left: 31px;
		}
	`;
});

export const Switch = () => {
	return <StyledSwitch type="checkbox" />;
};
