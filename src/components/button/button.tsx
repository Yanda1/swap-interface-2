import type { ReactNode } from 'react';
import type { ColorType } from '../../styles';
import styled, { css } from 'styled-components';
import moonbeam from '../../assets/moonbeam.svg';
import metamask from '../../assets/metamask.svg';
import { DEFAULT_BORDER_RADIUS, pxToRem, MAIN_MAX_WIDTH } from '../../styles';
import { isLightTheme, useStore } from '../../helpers';

type SpinnerProps = {
	size?: 'small' | 'medium';
	color?: string;
};

const Spinner = styled.div(({ size = 'small', color = 'default' }: SpinnerProps) => {
	const {
		state: { theme }
	} = useStore();
	const borderColor = color === 'warning' ? '#FFF' : theme.button[color as ColorType];
	const borderTopColor = color === 'warning' ? theme.button[color as ColorType] : theme.font.pure;

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
		@-webkit-keyframes spin {
			to {
				-webkit-transform: rotate(360deg);
			}
		}
	`;
});

const icons = {
	moonbeam,
	metamask
};

interface CommonProps {
	disabled?: boolean;
	children?: ReactNode;
	isLoading?: boolean;
	onClick: () => void;
}

interface PrimaryProps {
	variant?: 'primary';
	color: 'default' | 'transparent';
	icon?: never;
}

interface PureProps {
	variant?: 'pure';
	color?: never;
	icon?: never;
}

interface IconOnlyProps {
	icon?: 'moonbeam' | 'metamask';
	color?: never;
}

interface ColorOnlyProps {
	color?: ColorType;
	icon?: never;
}

type ColorIconProps = IconOnlyProps | ColorOnlyProps;

type SecondaryProps = {
	variant: 'secondary';
} & ColorIconProps;

type IndividualProps = PrimaryProps | SecondaryProps | PureProps;
type Props = IndividualProps & CommonProps;

const StyledButton = styled.button(
	({ variant = 'primary', color = 'default', disabled = false, icon, isLoading }: Props) => {
		const isPrimary = variant === 'primary';
		const isSecondary = variant === 'secondary';
		const isPure = variant === 'pure';
		const setColor = icon ? 'icon' : color;
		const isColorDefault = setColor === 'default';
		const isPrimaryTransparent = variant === 'primary' && color === 'transparent';
		const isPrimaryDisabled = variant === 'primary' && disabled;
		const isSecondaryDefault = isSecondary && setColor === 'default';
		const {
			state: { theme }
		} = useStore();

		return css`
			display: ${icon || isLoading ? 'inline-flex' : 'inline-block'};
			align-items: center;
			justify-content: ${isLoading ? 'center' : 'space-between'};
			max-width: ${isPrimary ? MAIN_MAX_WIDTH : pxToRem(160)};
			width: 100%;
			cursor: ${disabled ? 'not-allowed' : 'pointer'};
			font-size: ${isPrimary ? pxToRem(16) : pxToRem(14)};
			min-height: ${isPrimary ? pxToRem(57) : pxToRem(35)};
			padding: ${pxToRem(4)} ${pxToRem(12)};
			color: ${isPure || isPrimaryDisabled
				? theme.font.pure
				: isSecondaryDefault || isPrimaryTransparent
				? theme.button.default
				: '#FFF'};
			background-color: ${isPure || isSecondaryDefault || isPrimaryTransparent
				? theme.button.transparent
				: disabled
				? theme.button.disabled
				: theme.button[setColor]};
			border: 1px solid
				${isPrimaryDisabled
					? theme.button.disabled
					: isSecondaryDefault || isPrimaryTransparent
					? theme.button.default
					: isPure || isColorDefault
					? theme.button.transparent
					: '#FFF'};
			border-radius: ${DEFAULT_BORDER_RADIUS};
			transition: all 0.2s ease-in-out;
			margin: ${isSecondaryDefault && '1px'};
			cursor: ${disabled && 'not-allowed'};

			&:hover {
				opacity: ${!isSecondaryDefault && '0.8'};
				box-shadow: ${isSecondaryDefault && `0 0 0 1px ${theme.button.default}`};
			}

			&:focus-visible {
				outline-offset: 2px;
				outline: 1px solid
					${isPrimary
						? theme.button.default
						: isPure
						? theme.font.pure
						: isLightTheme(theme)
						? theme.button[setColor]
						: '#FFF'};
			}

			&:active {
				outline: none;
			}
		`;
	}
);

export const Button = ({
	children,
	variant = 'primary',
	color = 'default',
	disabled = false,
	icon,
	isLoading,
	onClick
}: Props) => {
	return (
		// @ts-ignore
		<StyledButton
			icon={icon}
			color={color}
			variant={variant}
			disabled={disabled}
			onClick={onClick}
			isLoading={isLoading}>
			{icon && <img src={icons?.[icon]} alt={icon} />}
			{isLoading ? <Spinner color={color} /> : children}
		</StyledButton>
	);
};
