import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Tabs } from './tabs';
import { pxToRem } from '../../styles';
import {
	CONTRACT_ADDRESSES,
	ContractAdress,
	SERVICE_ADDRESS,
	useLocalStorage,
	useStore
} from '../../helpers';
import { useEthers } from '@usedapp/core';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import CONTRACT_DATA from '../../data/YandaExtendedProtocol.json';

const Wrapper = styled.div`
	max-width: 100%;
	margin: ${pxToRem(76)} auto;
`;

const Paragraph = styled.p`
	color: #b4b4b4;
`;
type Props = {
	productId: string;
	costRequestCounter: number;
	depositBlock: number;
	action: object[];
	withdraw: object[];
	complete: boolean;
	pair: string;
};

export const TabModal = () => {
	const [swaps, setSwaps] = useState<Props[]>([]);
	const {
		state: { productId, destinationToken }
	} = useStore();
	const [swapsStorage, setSwapsStorage] = useLocalStorage<object[]>('swaps', []);

	const { account } = useEthers();
	const { chainId, library: web3Provider } = useEthers();
	const contractAddress = CONTRACT_ADDRESSES?.[chainId as ContractAdress] || '';
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const contract = new Contract(contractAddress, contractInterface, web3Provider);

	useEffect(() => {
		const filteredSwaps: object[] = swapsStorage.filter((swap: any) => !swap.complete);
		// @ts-ignore
		setSwaps(filteredSwaps);
		setSwapsStorage(filteredSwaps);
	}, []);

	useEffect(() => {
		if (productId) {
			const order = {
				productId,
				costRequestCounter: 0,
				depositBlock: 0,
				action: [],
				withdraw: [],
				complete: false,
				pair: `GLMR ${destinationToken}`
			};
			const updatedSwaps: any = [...swapsStorage, order];
			setSwaps(updatedSwaps);
			setSwapsStorage(updatedSwaps);
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
			// Delete completed swap
			if (swap.complete || swap.complete === null) {
				const newSwapsCopy = [...swapsCopy];
				newSwapsCopy.splice(index, 1);
				setSwapsStorage(newSwapsCopy);
			}
		});
	};

	useEffect(() => {
		subscribeSwap();
	}, [swaps]);

	return (
		<Wrapper>
			{swaps.length > 0 && (
				<>
					<Paragraph>Pending Swaps ({swaps.length})</Paragraph>
					<Tabs data={swaps} />
				</>
			)}
		</Wrapper>
	);
};
