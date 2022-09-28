import type { ReactNode } from 'react';
import { pxToRem } from '../../styles';
import styled, { css } from 'styled-components';
import moonbeam from '../../assets/moonbeam.svg';
import metamask from '../../assets/metamask.svg';
import { defaultBorderRadius, isLightTheme, useStore } from '../../helpers';

const icons = {
	moonbeam,
	metamask
};

export type ColorType = 'default' | 'error' | 'warning' | 'icon' | 'success';

interface CommonProps {
	disabled?: boolean;
	children?: ReactNode;
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
	({ variant = 'primary', color = 'default', disabled = false, icon }: Props) => {
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
			display: ${icon ? 'inline-flex' : 'inline-block'};
			align-items: center;
			justify-content: space-between;
			max-width: ${isPrimary ? pxToRem(428) : pxToRem(160)};
			width: 100%;
			cursor: ${disabled ? 'not-allowed' : 'pointer'};
			font-size: ${isPrimary ? pxToRem(16) : pxToRem(14)};
			min-height: ${isPrimary ? pxToRem(57) : pxToRem(35)};
			padding: ${pxToRem(4)} ${pxToRem(12)};
			color: ${isPure
				? theme.pure
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
			border-radius: ${defaultBorderRadius};
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
						? theme.pure
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
	onClick
}: Props) => {
	return (
		// @ts-ignore
		<StyledButton icon={icon} color={color} variant={variant} disabled={disabled} onClick={onClick}>
			{icon && <img src={icons?.[icon]} alt={icon} />}
			{children}
		</StyledButton>
	);
};
