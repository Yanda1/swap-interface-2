import styled from 'styled-components';
import { viewport, pxToRem } from './styles';
import { useAuth } from './helpers';
import { createGlobalStyle } from 'styled-components';
import { fontStyle, fontWeight, fontFamily, mediaQuery } from './styles';
import { Button, Header } from './components';

export const GlobalStyles = createGlobalStyle`
    body {
      font-family: ${fontFamily};
      font-style: ${fontStyle.normal};
      font-weight: ${fontWeight.regular};
      font-size: ${pxToRem(14)};
      max-width: ${viewport[1760]};
      max-height: ${viewport[1760]}; // check with Ilaria
      margin: 0 auto;
      background: ${(props: any) => props.theme.background.default};
      padding: 0 ${pxToRem(20)} ${pxToRem(40)};
      height: 100vh;
      color: ${(props: any) => props.theme.default};
      transition: all 0.2s ease-in-out;
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

const MainStyle = styled.main`
  max-width: ${pxToRem(466)};
  margin: 0 auto;
`;

const App = () => {
  const { state } = useAuth();
  const { theme } = state;

  return (
    <>
      <GlobalStyles theme={theme} />
      <Header />
      <MainStyle>
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
      </MainStyle>
    </>
  );
};

export default App;
