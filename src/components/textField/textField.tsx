import styled, { css } from 'styled-components';
import { fontSize, pxToRem, spacing } from '../../styles';
import { useStore } from '../../helpers';

const StyledTextField = styled.input(() => {
	const { state: { theme } } = useStore();

	return css`
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
		flex: 1;
		width: 100%;

		&:hover, &:active {
			border-color: ${theme.color.pure};
			outline: none;
		}

		&:focus, &:focus-visible {
			outline-offset: 2px;
			outline: 1px solid ${theme.default};
		}

		&-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}

		&[type=number] {
			-moz-appearance: textfield;
		}
	`;
});

const Description = styled.div`
	margin: ${spacing[4]} 0;
`;

type Props = {
	placeholder?: string;
	disabled?: boolean;
	type?: 'number' | 'text';
	value: string;
	description?: string;
	onChange?: (e?: any) => void;
};

export const TextField = ({
	placeholder,
	disabled = false,
	type = 'text',
	value,
	onChange,
	description
}: Props) => {
	return (
		<>
			<StyledTextField
				placeholder={placeholder}
				disabled={disabled}
				type={type}
				value={value}
				onChange={onChange}
				lang="en"
			/>
			{description && <Description>{description}</Description>}
		</>
	);
};
