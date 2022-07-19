import React from 'react';
import styled, { css } from 'styled-components';
import type { ReactNode } from 'react';
import { breakpoint, mediaQuery, pxToRem } from '../../styles';
type VariantType = 'primary' | 'secondary' | 'pure';
type ColorType = 'default' | 'info' | 'error' | 'warning' | 'main' | 'logo';

type Props = {
  color: ColorType;
  variant: any;
  children?: ReactNode;
};

const Button = styled.button(
  ({ theme, variant = 'primary', color = 'default' }: any) => css`
    color: ${variant === 'pure'
      ? theme.notification[color]
      : theme.notification.default};
    background-color: ${variant === 'primary'
      ? theme.notification[color]
      : 'transparent'};
    border: 1px solid;
    border-color: ${color === 'main'
      ? theme.notification[color]
      : color === 'error'
      ? theme.notification.default
      : color === 'warning'
      ? theme.notification.default
      : color === 'logo'
      ? theme.notification.default
      : 'transparent'};
    width: 100%;
    margin-bottom: 10px;
    border-radius: ${variant === 'primary' ? '5px' : '5px'};
    max-width: ${pxToRem(426)};
    display: block;
    padding: ${pxToRem(16)} 0;
    ${mediaQuery(breakpoint.xxs)} {
      max-width: ${pxToRem(335)};
    }
  `
);
export default Button;
