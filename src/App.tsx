import { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, viewport } from "./styles";
import { createGlobalStyle } from "styled-components";
import { fontStyle, fontWeight, spacing, fontFamily, fontSize } from "./styles";

export const GlobalStyles = createGlobalStyle`
  body {
    font-family: ${fontFamily};
    font-style: ${fontStyle.normal};
    font-weight: ${fontWeight.regular};
    margin: ${spacing[0]} auto;
    border: 2px solid red; // remove, for demo only
    max-width: ${viewport[1300]};
    height: 100vh;
    max-height: ${viewport[1760]}; // check with Ilaria
    padding: ${spacing[0]};
    font-size: ${fontSize[16]};
    color: ${(props: any) => props.theme.default};
    background-color: ${(props: any) => props.theme.background.default};
    transition: all .3s ease-in-out;
  }

  *,
  *::before,
  *::after {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    scroll-behavior: smooth;
    overflow: hidden;
  }
`;

{
  /* START --- THIS PART IS FOR DEMO ONLY - HAS TO BE REMOVED */
}
const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
  color: ${(props: any) => props.theme.default};
  border: 2px solid ${(props: any) => props.theme.default};
  background-color: ${(props: any) => props.theme.background.default};
`;
{
  /* END --- THIS PART IS FOR DEMO ONLY - HAS TO BE REMOVED */
}

const App = () => {
  const localStorageThemeName: string = "current-theme";
  const [selectedTheme, setSelectedTheme] = useState(darkTheme);

  useEffect(() => {
    const currentTheme = JSON.parse(
      localStorage.getItem(localStorageThemeName) as string
    );
    if (currentTheme) {
      setSelectedTheme(currentTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeTheme = (): void => {
    const getTheme = selectedTheme.name === "light" ? darkTheme : lightTheme;
    console.log(getTheme);
    setSelectedTheme(getTheme);
    localStorage.setItem(localStorageThemeName, JSON.stringify(getTheme));
  };

  return (
    <div>
      <ThemeProvider theme={selectedTheme}>
        <GlobalStyles />
        {/* START --- THIS PART IS FOR DEMO ONLY - HAS TO BE REMOVED */}
        <Button onClick={changeTheme}>
          {selectedTheme.name === "light" ? "DARK" : "LIGHT"}
        </Button>
        <h1>Welcome to Yanda</h1>
        {/* END --- THIS PART IS FOR DEMO ONLY - HAS TO BE REMOVED */}
      </ThemeProvider>
    </div>
  );
};

export default App;
