import styled from 'styled-components';
import { viewport, pxToRem } from './styles';
import { useAuth } from './helpers';
import { createGlobalStyle } from 'styled-components';
import { fontStyle, fontWeight, fontFamily, mediaQuery } from './styles';
import { Button } from './components';

export const GlobalStyles = createGlobalStyle`
    body {
      font-family: ${fontFamily};
      font-style: ${fontStyle.normal};
      font-weight: ${fontWeight.regular};
      font-size: ${pxToRem(14)};
      max-height: ${viewport[1760]}; // check with Ilaria
      background: ${(props: any) => props.theme.background.default};
      ${mediaQuery('s')} {
      background: ${(props: any) =>
        `linear-gradient(180deg, ${props.theme.background.mobile}, ${props.theme.background.mobile} 52px, ${props.theme.background.default} 52px);`}
      }
    }
    
    *,
    *::before,
    *::after {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      box-sizing: border-box;
      scroll-behavior: smooth;
      overflow: hidden;
      margin: 0;
    }
    `;

const AppStyle = styled.main`
  padding: ${pxToRem(67.5)} ${pxToRem(20)} ${pxToRem(40)};
  max-width: ${pxToRem(466)};
  height: calc(100vh - 52px);
  color: ${(props: any) => props.theme.default};
  transition: all 0.2s ease-in-out;
  margin: 0 auto;
  ${mediaQuery('xs')} {
    padding-top: ${pxToRem(39.5)};
  }
`;

const App = () => {
  const { state } = useAuth();
  const { theme } = state;

  return (
    <AppStyle theme={theme}>
      <GlobalStyles theme={theme} />
      <Button onClick={() => console.log('Hi THERE')}>Primary</Button>
      <Button onClick={() => console.log('Hi THERE')} variant={'secondary'}>
        Secondary Default
      </Button>
      <Button
        onClick={() => console.log('Hi THERE')}
        variant="secondary"
        icon="moonbeam"
      >
        Moonbeam
      </Button>
      <Button
        onClick={() => console.log('Hi THERE')}
        variant={'secondary'}
        color={'warning'}
      >
        Check Network
      </Button>
      <Button
        onClick={() => console.log('Hi THERE')}
        variant={'secondary'}
        color={'error'}
      >
        Secondary Error
      </Button>
      <Button
        onClick={() => console.log('Hi THERE')}
        variant={'primary'}
        disabled
      >
        Primary disabled
      </Button>
      <Button onClick={() => console.log('Hi THERE')} variant={'pure'}>
        Pure
      </Button>
    </AppStyle>
  );
};

export default App;
