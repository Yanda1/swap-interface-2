import styled, { css } from 'styled-components';
import { mediaQuery, pxToRem, spacing, Theme } from '../../styles';
import { ReactComponent as SwapperLight } from '../../assets/swapper-light.svg';
import { ReactComponent as SwapperDark } from '../../assets/swapper-dark.svg';
import {
	BINANCE_PRICE_TICKER,
	DestinationNetworkEnum,
	isLightTheme,
	useStore
} from '../../helpers';
import { Button, TextField, IconButton, NetworkTokenModal  } from '../../components';
import axios from 'axios';

const Wrapper = styled.main`
	margin: 0 auto;
	max-width: ${pxToRem(428)};
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

const Fee = styled.summary(({ color, theme }: { color: string; theme: Theme }) => css`
	color: ${theme.pure};
	margin: ${spacing[28]} 0;
	cursor: pointer;

	&:focus-visible {
		outline-offset: 2px;
		outline: 1px solid ${color};
	}

	&:active {
		outline: none;
	}
`);

const Fees = styled.div(({ color }: { color: string }) => css`
	flex-direction: column;
	padding: ${spacing[10]} ${spacing[16]};
	margin-bottom: ${spacing[56]};
	border-radius: ${pxToRem(6)};
	border: 1px solid ${color};

	& > * {
		display: flex;
		justify-content: space-between;
	}
`);

export const SwapForm = () => {
	const {
		state: { theme, destinationNetwork, destinationToken, destinationAddress, destinationAmount },
		dispatch
	} = useStore();
	const [amount, setAmount] = useState('');
	const [currentPrice, setCurrentPrice] = useState('');
	const startToken = 'GLMR';
	const token = 'BNB';

	const openModal = () => setShowModal(prev => !prev);

	const handleAddressChange = (event: any) => {
		dispatch({ type: DestinationNetworkEnum.ADDRESS, payload: event.target.value });
	};

	useEffect(() => {
		const convertDestinationAmount = async () => {
			try {
				const getPriceAndSymbol: { data: { symbol: string; price: string } } = await axios.request({ url: `${BINANCE_PRICE_TICKER}${startToken}${token}` }); // TODO: change to destinationToken
				setCurrentPrice(getPriceAndSymbol.data.price);
			} catch (err: any) {
				throw new Error(err);
			}
		};
		// eslint-disable-next-line
		convertDestinationAmount();
	}, [token]);

	useEffect(() => {
		dispatch({
			type: DestinationNetworkEnum.AMOUNT,
			payload: (+amount * +currentPrice).toFixed(8).toString()
		});
	}, [amount, currentPrice]);

	console.log(destinationAmount);

	return (
		<Wrapper>
			<NetworkTokenModal showModal={showModal} setShowModal={setShowModal} />
			<Trader>
				<Swap>
					<SwapInput>
						<IconButton disabled icon='GLMR' onClick={() => console.log('Start token')} />
						<TextField
							type='number'
							placeholder='Amount'
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>
					</SwapInput>
					<SwapNames>
						<Name color={theme.font.pure}>GLMR</Name>
						<Name color={theme.font.default}>(Moonbeam)</Name>
					</SwapNames>
				</Swap>
				{isLightTheme(theme) ?
					<SwapperLight style={{ marginBottom: 38 }} /> :
					<SwapperDark style={{ marginBottom: 38 }} />
				}
				<Swap>
					<SwapInput>
						<IconButton onClick={openModal} icon={token} />
						{/* TODO: check if comma stays the same for dynamic input*/}
						<TextField type='number' value='0.123423454' />
					</SwapInput>
					<SwapNames pos='end'>
						<Name color={theme.font.pure}>{destinationToken}</Name>
						<Name color={theme.font.default}>{destinationNetwork}</Name>
					</SwapNames>
				</Swap>
			</Trader>
			<ExchangeRate color={theme.font.pure}>
				{/* TODO: change to destinationToken */}
				1 GLMR = {currentPrice} {token}
			</ExchangeRate>
			<TextField
				value={destinationAddress}
				description='Destination Address'
				onChange={(e) => handleAddressChange(e)}
			/>
			<details>
				<Fee color={theme.default}
						 theme={theme}>Fee: 0.123432423423423</Fee>
				<Fees color={theme.default}>
					<div><p>Gas fee:</p><p>1234.12345665 GLMR</p></div>
					<div><p>Ex rate:</p><p>1234.5665 DOT</p></div>
					<div><p>CEX rate:</p><p>1234.5665 DOT</p></div>
					<div><p>Withdrawal fee:</p><p>1234.5665 DOT</p></div>
				</Fees>
			</details>
			<Button onClick={() => console.log('Click')}>Swap</Button>
		</Wrapper>
	);
};
