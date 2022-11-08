import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Tabs } from '../../components';
import { pxToRem } from '../../styles';
import { CONTRACT_ADDRESSES, ContractAdress, SERVICE_ADDRESS, useStore } from '../../helpers';
import { useLocalStorage } from '../../hooks';
import { useEthers, useSendTransaction, useContractFunction, ERC20Interface } from '@usedapp/core';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import SOURCE_NETWORKS from '../../data/sourceNetworks.json';
import CONTRACT_DATA from '../../data/YandaMultitokenProtocolV1.json';
import _ from 'lodash';

const Wrapper = styled.div`
	max-width: 100%;
	margin: ${pxToRem(76)} auto;
`;

const Paragraph = styled.p`
	color: #b4b4b4;
`;
type Props = {
	productId: string;
	account: string;
	costRequestCounter: number;
	depositBlock: number;
	action: object[];
	withdraw: object[];
	complete: boolean;
	pair: string;
};

export const TabModal = () => {
	const [isDepositing, setIsDepositing] = useState(false);
	const [swaps, setSwaps] = useState<Props[]>([]);
	const {
		state: { productId, pair, isUserVerified, sourceToken }
	} = useStore();
	const [swapsStorage, setSwapsStorage] = useLocalStorage<Props[]>('swaps', []);

	const { account } = useEthers();
	const { chainId, library: web3Provider } = useEthers();
	const protocolAddress = CONTRACT_ADDRESSES?.[chainId as ContractAdress] || '';
	const protocolInterface = new utils.Interface(CONTRACT_DATA.abi);
	const protocol = new Contract(protocolAddress, protocolInterface, web3Provider);

	const sourceTokenData =
		// @ts-ignore
		// eslint-disable-next-line
		SOURCE_NETWORKS['1']['tokens'][sourceToken];
	const tokenContract =
		sourceTokenData?.contractAddr &&
		new Contract(sourceTokenData?.contractAddr, ERC20Interface, web3Provider);
	if (web3Provider) {
		protocol.connect(web3Provider.getSigner());
		if (tokenContract) {
			tokenContract.connect(web3Provider.getSigner());
		}
	}

	const { send: sendTokenApprove } = useContractFunction(tokenContract, 'approve', {
		transactionName: 'Approve token to be used for Swap'
	});
	const { sendTransaction } = useSendTransaction({
		transactionName: 'Deposit'
	});
	const { send: sendDeposit } = useContractFunction(
		// @ts-ignore
		protocol,
		'deposit',
		{ transactionName: 'deposit' }
	);

	useEffect(() => {
		const filteredSwaps: Props[] = swapsStorage.filter((swap: any) => !swap.complete);
		setSwaps(filteredSwaps);
		setSwapsStorage(filteredSwaps);
	}, []);

	useEffect(() => {
		if (productId && account) {
			const order = {
				productId,
				account,
				costRequestCounter: 0,
				depositBlock: 0,
				action: [],
				withdraw: [],
				complete: false,
				pair
			};
			const uniqueSwaps: Props[] = _.uniqBy([...swapsStorage, order], 'productId');
			setSwaps(uniqueSwaps);
			setSwapsStorage(uniqueSwaps);
		}
	}, [productId]);

	const subscribeSwap = () => {
		const swapsCopy: any = [...swaps];
		swaps.map((swap: Props, index: number) => {
			if (swap.costRequestCounter < 2) {
				protocol.on(
					protocol.filters.CostRequest(account, SERVICE_ADDRESS, swap.productId),
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
					protocol.filters.Deposit(account, SERVICE_ADDRESS, swap.productId),
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
					protocol.filters.Action(account, SERVICE_ADDRESS, swap.productId),
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
					protocol.filters.Complete(account, SERVICE_ADDRESS, swap.productId),
					(customer, service, localProductId, amount, event) => {
						console.log('---COMPLETE EVENT---', event);
						swap.complete = event.args.success;
						swapsCopy[index] = swap;

						setSwapsStorage(swapsCopy);
					}
				);
			}
			// Deleting completed swaps (successful and unsuccessful)
			if (swap.complete || swap.complete === null) {
				const newSwapsCopy = [...swapsCopy];
				swapsStorage.splice(index, 1);
				setSwapsStorage(newSwapsCopy);
			}
		});
	};

	useEffect(() => {
		subscribeSwap();
	}, [swaps]);

	useEffect(() => {
		swapsStorage.map((swap: any) => {
			if ((!swap.depositBlock && !swap.costRequestCounter) || swap.costRequestCounter > 1) {
				const filter = protocol.filters.CostResponse(account, SERVICE_ADDRESS, swap.productId);
				console.log('filter', filter);
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
							void sendTransaction({ to: protocolAddress, value: cost });
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

									void sendDeposit(cost);
								})
								.catch((error: any) => {
									console.log('Error in sending approve', error);
								});
						}
					});
				}
			}
		});
	}, [swapsStorage]);

	return isUserVerified ? (
		<Wrapper>
			{swaps.length > 0 && (
				<>
					<Paragraph>Pending Swaps ({swaps.length})</Paragraph>
					<Tabs data={swaps} />
				</>
			)}
		</Wrapper>
	) : null;
};
