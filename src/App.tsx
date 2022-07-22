import { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, viewport, Colors, pxToRem } from './styles';
import { createGlobalStyle } from 'styled-components';
import { fontStyle, fontWeight, spacing, fontFamily } from './styles';
import Button from './components/button/button';

export const GlobalStyles = createGlobalStyle`
  body {
    font-family: ${fontFamily};
    font-style: ${fontStyle.normal};
    font-weight: ${fontWeight.regular};
    font-size: ${pxToRem(14)};
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
  const [selectedTheme, setSelectedTheme] = useState<Colors>(darkTheme);

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
    setSelectedTheme(getTheme);
    localStorage.setItem(localStorageThemeName, JSON.stringify(getTheme));
  };

  return (
    <>
      <ThemeProvider theme={selectedTheme}>
        <GlobalStyles />
        <Button onClick={() => console.log('Hi THERE')} theme={selectedTheme}>
          Primary
        </Button>
        <Button
          onClick={() => console.log('Hi THERE')}
          theme={selectedTheme}
          variant={'secondary'}
        >
          Secondary Default
        </Button>
        <Button
          onClick={() => console.log('Hi THERE')}
          theme={selectedTheme}
          variant="secondary"
          icon="moonbeam"
        >
          Moonbeam
        </Button>
        <Button
          onClick={() => console.log('Hi THERE')}
          theme={selectedTheme}
          variant={'secondary'}
          color={'warning'}
        >
          Check Network
        </Button>
        <Button
          onClick={() => console.log('Hi THERE')}
          theme={selectedTheme}
          variant={'secondary'}
          color={'error'}
        >
          Secondary Error
        </Button>
        <Button
          onClick={() => console.log('Hi THERE')}
          theme={selectedTheme}
          variant={'primary'}
          disabled
        >
          Primary disabled
        </Button>
        <Button
          onClick={() => console.log('Hi THERE')}
          theme={selectedTheme}
          variant={'pure'}
        >
          Pure
        </Button>
        <SwitchButton onClick={changeTheme}>
          {selectedTheme.name === 'light' ? 'DARK' : 'LIGHT'}
        </SwitchButton>
      </ThemeProvider>
    </>
  );
};

export default App;
