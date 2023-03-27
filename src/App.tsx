import './styles/fonts/font.css';
import styled, { createGlobalStyle, css } from 'styled-components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import type { Theme } from './styles';
import {
	DEFAULT_TRANSITION,
	fontFamily,
	fontSize,
	fontStyle,
	fontWeight,
	MAIN_MAX_WIDTH,
	mediaQuery,
	pxToRem,
	spacing,
	viewport
} from './styles';
import { Header, Footer } from './components';
import { SwapForm, TransactionHistory } from './pages';
import { useStore } from './helpers';
import { TabModal } from './components/tabs/tabModal';

type Props = {
	theme: Theme;
};

export const GlobalStyles = createGlobalStyle`
	html {
		background-color: ${(props: Props) => props.theme.background.default};
	}

	body {
		font-family: ${fontFamily};
		font-style: ${fontStyle.normal};
		font-weight: ${fontWeight.regular};
		font-size: ${fontSize[14]};
		line-height: ${fontSize[18]};
		max-width: ${viewport[1760]};
		// min-height: 100vh;
		height: 100vh;
		color: ${(props: Props) => props.theme.font.default};
		box-sizing: border-box;
		scroll-behavior: smooth;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
		margin: 0 auto;
		padding: 0 ${pxToRem(20)} ${pxToRem(40)};
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		transition: ${DEFAULT_TRANSITION};
		background: ${(props: Props) =>
			`linear-gradient(to bottom, ${props.theme.background.default}, ${props.theme.background.default})`};

		${mediaQuery('s')} {
			background: ${(props: Props) =>
				`linear-gradient(180deg, ${props.theme.background.secondary}, ${props.theme.background.secondary} 52px, ${props.theme.background.default} 52px);`}
		}
	}

	*::-webkit-scrollbar {
		display: none;
	}
`;

const MainWrapper = styled.main`
	margin: 0;
	min-height: 100vh;
    display: flex;
  	flex-direction: column;
`;

const ContentWrapper = styled.main`
	margin: 0 auto;
	max-width: ${MAIN_MAX_WIDTH};
	flex: 1;
`;

const Title = styled.p(() => {
	const { state: { theme } } = useStore();

	return css`
		text-align: center;
		margin: 0 0 ${spacing[48]};
		color: ${theme.font.default}
	`;
});

const App = () => {
	const {
		state: { theme }
	} = useStore();

	return (
		<Router>
			<MainWrapper>
				<GlobalStyles theme={theme}/>
				<Header/>
				<Routes>
					<Route
						path="/"
						element={
							<ContentWrapper>
								<Title>Swap over 20 Ethereum and Moonbeam tokens for 150+ tokens across 80+ different networks directly
									from
									your wallet</Title>
								<SwapForm/>
								<TabModal/>
							</ContentWrapper>
						}
					/>
					<Route path="/transaction-history" element={<TransactionHistory/>}/>
				</Routes>
				<Footer/>
			</MainWrapper>
		</Router>
	);
};

export default App;
