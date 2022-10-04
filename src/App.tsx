import './styles/fonts/font.css';
import styled, { createGlobalStyle } from 'styled-components';
import type { Theme } from './styles';
import {
	fontFamily,
	fontSize,
	fontStyle,
	fontWeight,
	MAIN_MAX_WIDTH,
	mediaQuery,
	pxToRem,
	viewport
} from './styles';
import { Header, SwapForm } from './components';
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

const Wrapper = styled.main`
	margin: 0 auto;
	max-width: ${MAIN_MAX_WIDTH};
`;

const App = () => {
	const {
		state: { theme }
	} = useStore();

	return (
		<>
			<GlobalStyles theme={theme} />
			<Header />
			<Wrapper>
				<SwapForm />
				<TabModal
					data={[
						{
							costRequestCounter: 1,
							depositBlock: 15,
							// orders: [{ t: 1, a: 0, s: 'GLMRBTC', q: '13.0000', p: '11.29', ts: 1664802964878 }],
							withdraw: true,
							action: 0,
							complete: null
						},
						{
							costRequestCounter: 2,
							depositBlock: 30,
							// orders: [{ t: 0, a: 0, s: 'USDTBTC', q: '44.0000', p: '41.132', ts: 165580999.011 }],
							withdraw: true,
							action: 1,
							complete: true
						},
						{
							costRequestCounter: 2,
							depositBlock: 30,
							orders: [{ t: 0, a: 0, s: 'USDTBTC', q: '44.0000', p: '41.132', ts: 165580999.011 }],
							withdraw: true,
							action: 1,
							complete: true
						},
						{
							costRequestCounter: 2,
							depositBlock: 30,
							orders: [{ t: 0, a: 0, s: 'USDTBTC', q: '44.0000', p: '41.132', ts: 165580999.011 }],
							withdraw: true,
							action: 1,
							complete: true
						},
						{
							costRequestCounter: 2,
							depositBlock: 30,
							orders: [{ t: 0, a: 0, s: 'USDTBTC', q: '44.0000', p: '41.132', ts: 165580999.011 }],
							withdraw: true,
							action: 1,
							complete: true
						},
						{
							costRequestCounter: 2,
							depositBlock: 30,
							orders: [{ t: 0, a: 0, s: 'USDTBTC', q: '44.0000', p: '41.132', ts: 165580999.011 }],
							withdraw: true,
							action: 1,
							complete: true
						}
					]}
				/>
			</Wrapper>
		</>
	);
};

export default App;
