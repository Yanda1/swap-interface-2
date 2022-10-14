import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { utils } from 'ethers';
import { Tabs } from './tabs';
import { pxToRem } from '../../styles';
import { Contract } from '@ethersproject/contracts';
import { CONTRACT_ADDRESSES, ContractAdress, SERVICE_ADDRESS } from '../../helpers';
import CONTRACT_DATA from '../../data/YandaExtendedProtocol.json';

const Wrapper = styled.div`
	max-width: 100%;
	margin: ${pxToRem(76)} auto;
`;

const Paragraph = styled.p`
	color: #b4b4b4;
`;

export const TabModal = () => {
	const { account } = useEthers();
	const { chainId, library: web3Provider } = useEthers();
	const contractAddress = CONTRACT_ADDRESSES?.[chainId as ContractAdress] || '';
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const contract = new Contract(contractAddress, contractInterface, web3Provider);
	const product: any = localStorage.getItem('product');
	const productId = JSON.parse(product);
	// const namedValues = localStorage.getItem('namedValues');

	const [eventsData, setEventsData] = useState<
		{
			productId: number;
			costRequestCounter: number;
			depositBlock: number;
			action: object[];
			withdraw: boolean;
			complete: boolean;
		}[]
	>([
		{
			productId: 1,
			costRequestCounter: 0,
			depositBlock: 0,
			action: [],
			withdraw: false,
			complete: false
		}
	]);

	useEffect(() => {
		const eventsDataCopy = [...eventsData];
		const eventDataIndex = eventsDataCopy.findIndex(
			(event: {
				productId: number;
				costRequestCounter: number;
				depositBlock: number;
				action: object[];
				withdraw: boolean;
				complete: boolean;
			}) => event.productId === 1
		);
		const swap = eventsDataCopy[eventDataIndex];
		if (swap) {
			if (swap.costRequestCounter < 2) {
				contract.on(
					contract.filters.CostRequest(account, SERVICE_ADDRESS, productId),
					(account, service, localProductId, amount, event) => {
						console.log('---COST REQUEST EVENT---', event);
						swap.costRequestCounter += 1;
					}
				);
				eventsDataCopy[eventDataIndex] = swap;
				setEventsData(eventsDataCopy);
			}

			if (swap.depositBlock === 0) {
				contract.on(
					contract.filters.Deposit(account, SERVICE_ADDRESS, productId),
					(customer, service, localProductId, amount, event) => {
						console.log('---DEPOSIT EVENT---', event);
						swap.depositBlock = event.blockNumber;
					}
				);
				eventsDataCopy[eventDataIndex] = swap;
				setEventsData(eventsDataCopy);
			}

			if (!swap.withdraw) {
				contract.on(
					contract.filters.Action(account, SERVICE_ADDRESS, productId),
					(customer, service, localProductId, data, event) => {
						console.log('---ORDER EVENT---', event);
						const parsedData = JSON.parse(event.args?.data);
						if (parsedData.t === 0) {
							// @ts-ignore
							swap.action = [parsedData];
						} else {
							swap.withdraw = true;
						}
					}
				);
				eventsDataCopy[eventDataIndex] = swap;
				setEventsData(eventsDataCopy);
			}

			if (!swap.complete) {
				contract.on(
					contract.filters.Complete(account, SERVICE_ADDRESS, productId),
					(customer, service, localProductId, amount, event) => {
						console.log('---COMPLETE EVENT---', event);
						swap.complete = true;
					}
				);
				eventsDataCopy[eventDataIndex] = swap;
				setEventsData(eventsDataCopy);
			}
		}
	}, [productId, account]);

	return (
		<Wrapper>
			<Paragraph>Pending Swaps ({eventsData.length})</Paragraph>
			<Tabs data={eventsData} />
		</Wrapper>
	);
};
