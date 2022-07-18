import React from "react";
import styled, {css} from "styled-components";
import type {ReactNode} from "react";
import {
    breakpoint, mediaQuery,
    pxToRem,
} from "../../styles";
type VariantType = "primary" | "secondary" | "pure";
type ColorType = "default" | "info" | "error" | "warning" | "main"| "logo";

type Props = {
    color: ColorType;
    variant: VariantType;
    children?: ReactNode;
};

const StyledButton = styled.button`
  color: ${(props: any) => props.variant === "secondary" ? props.theme.notification[props.color] : props.theme.notification.default};
  background-color: ${(props: any) => props.variant === "primary" ? props.theme.notification[props.color] : props.color === 'info' ? props.theme.notification[props.color] : props.color === "logo" ?  props.theme.notification.logo : "transparent"};
  border: 1px solid;
  border-color: ${(props: any) => props.color === "main" ? props.theme.notification[props.color] : props.color === "error" ? props.theme.notification.default : props.color === "warning" ? props.theme.notification.default : props.color === "logo" ? props.theme.notification.default : "transparent" };
  width: 100%;
  margin-bottom: 10px;
  border-radius: ${(props: any) => props.variant === "primary" ? "5px" : "5px"};
  max-width: ${pxToRem(426)};
  display: block;
  padding: ${pxToRem(16)} 0;
  ${(props: any) => props.color === "main" && props.variant === "primary" && css`
    &:hover {
      background-color: ${props.theme.state.hover.main}
    }
  `}
  ${(props: any) => props.color === "error" && css`
    &:hover {
      background-color: ${props.theme.state.hover.error}
    }
  `}
  ${(props: any) => props.color === "warning" && css`
    &:hover {
      background-color: ${props.theme.state.hover.warning}
    }
  `}
  ${(props: any) => props.variant === "secondary" && css`
    &:hover {
      border: 2px solid ${props.theme.state.hover.secondary};
    }
  `}
  ${(props: any) => props.color === "logo" && css`
    &:hover {
      background-color: ${props.theme.state.hover.logo}
    }
  `}
  ${(props: any) => props.color === "info" && css`
    &:hover {
      background-color: ${props.theme.state.hover.info}
    }
  `}
  ${(props: any) => props.variant === "pure" && props.color === "default" && css`
    &:hover {
      color: ${props.theme.state.hover.pure};
    }
    ${mediaQuery(breakpoint.xxs)} {
      display: none;
    }
  `}
  ${mediaQuery(breakpoint.xxs)} {
    max-width: ${pxToRem(335)};
  }
`;
const Button = (props: Props) => {
    return <StyledButton {...props} />;
};

export default Button;