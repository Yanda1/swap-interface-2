import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import DESTINATION_NETWORKS from '../data/destinationNetworks.json';
import { mediaQuery, spacing, MAIN_MAX_WIDTH } from '../styles';
import {
	Icon,
	NetworkTokenModal,
	SwapButton,
	TextField,
	Fees,
	NotificationsModal,
	IconType
} from '../components';
import {
	AmountEnum,
	BINANCE_FEE,
	DestinationEnum,
	isLightTheme,
	isNetworkSelected,
	isTokenSelected,
	beautifyNumbers,
	useStore,
	NETWORK_TO_ID
} from '../helpers';
import type { Fee } from '../helpers';
import { useFees, useMedia } from '../hooks';

const Wrapper = styled.main`
	margin: 0 auto;
	max-width: ${MAIN_MAX_WIDTH};
`;

// const Settings = styled.div`
// 	display: flex;
// 	justify-content: flex-end;
// 	margin-bottom: ${spacing[16]};

// 	& button {
// 		all: unset;
// 		cursor: pointer;

// 		&:hover {
// 			opacity: 0.8;
// 		}

// 		&:focus-visible {
// 			outline-offset: ${DEFAULT_OUTLINE_OFFSET};
// 			outline: ${(props: ThemeProps) => DEFAULT_OUTLINE(props.theme)};
// 		}

// 		&:active {
// 			outline: none;
// 		}
// 	}
// `;

const Trader = styled.div`
	display: flex;
	gap: ${spacing[10]};
	align-items: stretch;

	${mediaQuery('xs')} {
		flex-direction: column;
		align-items: center;
	}
`;

const Swap = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: ${spacing[4]};

	${mediaQuery('xs')} {
		width: 100%;
	}
`;

const SwapInput = styled.div`
	display: flex;
	gap: ${spacing[8]};
`;

const NamesWrapper = styled.div(
	() => css`
		display: flex;
		flex-direction: column;
		gap: ${spacing[4]};

		& div {
			display: flex;
			gap: ${spacing[4]};
		}
	`
);

const Names = styled.div(
	({ justifyContent }: { justifyContent: 'space-between' | 'flex-end' | 'flex-start' }) => css`
		justify-content: ${justifyContent};

		${mediaQuery('xs')} {
			justify-content: ${justifyContent === 'space-between' ? 'space-between' : 'flex-start'};
		}
	`
);

const Name = styled.div(
	({ color }: { color: string }) => css`
		color: ${color};
	`
);

const MaxButton = styled.button(
	({ color }: { color: string }) => css`
		all: unset;
		cursor: pointer;
		color: ${color};

		&:hover {
			opacity: 0.8;
		}
	`
);

const ExchangeRate = styled.div(
	({ color }: { color: string }) => `
	margin: ${spacing[28]} 0;
	color: ${color};

	${mediaQuery('xs')} {
	text-align: center;
	}
