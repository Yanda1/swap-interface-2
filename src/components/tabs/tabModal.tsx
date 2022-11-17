import { useEffect, useMemo, useState } from 'react';
import styled, {css} from 'styled-components';
import { Tabs } from '../../components';
import { pxToRem } from '../../styles';
import type { Theme } from '../../styles';
import {
	CONTRACT_ADDRESSES,
	ContractAdress,
	isNetworkSelected,
	isTokenSelected,
	NETWORK_TO_ID,
	SERVICE_ADDRESS,
	useStore
} from '../../helpers';
import { useLocalStorage } from '../../hooks';
import { ERC20Interface, useContractFunction, useEthers, useSendTransaction } from '@usedapp/core';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import SOURCE_NETWORKS from '../../data/sourceNetworks.json';
import CONTRACT_DATA from '../../data/YandaMultitokenProtocolV1.json';
import _ from 'lodash';

const Wrapper = styled.div`
	max-width: 100%;
	margin: ${pxToRem(76)} auto;
`;

const Paragraph = styled.p(
	() => css`
		color: ${(props: { theme: Theme }) => props.theme.font.default};
	`
);

type Props = {
	productId: string;
	account: string;
	costRequestCounter: number;
	depositBlock: number;
	action: object[];
	withdraw: object[];
	complete: null | boolean;
	pair: string;
	sourceToken: string;
};

