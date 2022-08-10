import { useState } from 'react';
import styled from 'styled-components';
import { mediaQuery, pxToRem, spacing } from '../../styles';
import { ReactComponent as SwapperLight } from '../../assets/swapper-light.svg';
import { ReactComponent as SwapperDark } from '../../assets/swapper-dark.svg';
import { isLightTheme, useStore } from '../../helpers';
import { Button, TextField } from '../../components';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const Trader = styled.div`
	display: flex;
	gap: ${spacing[10]};
	align-items: center;

	${mediaQuery('xs')} {
		flex-direction: column;
	}
`;

const Swap = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	gap: ${spacing[8]}
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
	color: ${color};
`);

const ExchangeRate = styled.div(({ color }: { color: string }) => `
	margin: ${spacing[28]} 0;
	color: ${color};

	${mediaQuery('s')} {
	text-align: center;
	}
`);

const Fee = styled.div(({ color }: { color: string }) => `
	display: flex;
	align-items: center;
	gap: ${spacing[8]};
	color: ${color};
	margin: ${spacing[28]} 0;
`);

const Fees = styled.div(({ turnArrow, color }: { turnArrow: boolean; color: string }) => `
	height: ${!turnArrow ? '0' : 'max-content'}px;
	flex-direction: column;
	margin-bottom: ${turnArrow ? spacing[56] : 0};
  transition: all .15s ease-out;
  padding: ${!turnArrow ? 0 : spacing[10]} ${spacing[16]};
  border-radius: ${pxToRem(6)};
  border: 1px solid ${turnArrow ? color : 'transparent'};

	& > * {
		display: flex;
		justify-content: space-between;
	}
`);

const Arrow = styled.div(({ color, turnArrow }: { color: string; turnArrow: boolean }) => `
	width: 0;
	height: 0;
	border-left: 7px solid transparent;
	border-right: 7px solid transparent;
	border-top: 7px solid ${color};
	transform: rotate(${!turnArrow ? '0' : '180'}deg);
  transition: transform .3s linear;
`);

export const Swapper = () => {
	const { state: { theme, network, token } } = useStore();
	const [amount, setAmount] = useState('');
	const [turnArrow, setTurnArrow] = useState(false);

	return (
		<Wrapper>
			<Trader>
				<Swap>
					<Ali />
					<TextField
						type="number"
						placeholder="Amount"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
					/>
				</Swap>
				{isLightTheme(theme) ? <SwapperLight /> : <SwapperDark />}
				<Swap>
					<Ali />
					<TextField type="number" value="0.123423454" disabled />
				</Swap>
			</Trader>
			<NamesDisplay>
				<Names>
					<Name color={theme.color.pure}>GLMR</Name>
					<Name color={theme.color.default}>(Moonbeam)</Name>
				</Names>
				<Names pos="end">
					<Name color={theme.color.pure}>{token ? token : 'DOT'}</Name>
					<Name color={theme.color.default}>({network ? network : 'BNB'})</Name>
				</Names>
			</NamesDisplay>
			<ExchangeRate color={theme.color.pure}>
				1 GLMR = 20 DOT
			</ExchangeRate>
			<TextField placeholder="Destination address" value="" description="Destination Address" />
			<Fee color={theme.color.pure}>Fee: 0.123432423423423
				<Arrow
					color={theme.arrow}
					turnArrow={turnArrow}
					onClick={() => setTurnArrow((!turnArrow))}
				/>
			</Fee>
			<Fees turnArrow={turnArrow} color={theme.default}>
				<div><p>Gas fee:</p><p>1234.12345665 GLMR</p></div>
				<div><p>Ex rate:</p><p>1234.5665 DOT</p></div>
				<div><p>CEX rate:</p><p>1234.5665 DOT</p></div>
				<div><p>Withdrawal fee:</p><p>1234.5665 DOT</p></div>
			</Fees>
			<Button onClick={() => console.log('Click')}>Swap</Button>
		</Wrapper>
	);
};
