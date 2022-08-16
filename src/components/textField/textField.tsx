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
		color: ${theme.font.pure};
		border: 1px solid ${theme.default};
		border-radius: ${pxToRem(6)};
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		width: 100%;

		&:hover, &:active {
			border-color: ${theme.font.pure};
			outline: none;
		}

		&:focus-visible {
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
	readOnly?: boolean;
	type?: 'number' | 'text';
	value: string;
	description?: string;
	onChange?: (e?: any) => void;
};

export const TextField = ({
	placeholder,
	readOnly = false,
	type = 'text',
	value,
	onChange,
	description
}: Props) => {
	return (
		<>
			<StyledTextField
				placeholder={placeholder}
				readOnly={readOnly}
				type={type}
				value={value}
				onChange={onChange}
				lang="en"
				min="18"
			/>
			{description && <Description>{description}</Description>}
		</>
	);
};
