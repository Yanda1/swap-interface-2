import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import destinationNetworks from '../../data/destinationNetworks.json';
import { mediaQuery, pxToRem, spacing } from '../../styles';
import { ReactComponent as SwapperLight } from '../../assets/swapper-light.svg';
import { ReactComponent as SwapperDark } from '../../assets/swapper-dark.svg';
import {
	BINANCE_PRICE_TICKER,
	DestinationNetworkEnum,
	isLightTheme,
	useStore
} from '../../helpers';
import { Button, Fees, IconButton, NetworkTokenModal, TextField } from '../../components';

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

const SwapNames = styled.div(
	({ pos = 'start' }: { pos?: string }) => `
	display: flex;
	flex-direction: column;
	align-items: flex-${pos};

	${mediaQuery('xs')} {
		align-items: flex-start;
		width: 100%;
	}
`
);

const Name = styled.div(
	({ color }: { color: string }) => `
	color: ${color};
`
);

const ExchangeRate = styled.div(
	({ color }: { color: string }) => `
	margin: ${spacing[28]} 0;
	color: ${color};

	${mediaQuery('s')} {
	text-align: center;
	}
`
);

export const SwapForm = () => {
	const {
		state: {
			theme,
			destinationNetwork,
			destinationToken,
			destinationAddress,
			destinationAmount,
			destinationMemo
		},
		dispatch
	} = useStore();
	const [amount, setAmount] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [hasMemo, setHasMemo] = useState(false);
	const [currentPrice, setCurrentPrice] = useState('');
	const startToken = 'GLMR';

	const isDisabled =
		destinationNetwork === 'Select Network' ||
		destinationToken === 'Select Token' ||
		!destinationAmount ||
		!destinationAddress ||
		(hasMemo && !destinationMemo);

	const openModal = () => setShowModal(!showModal);

	useEffect(() => {
		const convertDestinationAmount = async () => {
			if (destinationToken !== 'Select Token') {
				try {
					const getPriceAndSymbol: { data: { symbol: string; price: string } } =
						await axios.request({ url: `${BINANCE_PRICE_TICKER}${startToken}${destinationToken}` });
					setCurrentPrice(getPriceAndSymbol.data.price);
				} catch (err: any) {
					throw new Error(err);
				}
			}
		};
		// eslint-disable-next-line
		convertDestinationAmount();
	}, [destinationToken]);

	useEffect(() => {
		dispatch({
			type: DestinationNetworkEnum.AMOUNT,
			payload: (+amount * +currentPrice).toFixed(8).toString()
		});
	}, [amount, currentPrice]);

	useEffect(() => {
		// @ts-ignore
		const hasTag = destinationNetworks?.[destinationNetwork]?.['hasTag'];
		setHasMemo(destinationNetwork === 'Select Network' ? false : hasTag);
	}, [destinationNetwork]);

	const handleSwap = (): void => {
		console.log({ destinationAmount, destinationToken, destinationAddress, destinationNetwork });
	};

	return (
		<Wrapper>
			<NetworkTokenModal showModal={showModal} setShowModal={setShowModal} />
			<Trader>
				<Swap>
					<SwapInput>
						<IconButton disabled icon="GLMR" onClick={() => console.log('Start token')} />
						<TextField
							type="number"
							placeholder="Amount"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>
					</SwapInput>
					<SwapNames>
						<Name color={theme.font.pure}>GLMR</Name>
						<Name color={theme.font.default}>(Moonbeam)</Name>
					</SwapNames>
				</Swap>
				{isLightTheme(theme) ? (
					<SwapperLight style={{ marginBottom: 38 }} />
				) : (
					<SwapperDark style={{ marginBottom: 38 }} />
				)}
				<Swap>
					<SwapInput>
						<IconButton onClick={openModal} icon={destinationToken as any} />
						{/* TODO: check if comma stays the same for dynamic input*/}
						<TextField disabled type="number" value={destinationAmount} />
					</SwapInput>
					<SwapNames pos="end">
						<Name color={theme.font.pure}>{destinationToken}</Name>
						<Name color={theme.font.default}>{destinationNetwork}</Name>
					</SwapNames>
				</Swap>
			</Trader>
			<ExchangeRate color={theme.font.pure}>
				{destinationToken === 'Select Token'
					? 'Please select token to see price'
					: `1 GLMR = ${currentPrice} ${destinationToken}`}
			</ExchangeRate>
			<TextField
				value={destinationAddress}
				description="Destination Address"
				onChange={(e) =>
					dispatch({
						type: DestinationNetworkEnum.ADDRESS,
						payload: e.target.value
					})
				}
			/>
			{hasMemo && (
				<TextField
					value={destinationMemo}
					description="Destination Memo"
					onChange={(e) => dispatch({ type: DestinationNetworkEnum.MEMO, payload: e.target.value })}
				/>
			)}
			<Fees
				amount={amount}
				token={destinationToken}
				network={destinationNetwork}
				address={destinationAddress}
			/>
			<Button onClick={handleSwap} disabled={!isDisabled}>
				Swap
			</Button>
		</Wrapper>
	);
};
