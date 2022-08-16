// import { useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import type { Theme } from './styles';
import {
	fontFamily,
	fontSize,
	fontStyle,
	fontWeight,
	mediaQuery,
	pxToRem,
	viewport
} from './styles';
import { Header, NetworkTokenModal, SwapForm } from './components';
import { useStore } from './helpers';

type Props = {
	theme: Theme;
};

export const GlobalStyles = createGlobalStyle`
	body {
		font-family: ${fontFamily};
		font-style: ${fontStyle.normal};
		font-weight: ${fontWeight.regular};
		font-size: ${fontSize[14]};
		line-height: ${fontSize[18]};
		max-width: ${viewport[1760]};
		min-height: 100vh;
		color: ${(props: Props) => props.theme.default};
		box-sizing: border-box;
		scroll-behavior: smooth;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
		margin: 0 auto;
		padding: 0 ${pxToRem(20)} ${pxToRem(40)};
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		transition: all 0.2s ease-in-out;
		background: ${(props: Props) => props.theme.background.default};

		${mediaQuery('s')} {
			background: ${(props: Props) =>
				`linear-gradient(180deg, ${props.theme.background.mobile}, ${props.theme.background.mobile} 55px, ${props.theme.background.default} 55px);`}
		}
	}

	*::-webkit-scrollbar {
		display: none;
	}
`;

const App = () => {
	const { state: { theme } } = useStore();
	// const [showModal, setShowModal] = useState(false);
	// const openModal = () => {
	// 	setShowModal(prev => !prev);
	// };

	return (
		<>
			<GlobalStyles theme={theme} />
			<Header />
			<NetworkTokenModal />
			<SwapForm />
		</>
	);
};

export default App;
