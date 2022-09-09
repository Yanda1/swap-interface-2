import { useState } from 'react';
import styled, { css } from 'styled-components';
import type { Theme } from '../../styles';
import { fontSize, pxToRem, spacing } from '../../styles';
import { defaultBorderRadius, horizontalPadding, useStore } from '../../helpers';

type AlignProps = 'left' | 'right' | 'center';
type TypeProps = 'text' | 'number';

type StyledProps = {
	align: AlignProps;
	error: boolean;
	type: TypeProps;
};

const StyledTextField = styled.input(({ align, error, type }: StyledProps) => {
	const {
		state: { theme }
	} = useStore();

	const isTypeNumber = type === 'number';

	return css`
		background: none;
		text-align: ${align};
		font-size: ${fontSize[16]};
		line-height: ${fontSize[20]};
		padding: ${spacing[18]} ${spacing[horizontalPadding]};
		color: ${theme.font.pure};
		border: 1px solid ${error && isTypeNumber ? theme.button.error : theme.default};
		border-radius: ${defaultBorderRadius};
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		width: calc(100% - ${pxToRem(horizontalPadding * 2 + 2)});

		&:hover,
		&:active {
			border-color: ${error && isTypeNumber ? theme.button.error : theme.font.pure};
			outline: none;
		}

		&:focus-visible {
			outline-offset: 2px;
			outline: 1px solid ${error && isTypeNumber ? theme.button.error : theme.default};
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

export type ThemeProps = {
	theme: Theme;
};

const Error = styled.div`
	margin: ${spacing[4]} 0;
	color: ${(props: ThemeProps) => props.theme.button.error};
`;

type Props = {
	placeholder?: string;
	disabled?: boolean;
	type?: TypeProps;
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
				// @ts-ignore
				error={error}
				onBlur={() => setIsActive(true)}
				onFocus={() => setIsActive(false)}
			/>
			{(error || description) && type === 'text' && (
				<Message>
					{description && <Description>{description}</Description>}
					{error && isActive && <Error theme={theme}>Invalid input</Error>}
				</Message>
			)}
		</>
	);
};
