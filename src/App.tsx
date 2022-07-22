import { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, viewport } from './styles';
import { createGlobalStyle } from 'styled-components';
import { fontStyle, fontWeight, spacing, fontFamily, fontSize } from './styles';
import Button from './components/button/button';

export const GlobalStyles = createGlobalStyle`
  body {
    font-family: ${fontFamily};
    font-style: ${fontStyle.normal};
    font-weight: ${fontWeight.regular};
    font-size: ${fontSize[14]};
    margin: ${spacing[0]} auto;
    border: 2px solid red; // remove, for demo only
    max-width: ${viewport[1300]};
    height: 100vh;
    max-height: ${viewport[1760]}; // check with Ilaria
    padding: ${spacing[0]};
    color: ${(props: any) => props.theme.default};
    background-color: ${(props: any) => props.theme.background.default};
    transition: all .2s ease-in-out;
    padding: ${spacing[10]} ${spacing[20]} ${spacing[40]};
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


  /* START --- THIS PART IS FOR DEMO ONLY - HAS TO BE REMOVED */

const SwitchButton = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
  color: ${(props: any) => props.theme.default};
  border: 2px solid ${(props: any) => props.theme.default};
  background-color: ${(props: any) => props.theme.background.default};
`;

  /* END --- THIS PART IS FOR DEMO ONLY - HAS TO BE REMOVED */


const App = () => {
  const localStorageThemeName: string = 'current-theme';
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
    const getTheme = selectedTheme.name === 'light' ? darkTheme : lightTheme;
    console.log('___GET THEME___', getTheme);
    setSelectedTheme(getTheme);
    localStorage.setItem(localStorageThemeName, JSON.stringify(getTheme));
  };

  return (
    <>
      <ThemeProvider theme={selectedTheme}>
        <GlobalStyles />
        {/* START --- THIS PART IS FOR DEMO ONLY - HAS TO BE REMOVED */}
        <Button variant={"primary"}>
          Connect Wallet
        </Button>
        <Button variant={"secondary"}>
          Connect Wallet
        </Button>
        <Button  variant={"secondary"} color={"icon"}>
          Moonbean
        </Button>
        <Button  variant={"secondary"} color={"warning"} >
          Complete KYC
        </Button>
        <Button   variant={"secondary"} color={"error"}>
          Wrong Network
        </Button>
        <Button  variant={"primary"} disabled>
          Change network...
        </Button>
        <Button  variant={"pure"}>
          Transactions History
        </Button>
        <SwitchButton onClick={changeTheme}>
          {selectedTheme.name === 'light' ? 'DARK' : 'LIGHT'}
        </SwitchButton>
        {/* END --- THIS PART IS FOR DEMO ONLY - HAS TO BE REMOVED */}
      </ThemeProvider>
    </>
  );
};

export default App;
