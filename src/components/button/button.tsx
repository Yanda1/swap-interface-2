import type { Colors } from "../../styles"
import styled, {css} from "styled-components";
import type {ReactNode} from "react";
import {
    breakpoint, mediaQuery,
    pxToRem,
} from "../../styles";

type ColorType = 'default' | 'error' | 'warning' | 'icon' | 'transparent';

interface PrimaryButtonProps {
    variant: 'primary';
    color?:  ColorType;
    disabled?: boolean;
    children?: ReactNode;
    theme: Colors;
}
interface SecondaryButtonProps {
    variant: 'secondary';
    color?:  ColorType;
    icon?: string;
    disabled?: boolean;
    children?: ReactNode;
    theme: Colors;
}
interface PureButtonProps {
    variant: 'pure';
    color?:  ColorType;
    disabled?: boolean;
    children?: ReactNode;
    theme: Colors;
}
type Props = PrimaryButtonProps | SecondaryButtonProps | PureButtonProps;
const Button = styled.button(({theme, variant = 'primary', color = 'default', disabled = false}: Props) => css`
          max-width: ${variant === 'primary' ? pxToRem(426) : pxToRem(148)};
          height: ${variant === 'primary' ? pxToRem(57) : pxToRem(35)};
          padding: ${variant === 'secondary' ? '7px 23px 9px 26px' : variant === 'primary' ? '17px 152px 18px' : null};
          margin: 10px 10px;
          border: ${'1px solid'};
          color: ${variant === "secondary" && color === 'default' ? theme.notification.default : 'white'};
          background-color:  ${disabled ? 'grey' : theme.notification[color]};
          border-color: ${variant === 'secondary' && color !== 'default' ? "white" : variant === 'pure' ? 'transparent' : disabled ? 'grey' : theme.notification.default};
          border-radius: 5px; 
          &:hover {
            opacity: 0.8;
          }
  
          ${mediaQuery(breakpoint.xxs)} {
            width: ${variant !== 'secondary' ? pxToRem(335) : null};
            padding: ${variant === 'primary' ? '18px 110px 17px 103px' : null};
          }`
);
export default Button;