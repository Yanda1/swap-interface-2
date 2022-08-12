import styled, { createGlobalStyle } from 'styled-components';
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
import { Header, Swapper } from './components';
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
		max-height: ${viewport[1760]}; // check with Ilaria
		margin: 0 auto;
		background: ${(props: Props) => props.theme.background.default};
		padding: 0 ${pxToRem(20)} ${pxToRem(40)};
		height: 100vh;
		color: ${(props: Props) => props.theme.default};
		transition: all 0.2s ease-in-out;

		${mediaQuery('s')} {
			background: ${(props: Props) =>
				`linear-gradient(180deg, ${props.theme.background.mobile}, ${props.theme.background.mobile} 55px, ${props.theme.background.default} 55px);`}
		}
	}

	*,
	*::before,
	*::after {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		box-sizing: border-box;
		scroll-behavior: smooth;
		overflow: scroll;
		margin: 0;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	*::-webkit-scrollbar {
		display: none;
	}
`;

const MainStyle = styled.main`
	display: flex;
	flex-direction: column;
	max-width: ${pxToRem(428)}; // TODO: refasctor without width
	margin: 0 auto;
`;

const App = () => {
	const { state } = useStore();
	const { theme } = state;

	return (
		<>
			<GlobalStyles theme={theme} />
			<Header />
			<MainStyle>
				<Swapper />
			</MainStyle>
		</>
	);
};

export default App;
