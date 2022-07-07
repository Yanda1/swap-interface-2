import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createGlobalStyle } from "styled-components";
import {
  FontStyles,
  fontStyle,
  fontWeight,
  spacing,
  fontFamily,
  fontSize,
} from "./styles";

const GlobalStyles = createGlobalStyle`
  body {
    font-family: ${fontFamily};
    font-style: ${fontStyle.normal};
    font-weight: ${fontWeight.regular};
    margin: ${spacing[0]};
    padding: ${spacing[0]};
    font-size: ${fontSize[16]};
  }

  *,
  *::before,
  *::after {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    scroll-behavior: smooth;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <FontStyles />
    <GlobalStyles />
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
