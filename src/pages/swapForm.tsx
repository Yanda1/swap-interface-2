import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useEthers } from '@usedapp/core';
import destinationNetworks from '../data/destinationNetworks.json';
import { mediaQuery, spacing, MAIN_MAX_WIDTH } from '../styles';
import { ReactComponent as SwapperLight } from '../assets/swapper-light.svg';
import { ReactComponent as SwapperDark } from '../assets/swapper-dark.svg';
import sourceNetworks from '../../data/sourceNetworks.json';
import {
	AmountEnum,
	BINANCE_FEE,
	DestinationNetworkEnum,
	isLightTheme,
	isNetworkSelected,
	isTokenSelected,
	realParseFloat,
	beautifyNumbers,
	START_TOKEN,
	useStore
} from '../helpers';
import type { DestinationNetworks, Fee } from '../helpers';
import { useFees } from '../hooks';
import { IconButton, NetworkTokenModal, SwapButton, TextField, Fees } from '../components';

const Wrapper = styled.main`
	margin: 0 auto;
	max-width: ${MAIN_MAX_WIDTH};
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
`;

const NamesWrapper = styled.div(
	({ single = true }: { single?: boolean }) => css`
		display: flex;
		justify-content: ${single ? 'flex-start' : 'space-between'};

		&:nth-child(2) {
			margin-left: ${single ? 'auto' : '0'};
		}

		${mediaQuery('xs')} {
			&:nth-child(2) {
				margin-left: 0;
			}
		}
	`
);

