import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { utils } from 'ethers';
import CONTRACT_DATA from '../data/YandaExtendedProtocol.json';
import { Contract } from '@ethersproject/contracts';
import { BLOCK_CONTRACT_NUMBER, CONTRACT_ADDRESSES, SERVICE_ADDRESS, useStore } from '../helpers';

export type TransactionData = {
	blockNumber: number;
	header: {
		timestamp: number | undefined;
		symbol: string;
		scoin: string;
		fcoin: string;
		samt: string;
	};
};

export const useTransactions = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<TransactionData[]>([]);
	const [events, setEvents] = useState<any[]>([]);

	const { chainId, library: web3Provider } = useEthers();
	const contractAddress = CONTRACT_ADDRESSES?.[chainId as keyof typeof CONTRACT_ADDRESSES] || '';
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const {
		state: { account }
	} = useStore();
	const contract = new Contract(contractAddress, contractInterface, web3Provider);

	// web3Provider
	// 	?.getBlockNumber()
	// 	.then((block: any) => console.log('block', block))
	// 	.catch((error: any) => console.log('error', error));
	const getAllTransactions = async () => {
		if (account) {
			setLoading(true);
			const costRequestFilter = contract.filters.CostRequest(account, SERVICE_ADDRESS);

			try {
				const events = await contract.queryFilter(costRequestFilter, BLOCK_CONTRACT_NUMBER); // TODO: optimise by splitting the entire request into smaller fetching parts
				const dataEvents = events.filter((event) => event?.args?.data);
				setEvents(dataEvents);
			} catch (e) {
				console.log('error in costRequestFilter', e);
			}
			setLoading(false);
		}
	};

	const getTransactionData = () => {
		setLoading(true);
		events.map(async (transaction) => {
			// console.log('transaction', transaction);
			let dataset = {} as TransactionData;
			dataset.blockNumber = transaction?.blockNumber;
			const { scoin, fcoin, samt } = JSON.parse(transaction?.args?.data);

			const depositFilter = contract.filters.Deposit(account, SERVICE_ADDRESS, transaction.args[2]);
			const depositRes = await contract.queryFilter(depositFilter, transaction?.blockNumber);
			console.log('deposit res', depositRes);

			const actionFilter = contract.filters.Action(account, SERVICE_ADDRESS, transaction.args[2]);
			const actionRes = await contract.queryFilter(actionFilter, transaction?.blockNumber);
			console.log('action res', actionRes);

			const completeFilter = contract.filters.Complete(
				account,
				SERVICE_ADDRESS,
				transaction.args[2]
			);
			const completeRes = await contract.queryFilter(completeFilter, transaction?.blockNumber);
			console.log('complete res', completeRes);

			try {
				const block = await transaction.getBlock();
				dataset = {
					...dataset,
					header: {
						timestamp: block.timestamp,
						symbol: `${scoin}${fcoin}`,
						scoin,
						fcoin,
						samt
					}
				};
			} catch (e) {
				console.log('error', e);
			}
			setData([...data, dataset]);
		});
		setLoading(false);
	};

	useEffect(() => {
		void getAllTransactions();
	}, [account]);

	useEffect(() => {
		getTransactionData();
	}, [events]);

	return { loading, data };
};
