import './styles/fonts/font.css';
import styled, { createGlobalStyle } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import type { Theme } from './styles';
import {
	fontFamily,
	fontSize,
	fontStyle,
	fontWeight,
	MAIN_MAX_WIDTH,
	mediaQuery,
	pxToRem,
	viewport,
	DEFAULT_TRANSIITON
} from './styles';
import { Header } from './components';
import { SwapForm, TransactionHistory } from './pages';
import { useStore } from './helpers';
import { TabModal } from './components/tabs/tabModal';

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
		color: ${(props: Props) => props.theme.font.default};
		box-sizing: border-box;
		scroll-behavior: smooth;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
		margin: 0 auto;
		padding: 0 ${pxToRem(20)} ${pxToRem(40)};
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		transition: ${DEFAULT_TRANSIITON};
		background: ${(props: Props) =>
			`linear-gradient(to bottom, ${props.theme.background.default}, ${props.theme.background.default})`};

		${mediaQuery('s')} {
			background: ${(props: Props) =>
				`linear-gradient(180deg, ${props.theme.background.mobile}, ${props.theme.background.mobile} 55px, ${props.theme.background.default} 55px);`}
		}
	}

	*::-webkit-scrollbar {
		display: none;
	}
`;

const Wrapper = styled.main`
	margin: 0 auto;
	max-width: ${MAIN_MAX_WIDTH};
`;

const App = () => {
	const {
		state: { theme }
	} = useStore();

	return (
		<Router>
			<GlobalStyles theme={theme} />
			<Header />
			<Routes>
				<Route
					path="/"
					element={
						<Wrapper>
							<SwapForm />
							<TabModal />
						</Wrapper>
					}
				/>
				<Route path="/transaction-history" element={<TransactionHistory />} />
			</Routes>
		</Router>
	);
};

export default App;