const SwapNames = styled.div(
	({ pos = 'start', single = true }: { pos?: string; single?: boolean }) => css`
		display: flex;
		flex-direction: column;
		align-items: flex-${pos};

		${mediaQuery('xs')} {
			align-items: ${single ? 'flex-start' : `flex-${pos}`};
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

type Limit = { name: string; value: string; error: boolean };

export const SwapForm = () => {
	const {
		state: {
			theme,
			destinationNetwork,
			destinationToken,
			destinationAddress,
			destinationAmount,
			destinationMemo,
			isUserVerified,
			amount
		},
		dispatch
	} = useStore();
	const swapButtonRef = useRef();
	const { withdrawFee, cexFee, minAmount, maxAmount, getPrice } = useFees();
	const [showModal, setShowModal] = useState(false);
	const [hasMemo, setHasMemo] = useState(false);
	const [destinationAddressIsValid, setDestinationAddressIsValid] = useState(false);
	const [destinationMemoIsValid, setDestinationMemoIsValid] = useState(false);
	const [limit, setLimit] = useState<Limit>({ name: '', value: '', error: false });

	const openModal = () => setShowModal(!showModal);

	useEffect(() => {
		if (isTokenSelected(destinationToken)) {
			setLimit({
				name: +minAmount < +amount ? 'Max Amount' : 'Min Amount',
				value: minAmount && maxAmount ? (+minAmount < +amount ? maxAmount : minAmount) : '0',
				error: +amount < +minAmount || +amount > Number(maxAmount)
			});
		} else {
			setLimit({ name: '', value: '', error: false });
		}
	}, [destinationToken, amount]);

	useEffect(() => {
		if (isTokenSelected(destinationToken) && amount) {
			dispatch({
				type: DestinationNetworkEnum.AMOUNT,
				payload: realParseFloat(
					(
						(+amount / (1 + BINANCE_FEE)) * getPrice(START_TOKEN, destinationToken) -
						withdrawFee.amount -
						cexFee.reduce((total: number, fee: Fee) => (total += fee.amount), 0)
					).toString()
				)
			});
		}
	}, [amount, destinationToken]);

	useEffect(() => {
		const hasTag = destinationNetworks?.[destinationNetwork as DestinationNetworks]?.['hasTag'];
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

		setDestinationAddressIsValid(() => addressRegEx.test(destinationAddress));
		setDestinationMemoIsValid(() => memoRegEx.test(destinationMemo));
	}, [destinationAddress, destinationMemo, destinationToken]);

	const handleSwap = (): void => {
		// @ts-ignore
		swapButtonRef.current.onSubmit();
		dispatch({ type: DestinationNetworkEnum.ADDRESS, payload: '' });
		dispatch({ type: DestinationNetworkEnum.WALLET, payload: 'Select Wallet' });
		dispatch({ type: DestinationNetworkEnum.NETWORK, payload: 'Select Network' });
		dispatch({ type: DestinationNetworkEnum.TOKEN, payload: 'Select Token' });
		dispatch({ type: DestinationNetworkEnum.AMOUNT, payload: '' });
		dispatch({ type: DestinationNetworkEnum.MEMO, payload: '' });
		dispatch({ type: AmountEnum.AMOUNT, payload: '' });
	};

	const { chainId } = useEthers();
	const sourceNetwork =
		// @ts-ignore
		sourceNetworks[chainId]?.name;

	return (
		<Wrapper>
			<NetworkTokenModal showModal={showModal} setShowModal={setShowModal} />
			<Trader>
				<Swap>
					<SwapInput>
						<IconButton disabled icon="ETH" />
						<TextField
							type="number"
							placeholder="Amount"
							error={limit.error}
							value={amount}
							onChange={(e) =>
								dispatch({ type: AmountEnum.AMOUNT, payload: realParseFloat(e.target.value) })
							}
						/>
					</SwapInput>
					<NamesWrapper single={false}>
						<SwapNames>
							<Name color={theme.font.pure}>ETH</Name>
							<Name color={theme.font.default}>({sourceNetwork})</Name>
						</SwapNames>
						<SwapNames pos="end" single={false}>
							<Name color={limit.error ? theme.button.error : theme.font.pure}>{limit.name}</Name>
							<Name color={limit.error ? theme.button.error : theme.font.default}>
								{isTokenSelected(destinationToken) && beautifyNumbers({ n: limit.value })}
							</Name>
						</SwapNames>
					</NamesWrapper>
				</Swap>
				{isLightTheme(theme) ? (
					<SwapperLight style={{ marginBottom: 38 }} />
				) : (
					<SwapperDark style={{ marginBottom: 38 }} />
				)}
				<Swap>
					<SwapInput>
						<IconButton onClick={openModal} icon={destinationToken as any} />
						<TextField
							disabled
							type="number"
							value={beautifyNumbers({ n: destinationAmount })}
							error={Number(destinationAmount) < 0}
						/>
					</SwapInput>
					<NamesWrapper>
						<SwapNames pos="end">
							<Name color={theme.font.pure}>{destinationToken}</Name>
							<Name color={theme.font.default}>({destinationNetwork})</Name>
						</SwapNames>
					</NamesWrapper>
				</Swap>
			</Trader>
			<ExchangeRate color={theme.font.pure}>
				{!isTokenSelected(destinationToken)
					? 'Please select token to see price'
					: `1 ETH = ${beautifyNumbers({
							n: getPrice(START_TOKEN, destinationToken)
					  })} ${destinationToken}`}
			</ExchangeRate>
			<TextField
				value={destinationAddress}
				error={!destinationAddressIsValid}
				description="Destination Address"
				onChange={(e) =>
					dispatch({
						type: DestinationNetworkEnum.ADDRESS,
						payload: e.target.value.trim()
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
							dispatch({ type: DestinationNetworkEnum.MEMO, payload: e.target.value.trim() })
						}
					/>
				</div>
			)}
			{isUserVerified && <Fees />}
			{isUserVerified && (
				<SwapButton
					ref={swapButtonRef}
					validInputs={destinationMemoIsValid && destinationAddressIsValid && !limit.error}
					amount={amount.toString()}
					onClick={handleSwap}
				/>
			)}
		</Wrapper>
	);
};
