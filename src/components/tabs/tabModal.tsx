import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Tabs } from './tabs';
import { pxToRem } from '../../styles';
import { CONTRACT_ADDRESSES, ContractAdress, SERVICE_ADDRESS, useStore } from '../../helpers';
import { useLocalStorage } from '../../hooks';
import { useEthers, useSendTransaction } from '@usedapp/core';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import CONTRACT_DATA from '../../data/YandaExtendedProtocol.json';
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
		state: { productId, pair, isUserVerified }
	} = useStore();
	const [swapsStorage, setSwapsStorage] = useLocalStorage<Props[]>('swaps', []);

	const { account } = useEthers();
	const { chainId, library: web3Provider } = useEthers();
	const { sendTransaction } = useSendTransaction({
		transactionName: 'Deposit'
	});
	const contractAddress = CONTRACT_ADDRESSES?.[chainId as ContractAdress] || '';
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const contract = new Contract(contractAddress, contractInterface, web3Provider);

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
				contract.on(
					contract.filters.CostRequest(account, SERVICE_ADDRESS, swap.productId),
					(account, service, localProductId, amount, event) => {
						console.log('---COST REQUEST EVENT---', event);
						swap.costRequestCounter += 1;
						swapsCopy[index] = swap;

						setSwapsStorage(swapsCopy);
					}
				);
			}
			if (!swap.depositBlock) {
				contract.on(
					contract.filters.Deposit(account, SERVICE_ADDRESS, swap.productId),
					(customer, service, localProductId, amount, event) => {
						console.log('SWAPS CONTRACT', event);
						swap.depositBlock = event.blockNumber;
						swapsCopy[index] = swap;

						setSwapsStorage(swapsCopy);
					}
				);
			}
			if (!swap.action.length || !swap.withdraw.length) {
				contract.on(
					contract.filters.Action(account, SERVICE_ADDRESS, swap.productId),
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
				contract.on(
					contract.filters.Complete(account, SERVICE_ADDRESS, swap.productId),
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
		swapsStorage.map((swap) => {
			if ((!swap.depositBlock && !swap.costRequestCounter) || swap.costRequestCounter > 1) {
				const filter = contract.filters.CostResponse(account, SERVICE_ADDRESS, swap.productId);
				console.log('filter', filter);
				if (!isDepositing) {
					setIsDepositing(true);
					contract.on(filter, (customer, service, productId, cost, event) => {
						console.log('---COST RESPONSE EVENT---', event);
						console.log('Oracle deposit estimation:', utils.formatEther(cost));
						void sendTransaction({ to: contractAddress, value: cost });
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
