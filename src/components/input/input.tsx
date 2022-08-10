import styled from 'styled-components';
import { fontSize, pxToRem, spacing } from '../../styles';
import { useStore } from '../../helpers';

const StyledInput = styled.input(() => {
	const { state: { theme } } = useStore();

	return `
		background: none;
		text-align: center;
		font-size: ${fontSize[16]};
		line-height: ${fontSize[20]};
		padding: ${spacing[18]} 0;
		color: ${theme.color.pure};
		border: 1px solid ${theme.default};
		border-radius: ${pxToRem(6)};
		pointer: cursor;
		transition: all 0.2s ease-in-out;

		&:hover, &:focus, &:focus-visible, &:active {
			border-color: ${theme.color.pure};
			outline: none;
		}
`;
});

export const Input = () => {
	return <StyledInput placeholder="test" />;
};
