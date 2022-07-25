import { fontFamily } from '../../styles';
import styled, { css } from 'styled-components';
import type { ReactNode } from 'react';
import { pxToRem } from '../../styles';
import moonbeam from '../../assets/moonbeam.svg';
import metamask from '../../assets/metamask.svg';
import { useAuth } from '../../helpers';

type Icon = 'moonbeam' | 'metamask';

const icons: { [key: string]: string } = {
  moonbeam,
  metamask,
};

type ColorType = 'default' | 'error' | 'warning' | 'icon';

type CommonProps = {
  disabled?: boolean;
  children?: ReactNode;
  onClick: () => void;
};

type PrimaryPureProps = {
  variant?: 'primary' | 'pure';
  color?: never;
  icon?: never;
};

type IconOnlyProps = {
  icon: Icon;
  color?: never;
};

type ColorOnlyProps = {
  color?: ColorType;
  icon?: never;
};

type ColorIconProps = IconOnlyProps | ColorOnlyProps;

type SecondaryProps = {
  variant?: 'secondary';
} & ColorIconProps;

type IndividualProps = PrimaryPureProps | SecondaryProps;
type Props = IndividualProps & CommonProps;

const StyledButton = styled.button(
  ({ variant, color, disabled, icon }: Props) => {
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';
    const setColor = icon ? 'icon' : color;
    const isColorDefault = setColor === 'default';
    const isSecondaryDefault = isSecondary && setColor === 'default';
    const { state } = useAuth();
    const { theme } = state;

    return css`
      display: ${icon ? 'inline-flex' : 'inline-block'};
      align-items: center;
      justify-content: space-between;
      max-width: ${isPrimary ? pxToRem(428) : pxToRem(160)};
      width: 100%;
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      font-family: ${fontFamily}; // somehow this is not applied from GLOBAL_STYLES
      font-size: ${isPrimary
        ? pxToRem(16)
        : pxToRem(14)}; // same here for font-size = 14
      min-height: ${isPrimary ? pxToRem(57) : pxToRem(35)};
      padding: ${pxToRem(4)} ${pxToRem(12)};
      color: ${variant === 'pure'
        ? theme.pure
        : isSecondaryDefault
        ? theme.button.default
        : '#FFF'};
      background-color: ${disabled
        ? theme.button.disabled
        : isPrimary
        ? theme.button.default
        : !isColorDefault
        ? theme.button?.[setColor as ColorType]
        : 'transparent'};
      border: 1px solid
        ${!isSecondary
          ? 'transparent'
          : isColorDefault
          ? theme.button.default
          : '#FFF'};
      border-radius: ${pxToRem(6)};
      transition: all 0.2s ease-in-out;
      margin: ${isSecondaryDefault && '1px'};
      &:hover {
        opacity: ${!isSecondaryDefault && '0.8'};
        box-shadow: ${isSecondaryDefault &&
        `0 0 0 1px ${theme.button.default}`};
      }
    `;
  }
);

export const Button = ({
  variant = 'primary',
  disabled = false,
  icon,
  color = 'default',
  onClick,
  children,
}: Props) => (
  // @ts-ignore
  <StyledButton
    variant={variant}
    disabled={disabled}
    icon={icon}
    color={color}
    onClick={onClick}
  >
    {icon && <img src={icons?.[icon]} alt={icon} />}
    {children}
  </StyledButton>
);