`
);

type Limit = { message: string; value: string; error: boolean };

export const SwapForm = () => {
	const {
		state: {
			theme,
			sourceNetwork,
			sourceToken,
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
	const [showDestinationModal, setShowDestinationModal] = useState(false);
	const [showNotificaitonsModal, setShowNotificaitonsModal] = useState(false);
	const [showSourceModal, setShowSourceModal] = useState(false);
	const [hasMemo, setHasMemo] = useState(false);
	const [destinationAddressIsValid, setDestinationAddressIsValid] = useState(false);
	const [destinationMemoIsValid, setDestinationMemoIsValid] = useState(false);
	const [limit, setLimit] = useState<Limit>({ message: '', value: '', error: false });

	const { mobileWidth } = useMedia('xs');

	useEffect(() => {
		if (isTokenSelected(destinationToken)) {
			const message =
				+minAmount >= +maxAmount
					? 'Insufficent funds'
					: +minAmount < +amount
					? 'Max Amount'
					: 'Min Amount';
			const value = +minAmount >= +maxAmount ? '' : +minAmount < +amount ? maxAmount : minAmount;
			setLimit({
				message,
				value,
				error: +amount < +minAmount || +amount > +maxAmount || +minAmount >= +maxAmount
			});
		} else {
			setLimit({ message: '', value: '', error: false });
		}
	}, [destinationToken, amount, minAmount, maxAmount]);

	useEffect(() => {
		if (isTokenSelected(destinationToken)) {
			const calculatedDestinationAmount =
				(+amount / (1 + BINANCE_FEE)) * getPrice(sourceToken, destinationToken) -
				withdrawFee.amount -
				cexFee.reduce((total: number, fee: Fee) => (total += fee.amount), 0);
			dispatch({
				type: DestinationEnum.AMOUNT,
				payload: calculatedDestinationAmount < 0 ? '' : calculatedDestinationAmount.toString()
			});
		}
	}, [amount, destinationToken, cexFee, withdrawFee]);

	useEffect(() => {
		const hasTag =
			// @ts-ignore
			DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
				'hasTag'
			];
		setHasMemo(!isNetworkSelected(destinationNetwork) ? false : hasTag);
	}, [sourceToken, destinationNetwork, sourceNetwork]);

	useEffect(() => {
		const addressRegEx = new RegExp(
			// @ts-ignore,
			DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
				'tokens'
			]?.[destinationToken]?.['addressRegex']
		);
		const memoRegEx = new RegExp(
			// @ts-ignore
			DESTINATION_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.[sourceToken]?.[destinationNetwork]?.[
				'tokens'
			]?.[destinationToken]?.['tagRegex']
		);

		setDestinationAddressIsValid(() => addressRegEx.test(destinationAddress));
		setDestinationMemoIsValid(() => memoRegEx.test(destinationMemo));
	}, [destinationAddress, destinationMemo, destinationToken]);

	const handleSwap = (): void => {
		// @ts-ignore
		swapButtonRef.current.onSubmit();
	};

	return (
		<Wrapper>
			<NetworkTokenModal
				showModal={showSourceModal}
				setShowModal={setShowSourceModal}
				type="SOURCE"
			/>
			<NetworkTokenModal
				showModal={showDestinationModal}
				setShowModal={setShowDestinationModal}
				type="DESTINATION"
			/>
			<NotificationsModal
				showModal={showNotificaitonsModal}
				setShowModal={setShowNotificaitonsModal}
			/>
			{/* {!mobileWidth && (
				<Settings theme={theme}>
					<Icon
						size="small"
						icon={isLightTheme(theme) ? 'settingsDark' : 'settingsLight'}
						onClick={() => setShowNotificaitonsModal(!showNotificaitonsModal)}
					/>
				</Settings>
			)} */}
			<Trader>
				<Swap>
					<SwapInput>
						<Icon
							size="large"
							icon={sourceToken.toLowerCase() as IconType}
							onClick={() => setShowSourceModal(!showSourceModal)}
						/>
						<TextField
							type="number"
							placeholder="Amount"
							error={limit.error}
							value={amount}
							onChange={(e) => {
								dispatch({ type: AmountEnum.AMOUNT, payload: e.target.value });
							}}
						/>
					</SwapInput>
					<NamesWrapper>
						{+maxAmount > 0 && (
							<Names justifyContent="space-between">
								<Name color={theme.font.default}>
									Balance: {beautifyNumbers({ n: maxAmount ?? '0.0', digits: 3 })} {sourceToken}
								</Name>
								<MaxButton
									color={theme.button.error}
									onClick={() => dispatch({ type: AmountEnum.AMOUNT, payload: maxAmount })}>
									Max
								</MaxButton>
							</Names>
						)}
						<Names justifyContent="flex-start">
							<Name color={theme.font.default}>{sourceToken}</Name>
							<Name color={theme.font.secondary}>({sourceNetwork})</Name>
						</Names>
					</NamesWrapper>
				</Swap>
				<Icon
					size="small"
					icon={isLightTheme(theme) ? 'swapperLight' : 'swapperDark'}
					style={mobileWidth ? { marginBottom: 18 } : { alignSelf: 'flex-start', marginTop: 18 }}
				/>
				<Swap>
					<SwapInput>
						<Icon
							size="large"
							icon={
								isTokenSelected(destinationToken)
									? (destinationToken.toLowerCase() as IconType)
									: 'questionMark'
							}
							onClick={() => setShowDestinationModal(!showDestinationModal)}
						/>
						<TextField
							disabled
							type="text"
							value={beautifyNumbers({ n: destinationAmount })}
							error={+destinationAmount < 0}
						/>
					</SwapInput>
					<NamesWrapper>
						<Names justifyContent="flex-end">
							<Name color={theme.font.default}>{destinationToken}</Name>
							<Name color={theme.font.secondary}>({destinationNetwork})</Name>
						</Names>
					</NamesWrapper>
				</Swap>
			</Trader>
			<ExchangeRate color={theme.font.default}>
				{!isTokenSelected(destinationToken)
					? 'Please select token to see price'
					: `1 ${sourceToken} = ${beautifyNumbers({
							n: getPrice(sourceToken, destinationToken)
					  })} ${destinationToken}`}
			</ExchangeRate>
			<TextField
				value={destinationAddress}
				error={!destinationAddressIsValid}
				description="Destination Address"
				onChange={(e) =>
					dispatch({
						type: DestinationEnum.ADDRESS,
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
							dispatch({ type: DestinationEnum.MEMO, payload: e.target.value.trim() })
						}
					/>
				</div>
			)}
			{isUserVerified &&
				isNetworkSelected(destinationNetwork) &&
				isTokenSelected(destinationToken) && <Fees />}
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
