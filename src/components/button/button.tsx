import React from 'react';
import styled from 'styled-components';

interface Props {
  color: string;
  border: string;
  width: string;
  height: string;
  backgroundColor: any;
  // add props that come into the component
}

const StyledButton = styled.button``;

const Button = (props: Props) => {
  return <StyledButton {...props} />;
};

export default Button;
