import styled from 'styled-components';
import { viewport, pxToRem } from './styles';
import type { Theme } from './styles';
import { useAuth } from './helpers';
import { createGlobalStyle } from 'styled-components';
import { fontStyle, fontWeight, fontFamily, mediaQuery } from './styles';
import { Button, Header } from './components';
import { Modal } from './components/modal/modal';
import { useState } from 'react';

type Props = {
	theme: Theme;
};

export const GlobalStyles = createGlobalStyle`
    body {
      font-family: ${fontFamily};
      font-style: ${fontStyle.normal};
      font-weight: ${fontWeight.regular};
      font-size: ${pxToRem(14)};
      max-width: ${viewport[1760]};
      max-height: ${viewport[1760]}; // check with Ilaria
      margin: 0 auto;
      background: ${(props: Props) => props.theme.background.default};
      padding: 0 ${pxToRem(20)} ${pxToRem(40)};
      height: 100vh;
      color: ${(props: Props) => props.theme.default};
      transition: all 0.2s ease-in-out;
      ${mediaQuery('s')} {
        background: ${(props: Props) =>
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
      margin: 0;
    }
    `;

const MainStyle = styled.main`
	max-width: ${pxToRem(466)};
	margin: 0 auto;
	outline: 2px solid red;
`;

const App = () => {
	const { state } = useAuth();
	const { theme } = state;
	const [showModal, setShowModal] = useState(false);
	const openModal = () => {
		setShowModal(prev => !prev);
	}

	return (
		<>
			<GlobalStyles theme={theme}/>
			<Header />
			<Modal showModal={showModal} setShowModal={setShowModal}/>
			<MainStyle>
				<Button onClick={openModal} variant={'secondary'} icon='metamask'></Button>
			</MainStyle>
		</>
	);
};

export default App;
