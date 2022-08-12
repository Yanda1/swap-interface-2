import { useState } from 'react';
import styled from 'styled-components';
import { mediaQuery, pxToRem, spacing } from '../../styles';
import { ReactComponent as SwapperLight } from '../../assets/swapper-light.svg';
import { ReactComponent as SwapperDark } from '../../assets/swapper-dark.svg';
import { DestinationNetworkEnum, isLightTheme, useStore } from '../../helpers';
import { Button, NetworkTokenModal, TextField, IconButton } from '../../components';

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
	flex-direction: column;
	gap: ${spacing[4]};
	flex: 1;

	${mediaQuery('xs')} {
		width: 100%;
	}
`;

const SwapInput = styled.div`
	display: flex;
	gap: ${spacing[8]};
	justify-content: space-between;
`;

const SwapNames = styled.div(({ pos = 'start' }: { pos?: string }) => `
	display: flex;
	flex-direction: column;
	align-items: flex-${pos};

	${mediaQuery('xs')} {
		align-items: flex-start;
		width: 100%;
	}
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
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-top: 6px solid ${color};
	transform: rotate(${!turnArrow ? '0' : '180'}deg);
  transition: transform .3s linear;
`);

export const Swapper = () => {
	const { state: { theme, network, token, destinationAddress }, dispatch } = useStore();
	const [amount, setAmount] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [turnArrow, setTurnArrow] = useState(false);

	const openModal = () => setShowModal(prev => !prev);

	const handleAddressChange = (event: any) => {
		dispatch({ type: DestinationNetworkEnum.ADDRESS, payload: event.target.value });
	};

	return (
		<>
			<NetworkTokenModal showModal={showModal} setShowModal={setShowModal} />
			<Trader>
				<Swap>
					<SwapInput>
						<IconButton disabled icon='GLMR' onClick={() => console.log('Start token')} />
						<TextField
							type="number"
							placeholder="Amount"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>
					</SwapInput>
					<SwapNames>
						<Name color={theme.color.pure}>GLMR</Name>
						<Name color={theme.color.default}>(Moonbeam)</Name>
					</SwapNames>
				</Swap>
				{isLightTheme(theme) ?
					<SwapperLight style={{ marginBottom: 38 }} /> :
					<SwapperDark style={{ marginBottom: 38 }} />
				}
				<Swap>
					<SwapInput>
						<IconButton onClick={openModal} icon='USDT' />
						<TextField type="number"
											 value="0.123423454" // TODO: check if comma stays the same for dynamic input
											 disabled />
					</SwapInput>
					<SwapNames pos="end">
						<Name color={theme.color.pure}>{token ? token : 'DOT'}</Name>
						<Name color={theme.color.default}>({network ? network : 'BNB'})</Name>
					</SwapNames>
				</Swap>
			</Trader>
			<ExchangeRate color={theme.color.pure}>
				1 GLMR = 20 DOT
			</ExchangeRate>
			<TextField placeholder="Destination Address"
								 value={destinationAddress}
								 description="Destination Address"
								 onChange={(e) => handleAddressChange(e)}
			/>
			<Fee color={theme.color.pure}>Fee: 0.123432423423423
				<Arrow
					color={theme.arrow}
					turnArrow={turnArrow}
					onClick={() => setTurnArrow((!turnArrow))}
				/>
			</Fee>
			<Fees turnArrow={turnArrow}
						color={theme.default}>
				<div><p>Gas fee:</p><p>1234.12345665 GLMR</p></div>
				<div><p>Ex rate:</p><p>1234.5665 DOT</p></div>
				<div><p>CEX rate:</p><p>1234.5665 DOT</p></div>
				<div><p>Withdrawal fee:</p><p>1234.5665 DOT</p></div>
			</Fees>
			<Button onClick={() => console.log('Click')}>Swap</Button>
		</>
	);
};
