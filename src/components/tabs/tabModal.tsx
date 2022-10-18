import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Tabs } from './tabs';
import { pxToRem } from '../../styles';
import { CONTRACT_ADDRESSES, ContractAdress, SERVICE_ADDRESS, useStore } from '../../helpers';
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

export const TabModal = () => {
	const {
		state: { productId }
	} = useStore();
	const { account } = useEthers();
	const { chainId, library: web3Provider } = useEthers();
	const contractAddress = CONTRACT_ADDRESSES?.[chainId as ContractAdress] || '';
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const contract = new Contract(contractAddress, contractInterface, web3Provider);
	const [orders, setOrders] = useState<
		{
			productId: string;
			costRequestCounter: number;
			action: object[];
			depositBlock: number;
			withdraw: object[];
			complete: boolean;
		}[]
	>([]);

	useEffect(() => {
		if (productId) {
			const order = {
				productId,
				costRequestCounter: 0,
				depositBlock: 0,
				action: [],
				withdraw: [],
				complete: false
			};

			setOrders([...orders, order]);

			contract.on(
				contract.filters.CostRequest(account, SERVICE_ADDRESS, productId),
				(account, service, localProductId, amount, event) => {
					console.log('---COST REQUEST EVENT---', event);
					setOrders((orders) =>
						orders.map((order) => {
							if (order.productId === productId) {
								return { ...order, costRequestCounter: order.costRequestCounter + 1 };
							}

							return order;
						})
					);
				}
			);

			contract.on(
				contract.filters.Deposit(account, SERVICE_ADDRESS, productId),
				(customer, service, localProductId, amount, event) => {
					console.log('---DEPOSIT EVENT---', event);
					setOrders((orders) =>
						orders.map((order) => {
							if (order.productId === productId) {
								return { ...order, depositBlock: event.blockNumber };
							}

							return order;
						})
					);
				}
			);

			contract.on(
				contract.filters.Action(account, SERVICE_ADDRESS, productId),
				(customer, service, localProductId, data, event) => {
					console.log('---ORDER EVENT---', event);
					const parsedData = JSON.parse(event.args?.data);
					setOrders((orders) =>
						orders.map((order) => {
							if (order.productId === productId) {
								return { ...order, depositBlock: event.blockNumber };
							}

							return order;
						})
					);
					if (parsedData.t === 0) {
						setOrders((orders) =>
							orders.map((order) => {
								if (order.productId === productId) {
									return { ...order, action: [parsedData] };
								}

								return order;
							})
						);
					} else {
						setOrders((orders) =>
							orders.map((order) => {
								if (order.productId === productId) {
									return { ...order, withdraw: [parsedData] };
								}

								return order;
							})
						);
					}
				}
			);

			contract.on(
				contract.filters.Complete(account, SERVICE_ADDRESS, productId),
				(customer, service, localProductId, amount, event) => {
					console.log('---COMPLETE EVENT---', event);
					setOrders((orders) =>
						orders.map((order) => {
							if (order.productId === productId) {
								return { ...order, complete: event.args.success };
							}

							return order;
						})
					);
				}
			);
		}
	}, [productId]);

	return (
		<Wrapper>
			{orders.length > 0 && (
				<>
					<Paragraph>Pending Swaps ({orders.length})</Paragraph>
					<Tabs data={orders} />
				</>
			)}
		</Wrapper>
	);
};
