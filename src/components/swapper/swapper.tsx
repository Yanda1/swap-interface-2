import styled from 'styled-components';
import { spacing } from '../../styles';
import { Input } from '../input/input';
import { ReactComponent as SwapperLight } from '../../assets/swapper-light.svg';
import { ReactComponent as SwapperDark } from '../../assets/swapper-dark.svg';
import { isLightTheme, useStore } from '../../helpers';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const Trader = styled.div`
	display: flex;
	gap: ${spacing[10]};
	align-items: center;
`;

const Ali = styled.div`
	height: 58px;
	width: 72px;
	border: 1px solid grey;
	border-radius: 6px;
`;

const NamesDisplay = styled.div`
	margin-top: ${spacing[4]};
	display: flex;
	justify-content: space-between;
`;

const Names = styled.div(({ pos = 'start' }: { pos?: string }) => `
	display: flex;
	flex-direction: column;
	align-items: flex-${pos};
`);

const Name = styled.div(({ color }: { color: string }) => `
	color: ${color}
`);

export const Swapper = () => {
	const { state: { theme } } = useStore();
	console.log(theme);

	return (
		<Wrapper>
			<Trader>
				<Ali /><Input />{isLightTheme(theme) ? <SwapperLight /> :
				<SwapperDark />}<Ali /><Input />
			</Trader>
			<NamesDisplay>
				<Names>
					<Name color={theme.color.pure}>GLMR</Name>
					<Name color={theme.color.default}>(Moonbeam)</Name>
				</Names>
				<Names pos="end">
					<Name color={theme.color.pure}>DOT</Name>
					<Name color={theme.color.default}>(BNB)</Name>
				</Names>
			</NamesDisplay>
		</Wrapper>
	);
};
