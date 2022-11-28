import { ERC20Interface, useContractFunction, useEthers, useSendTransaction } from '@usedapp/core';
import {
	CONTRACT_ADDRESSES,
	ContractAdress,
	isNetworkSelected,
	isSwapRejected,
	isTokenSelected,
	NETWORK_TO_ID,
	SERVICE_ADDRESS,
	useStore
} from '../../helpers';
import { providers, utils } from 'ethers';
import CONTRACT_DATA from '../../data/YandaMultitokenProtocolV1.json';
import { Contract } from '@ethersproject/contracts';
import { useEffect, useMemo, useState } from 'react';
import SOURCE_NETWORKS from '../../data/sourceNetworks.json';
import { useLocalStorage } from '../../hooks';
import { TabsNew } from './tabsNew';

type Props = {
	swapProductId: string;
	account: string;
	costRequestCounter: number;
	depositBlock: number;
	action: object[];
	withdraw: object[];
	complete: null | boolean;
	pair: string;
	sourceToken: string;
};

export const TabWrapper = ({ swap }: any) => {
	const [swapsStorage, setSwapsStorage] = useLocalStorage<Props[]>('swaps', []);
	const [isDepositing, setIsDepositing] = useState(false);
	// const { account } = useEthers();
	const {
		state: { sourceNetwork, sourceToken }
	} = useStore();
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
	if (web3Provider && !(web3Provider instanceof providers.FallbackProvider)) {
		protocol.connect(web3Provider.getSigner());
		if (tokenContract) {
			tokenContract.connect(web3Provider.getSigner());
		}
	}

	const { send: sendTokenApprove, state: swapStateApprove } = useContractFunction(
		tokenContract,
		'approve',
		{
			transactionName: 'Approve token to be used for Swap',
			gasLimitBufferPercentage: 10
		}
	);
	const { sendTransaction, state: swapState } = useSendTransaction({
		transactionName: 'Deposit',
		gasLimitBufferPercentage: 10
	});
	const { send: sendDeposit, state: swapStateContract } = useContractFunction(
		// @ts-ignore
		protocol,
		'deposit',
		{
			transactionName: 'Deposit',
			gasLimitBufferPercentage: 25
		}
	);

	// DELETE SWAP IF DEPOSIT PROCESS WAS REJECTED BY USER
	useEffect(() => {
		if (
			isSwapRejected(swapState.status, swapState.errorMessage) ||
			isSwapRejected(swapStateContract.status, swapStateContract.errorMessage) ||
			isSwapRejected(swapStateApprove.status, swapStateApprove.errorMessage)
		) {
			const swapsCopy: Props[] = [...swapsStorage];
			const index: number = swapsStorage.findIndex(
				(el: Props) => el.swapProductId === swap.swapProductId
			);
			swapsCopy.splice(index, 1);
			setSwapsStorage(swapsCopy);
		}
	}, [swapState, swapStateContract, swapStateApprove]);

	// UseEffect with logic for deposit (2 modal in MetaMask)
	useEffect(() => {
		setIsDepositing(false);
		if (swap) {
			if (swap.sourceToken === sourceToken) {
				if ((!swap.depositBlock && !swap.costRequestCounter) || swap.costRequestCounter > 1) {
					const filter = protocol.filters.CostResponse(
						swap.account,
						SERVICE_ADDRESS,
						swap.swapProductId
					);
					if (!isDepositing) {
						setIsDepositing(true);
						protocol.on(filter, (customer, service, productId, cost, event) => {
							console.log(
								'Oracle deposit estimation:',
								event,
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
						const index = swapsStorage.findIndex((el) => el.swapProductId === swap.swapProductId);
						swapsCopy.splice(index, 1);
						setSwapsStorage(swapsCopy);
					}
				}
			}
		}
	}, [swap]);

	// Trigger function event listener
	useEffect(() => {
		eventListener(swap);
	}, [swap]);

	// Function event listener
	const eventListener = (swap: Props) => {
		if (swap) {
			if (swap.sourceToken === sourceToken) {
				const swapsCopy = [...swapsStorage];
				const findSwap: any = swapsStorage.find(
					(item: Props) => item.swapProductId === swap.swapProductId
				);
				const index: number = swapsCopy.indexOf(findSwap);

				if (swap.costRequestCounter < 2) {
					protocol.on(
						protocol.filters.CostRequest(swap.account, SERVICE_ADDRESS, swap.swapProductId),
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
						protocol.filters.Deposit(swap.account, SERVICE_ADDRESS, swap.swapProductId),
						(customer, service, localProductId, amount, event) => {
							console.log('DEPOSIT EVENT', event);
							swap.depositBlock = event.blockNumber;
							swapsCopy[index] = swap;
							setSwapsStorage(swapsCopy);
						}
					);
				}

				if (!swap.action.length || !swap.withdraw.length) {
					protocol.on(
						protocol.filters.Action(swap.account, SERVICE_ADDRESS, swap.swapProductId),
						(customer, service, localProductId, data, event) => {
							console.log('---Action EVENT---', event);
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

				if (!swap.complete && swap.complete === null) {
					protocol.on(
						protocol.filters.Complete(swap.account, SERVICE_ADDRESS, swap.swapProductId),
						(customer, service, localProductId, amount, event) => {
							console.log('---COMPLETE EVENT---', event);
							swap.complete = event.args.success;
							swapsCopy[index] = swap;

							setSwapsStorage(swapsCopy);
						}
					);
				}
				if (swap.complete || (!swap.complete && swap.complete !== null)) {
					swapsCopy.splice(index, 1);
					setSwapsStorage(swapsCopy);
				}
			}
		}
	};

	return <TabsNew swap={swap} />;
};
