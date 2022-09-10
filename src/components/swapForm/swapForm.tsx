import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import destinationNetworks from '../../data/destinationNetworks.json';
import { mediaQuery, pxToRem, spacing } from '../../styles';
import { ReactComponent as SwapperLight } from '../../assets/swapper-light.svg';
import { ReactComponent as SwapperDark } from '../../assets/swapper-dark.svg';
import {
	DestinationNetworkEnum,
	isLightTheme,
	isNetworkSelected,
	isTokenSelected,
	realParseFloat,
	removeZeros,
	startToken,
	useBinanceApi,
	useStore
} from '../../helpers';
import { Fees, IconButton, NetworkTokenModal, SwapButton, TextField } from '../../components';

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
			destinationMemo,
			isUserVerified
		},
		dispatch
	} = useStore();
	const { allFilteredPrices } = useBinanceApi();
	const [amount, setAmount] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [hasMemo, setHasMemo] = useState(false);
	const [currentPrice, setCurrentPrice] = useState('');
	const [destinationAddressIsValid, setDestinationAddressIsValid] = useState(false);
	const [destinationMemoIsValid, setDestinationMemoIsValid] = useState(false);
	const [minAmount, setMinAmount] = useState(0);
	const swapButtonRef = useRef();

	const openModal = () => setShowModal(!showModal);

	useEffect(() => {
		const convertDestinationAmount = () => {
			if (isTokenSelected(destinationToken)) {
				const getSymbol: any = allFilteredPrices.find(
					(pair: { symbol: string; price: string }) =>
						pair.symbol === `${startToken}${destinationToken}`
				);
				setCurrentPrice(getSymbol?.price);
			}
		};
		convertDestinationAmount();
	}, [destinationToken]);

	useEffect(() => {
		dispatch({
			type: DestinationNetworkEnum.AMOUNT,
			payload: realParseFloat((+amount * +currentPrice).toFixed(8).toString())
		});
	}, [amount, currentPrice]);

	useEffect(() => {
		// @ts-ignore
		const hasTag = destinationNetworks?.[destinationNetwork]?.['hasTag'];
		setHasMemo(!isNetworkSelected(destinationNetwork) ? false : hasTag);
	}, [destinationNetwork]);

	useEffect(() => {
		const addressRegEx = new RegExp(
			// @ts-ignore,
			destinationNetworks?.[destinationNetwork]?.['tokens']?.[destinationToken]?.['addressRegex']
		);
		const memoRegEx = new RegExp(
			// @ts-ignore
			destinationNetworks?.[destinationNetwork]?.['tokens']?.[destinationToken]?.['tagRegex']
		);

		const calculateAmount =
			// @ts-ignore
			+destinationNetworks?.[destinationNetwork]?.['tokens']?.[destinationToken]?.['withdrawMin'] /
			+currentPrice;
		setMinAmount(+calculateAmount || 0);

		setDestinationAddressIsValid(() => addressRegEx.test(destinationAddress));
		setDestinationMemoIsValid(() => memoRegEx.test(destinationMemo));
	}, [destinationAddress, destinationMemo, destinationNetwork, destinationToken, currentPrice]);

	const handleSwap = (): void => {
		if (destinationAddressIsValid && destinationMemoIsValid && +amount >= minAmount) {
			// @ts-ignore
			swapButtonRef.current.onSubmit();
		}
	};

	return (
		<Wrapper>
			<NetworkTokenModal showModal={showModal} setShowModal={setShowModal} />
			<Trader>
				<Swap>
					<SwapInput>
						<IconButton disabled icon="GLMR" />
						<TextField
							type="number"
							placeholder={`> ${minAmount.toFixed(4)}`}
							error={+amount < minAmount}
							value={amount}
							onChange={(e) => setAmount(() => realParseFloat(e.target.value))}
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
						<TextField disabled value={removeZeros(destinationAmount)} />
					</SwapInput>
					<SwapNames pos="end">
						<Name color={theme.font.pure}>{destinationToken}</Name>
						<Name color={theme.font.default}>({destinationNetwork})</Name>
					</SwapNames>
				</Swap>
			</Trader>
			<ExchangeRate color={theme.font.pure}>
				{!isTokenSelected(destinationToken)
					? 'Please select token to see price'
					: `1 GLMR = ${removeZeros(currentPrice)} ${destinationToken}`}
			</ExchangeRate>
			<TextField
				value={destinationAddress}
				error={!destinationAddressIsValid}
				description="Destination Address"
				onChange={(e) =>
					dispatch({
						type: DestinationNetworkEnum.ADDRESS,
						payload: e.target.value
					})
				}
			/>
			{hasMemo && (
				<div style={{ marginTop: 24 }}>
					<TextField
						value={destinationMemo}
						error={!destinationMemoIsValid}
						description="Destination Memo"
						onChange={(e) =>
							dispatch({ type: DestinationNetworkEnum.MEMO, payload: e.target.value })
						}
					/>
				</div>
			)}
			{isUserVerified &&
				isNetworkSelected(destinationNetwork) &&
				isTokenSelected(destinationToken) && (
					<Fees
						amount={amount}
						token={destinationToken}
						network={destinationNetwork}
						address={destinationAddress}
					/>
				)}
			<SwapButton
				ref={swapButtonRef}
				hasMemo={hasMemo}
				amount={amount.toString()}
				onSubmit={handleSwap}
			/>
		</Wrapper>
	);
};
