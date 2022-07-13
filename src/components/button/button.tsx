import React from "react";
import styled from "styled-components";
import { fontStyle, fontWeight, spacing, fontFamily, fontSize } from "../../styles"

interface Props {
    color: string;
    border: string;
    width: string;
    height: string;
    backgroundColor: any;
    // add props that come into the component
}

const StyledButton = styled.button`
  color: ${(props: any) => props.color};
  border: ${(props: any) => props.border};
  width: ${(props: any) => props.width};
  height: ${(props: any) => props.height};
  background-color: ${(props: any) => props.backgroundColor};
  margin: ${(props: any) => props.margin};
`

const Button = (props: Props) => {
    return <StyledButton {...props} />
};

export default Button;