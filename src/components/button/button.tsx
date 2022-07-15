import React from "react";
import styled, {css} from "styled-components";
import {
    breakpoint, mediaQuery,
    pxToRem,
} from "../../styles";
type VariantType = "primary" | "secondary" | "pure";
type ColorType = "default" | "info" | "error" | "warning" | "main"| "logo";
type Props = {
    color: ColorType;
    variant: VariantType;
    children?: React.ReactNode;
};

const StyledButton = styled.button`
  color: ${(props: any) => props.variant === "primary" ? "white" : props.variant === "secondary" ? props.theme.notification[props.color] : 'white'};
  background-color: ${(props: any) => props.variant === "primary" ? props.theme.notification[props.color] : props.color === 'info' ? props.theme.notification[props.color] : props.color === "logo" ? "#172631;" : "transparent"};
  border: 1px solid;
  border-color: ${(props: any) => props.color === "main" ? props.theme.notification[props.color] : props.color === "error" ? "white" : props.color === "warning" ? "white " : props.color === "logo" ? "white" : "transparent" };
  width: 100%;
  border-radius: ${(props: any) => props.variant === "primary" ? "5px" : "5px"};
  max-width: ${pxToRem(426)};
  display: block;
  padding: ${pxToRem(16)} 0;
  ${(props: any) => props.color === "main" && props.variant === "primary" && css`
    &:hover {
      background-color: #37C8FF;
    }
  `}
  ${(props: any) => props.color === "error" && css`
    &:hover {
      background-color: #FF4040;
    }
  `}
  ${(props: any) => props.color === "warning" && css`
    &:hover {
      background-color: #FFA665;
    }
  `}
  ${(props: any) => props.variant === "secondary" && css`
    &:hover {
      border: 2px solid #00A8E8;
    }
  `}
  ${(props: any) => props.variant === "pure" && css`
    &:hover {
      color: #B4B4B4;
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