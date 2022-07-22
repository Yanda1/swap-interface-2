import type { Colors } from '../../styles';
import styled, { css } from 'styled-components';
import type { ReactNode } from 'react';
import { pxToRem } from '../../styles';

type ColorType = 'default' | 'error' | 'warning' | 'icon';
interface CommonProps {
  disabled?: boolean;
  children?: ReactNode;
  theme: Colors;
}
interface PrimaryPureProps {
  variant: 'primary' | 'pure';
  color?: never;
}
interface SecondaryProps {
  variant: 'secondary';
  color?: ColorType;
  icon?: string;
}

type IndividualProps = PrimaryPureProps | SecondaryProps;
type Props = IndividualProps & CommonProps;

const Button = styled.button(
  ({
    theme,
    variant = 'primary',
    color = 'default',
    disabled = false,
  }: Props) => {
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';
    const isColorDefault = color === 'default';
    const isSecondaryDefault = isSecondary && color === 'default';

    return css`
      max-width: ${isPrimary ? pxToRem(426) : pxToRem(148)};
      width: 100%;
      font-size: ${isPrimary && pxToRem(16)};
      min-height: ${isPrimary ? pxToRem(57) : pxToRem(35)};
      padding: ${pxToRem(8)} ${pxToRem(24)};
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
        ? theme.button?.[color]
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

export default Button;