export const TabModal = () => {
	const [isDepositing, setIsDepositing] = useState(false);
	const [swaps, setSwaps] = useState<Props[]>([]);
	const {
		state: { productId, pair, isUserVerified, sourceNetwork, sourceToken, theme }
	} = useStore();
	const [swapsStorage, setSwapsStorage] = useLocalStorage<Props[]>('swaps', []);

	const { account } = useEthers();
	const { chainId, library: web3Provider } = useEthers();
	const protocolAddress = CONTRACT_ADDRESSES?.[chainId as ContractAdress] || '';
	const protocolInterface = new utils.Interface(CONTRACT_DATA.abi);
	const protocol = new Contract(protocolAddress, protocolInterface, web3Provider);

	const sourceTokenData = useMemo(
		() =>
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			isNetworkSelected(sourceNetwork) && isTokenSelected(sourceToken)
				? // @ts-ignore
				  SOURCE_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.['tokens'][sourceToken]
				: [],
		[sourceToken, sourceNetwork]
	);

	const tokenContract =
		sourceTokenData?.contractAddr &&
		new Contract(sourceTokenData?.contractAddr, ERC20Interface, web3Provider);
	if (web3Provider) {
		protocol.connect(web3Provider.getSigner());
		if (tokenContract) {
			tokenContract.connect(web3Provider.getSigner());
		}
	}

	const { send: sendTokenApprove, state: transactionStateApproveContract } = useContractFunction(
		tokenContract,
		'approve',
		{
			transactionName: 'Approve token to be used for Swap',
			gasLimitBufferPercentage: 10
		}
	);
	const { sendTransaction, state: transactionState } = useSendTransaction({
		transactionName: 'Deposit',
		gasLimitBufferPercentage: 10
	});
	const { send: sendDeposit, state: transactionStateContract } = useContractFunction(
		// @ts-ignore
		protocol,
		'deposit',
		{
			transactionName: 'Deposit',
			gasLimitBufferPercentage: 25
		}
	);

	// ADD NEW SWAP TO LOCAL STORAGE AND STATE
	useEffect(() => {
		if (productId && account) {
			const order = {
				productId,
				account,
				costRequestCounter: 0,
				depositBlock: 0,
				action: [],
				withdraw: [],
				complete: null,
				pair,
				sourceToken
			};
			const filteredSwaps: Props[] = swapsStorage.filter((swap: Props) => swap.complete === null);
			const uniqueSwaps: Props[] = _.uniqBy([...filteredSwaps, order], 'productId');
			setSwaps(uniqueSwaps);
			setSwapsStorage(uniqueSwaps);
		}
	}, [productId]);

	// Function with event listeners
	const subscribeSwap = () => {
		const swapsCopy: Props[] = [...swaps];
		if (swaps.length > 0) {
			swaps.map((swap: Props, index: number) => {
				if (swap.sourceToken === sourceToken) {
					if (swap.costRequestCounter < 2) {
						protocol.on(
							protocol.filters.CostRequest(swap.account, SERVICE_ADDRESS, swap.productId),
							(account, service, localProductId, amount, event) => {
								console.log('---COST REQUEST EVENT---', event);
								swap.costRequestCounter += 1;
								swapsCopy[index] = swap;

								setSwapsStorage(swapsCopy);
							}
						);
					}
					if (!swap.depositBlock) {
						protocol.on(
							protocol.filters.Deposit(swap.account, SERVICE_ADDRESS, swap.productId),
							(customer, service, localProductId, amount, event) => {
								console.log('SWAPS CONTRACT', event);
								swap.depositBlock = event.blockNumber;
								swapsCopy[index] = swap;

								setSwapsStorage(swapsCopy);
							}
						);
					}
					if (!swap.action.length || !swap.withdraw.length) {
						protocol.on(
							protocol.filters.Action(swap.account, SERVICE_ADDRESS, swap.productId),
							(customer, service, localProductId, data, event) => {
								console.log('---ORDER EVENT---', event);
								const parsedData = JSON.parse(event.args?.data);

								if (parsedData.t === 0) {
									swap.action = [parsedData];
									swapsCopy[index] = swap;

									setSwapsStorage(swapsCopy);
								} else {
									swap.withdraw = [parsedData];
									swapsCopy[index] = swap;

									setSwapsStorage(swapsCopy);
								}
							}
						);
					}
					if (!swap.complete) {
						protocol.on(
							protocol.filters.Complete(swap.account, SERVICE_ADDRESS, swap.productId),
							(customer, service, localProductId, amount, event) => {
								console.log('---COMPLETE EVENT---', event);
								swap.complete = event.args.success;
								swapsCopy[index] = swap;

								setSwapsStorage(swapsCopy);
							}
						);
					}
					// Deleting completed swaps (successful and unsuccessful)
					if (swap.complete || (!swap.complete && swap.complete !== null)) {
						const newSwapsCopy = [...swapsCopy];
						swapsStorage.splice(index, 1);
						setSwapsStorage(newSwapsCopy);
					}
				}
			});
		}
	};

	// UseEffect with logic for deposit (2 modal in MetaMask)
	useEffect(() => {
		setIsDepositing(false);
		if (swapsStorage.length > 0) {
			swapsStorage.map((swap: Props) => {
				if (swap.sourceToken === sourceToken) {
					if ((!swap.depositBlock && !swap.costRequestCounter) || swap.costRequestCounter > 1) {
						const filter = protocol.filters.CostResponse(
							swap.account,
							SERVICE_ADDRESS,
							swap.productId
						);
						if (!isDepositing) {
							setIsDepositing(true);
							protocol.on(filter, (customer, service, productId, cost, event) => {
								console.log('---COST RESPONSE EVENT---', event);
								console.log(
									'Oracle deposit estimation:',
									utils.formatUnits(cost, sourceTokenData?.decimals)
								);

								if (sourceTokenData?.isNative) {
									console.log('sendTransaction for the Native Coin');
									void sendTransaction({ to: protocolAddress, value: cost }).then(() =>
										setIsDepositing(false)
									);
								} else {
									console.log('sendTokenApprove for the Token');
									sendTokenApprove(protocolAddress, cost)
										.then((result) => {
											console.log(
												'Approved ',
												utils.formatUnits(cost, sourceTokenData?.decimals),
												' tokens of "',
												protocolAddress,
												'" contract.',
												result
											);

											void sendDeposit(cost).then(() => setIsDepositing(false));
										})
										.catch((error: any) => {
											console.log('Error in sending approve', error);
										});
								}
							});
						} else {
							setIsDepositing(false);
							const swapsCopy: Props[] = [...swapsStorage];
							swapsCopy.splice(swapsCopy.length - 2, 1);
							setSwapsStorage(swapsCopy);
							setSwaps(swapsCopy);
						}
					}
				}
			});
		}
	}, [swapsStorage.length, sourceToken]);

	// Remove last swap if the user cancels it (with native or non-native token)
	useEffect(() => {
		if (
			(transactionState.status === 'Exception' &&
				transactionState.errorMessage === 'user rejected transaction') ||
			(transactionStateContract.status === 'Exception' &&
				transactionStateContract.errorMessage === 'user rejected transaction') ||
			(transactionStateApproveContract.status === 'Exception' &&
				transactionStateApproveContract.errorMessage === 'user rejected transaction')
		) {
			const swapsCopy: Props[] = [...swapsStorage];
			swapsCopy.splice(swapsCopy.length - 1, 1);
			setSwapsStorage(swapsCopy);
			setSwaps(swapsCopy);
		}
	}, [transactionState, transactionStateContract, transactionStateApproveContract]);

	useEffect(() => {
		subscribeSwap();
	}, [swaps, sourceToken]);

	// SHOW SWAPS THAT RELATING TO OPEN ACCOUNT AT THIS MOMENT
	const [accountSwaps, setAccountSwaps] = useState<Props[]>([]);
	useEffect(() => {
		if (account) {
			const accountSwaps: Props[] = swaps.filter((swap: Props) => swap.account === account);
			setAccountSwaps(accountSwaps);
		}
	}, [swaps, account]);

	return isUserVerified ? (
		<Wrapper>
			{swaps.length > 0 && (
				<>
					<Paragraph theme={theme}>Pending Swaps ({swaps.length})</Paragraph>
					<Tabs data={accountSwaps} />
				</>
			)}
		</Wrapper>
	) : null;
};
