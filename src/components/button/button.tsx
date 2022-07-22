import { Colors, fontFamily } from '../../styles';
import styled, { css } from 'styled-components';
import type { ReactNode } from 'react';
import { pxToRem } from '../../styles';
import moonbeam from '../../assets/moonbeam.svg';
import metamask from '../../assets/metamask.svg';

const icons = {
  moonbeam,
  metamask,
};

type ColorType = 'default' | 'error' | 'warning' | 'icon';

interface CommonProps {
  disabled?: boolean;
  children?: ReactNode;
  onClick: () => void;
  theme: Colors;
}
interface PrimaryPureProps {
  variant?: 'primary' | 'pure';
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

type IndividualProps = PrimaryPureProps | SecondaryProps;
type Props = IndividualProps & CommonProps;

const StyledButton = styled.button(
  ({
    theme,
    variant = 'primary',
    color = 'default',
    disabled = false,
    icon,
  }: Props) => {
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';
    const setColor = icon ? 'icon' : color;
    const isColorDefault = setColor === 'default';
    const isSecondaryDefault = isSecondary && setColor === 'default';

    return css`
      display: ${icon ? 'inline-flex' : 'inline-block'};
      align-items: center;
      justify-content: space-between;
      max-width: ${isPrimary ? pxToRem(426) : pxToRem(148)};
      width: 100%;
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      font-family: ${fontFamily}; // somehow this is not applied from GLOBAL_STYLES
      font-size: ${isPrimary
        ? pxToRem(16)
        : pxToRem(14)}; // same here for font-size = 14
      min-height: ${isPrimary ? pxToRem(57) : pxToRem(35)};
      padding: ${icon ? pxToRem(4) : pxToRem(8)} ${pxToRem(12)};
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
        ? theme.button?.[setColor]
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

const Button = ({
  theme,
  children,
  variant = 'primary',
  color = 'default',
  disabled = false,
  icon,
  onClick,
}: Props) => {
  return (
    // @ts-ignore
    <StyledButton
      theme={theme}
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
};

export default Button;
