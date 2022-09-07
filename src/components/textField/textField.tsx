import { useState } from 'react';
import styled, { css } from 'styled-components';
import type { Theme } from '../../styles';
import { fontSize, pxToRem, spacing } from '../../styles';
import { useStore } from '../../helpers';

const StyledTextField = styled.input(({ align }: { align: AlignProps }) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		background: none;
		text-align: ${align};
		font-size: ${fontSize[16]};
		line-height: ${fontSize[20]};
		padding: ${spacing[18]} ${spacing[12]};
		color: ${theme.font.pure};
		border: 1px solid ${theme.default};
		border-radius: ${pxToRem(6)};
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		width: calc(100% - ${pxToRem(26)});

		&:hover,
		&:active {
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

		&[type='number'] {
			-moz-appearance: textfield;
		}
	`;
});

const Message = styled.div`
	display: flex;
	justify-content: space-between;
`;

const Description = styled.div`
	margin: ${spacing[4]} 0;
`;

type StyledProps = {
	theme: Theme;
};

const Error = styled.div`
	margin: ${spacing[4]} 0;
	color: ${(props: StyledProps) => props.theme.button.error};
`;

type AlignProps = 'left' | 'right' | 'center';

type Props = {
	placeholder?: string;
	disabled?: boolean;
	type?: 'number' | 'text';
	value: string;
	description?: string;
	error?: boolean;
	onChange?: (e?: any) => void;
	align?: AlignProps;
};

export const TextField = ({
	placeholder,
	disabled = false,
	type = 'text',
	value,
	onChange,
	description,
	error,
	align = 'center'
}: Props) => {
	const {
		state: { theme }
	} = useStore();
	const [isActive, setIsActive] = useState(false);

	return (
		<>
			<StyledTextField
				placeholder={placeholder}
				disabled={disabled}
				onChange={onChange}
				align={align}
				value={value}
				type={type}
				lang="en"
				min="18" // TODO: replace with amount from destinationsNetwork
				onBlur={() => setIsActive(true)}
				onFocus={() => setIsActive(false)}
			/>
			<Message>
				{description && <Description>{description}</Description>}
				{error && isActive && <Error theme={theme}>Invalid input</Error>}
			</Message>
		</>
	);
};
