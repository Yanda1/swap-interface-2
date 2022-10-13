import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { utils, BigNumber } from 'ethers';
import CONTRACT_DATA from '../data/YandaExtendedProtocol.json';
import { Contract } from '@ethersproject/contracts';
import {
	BINANCE_FEE,
	BLOCK_CONTRACT_NUMBER,
	CONTRACT_ADDRESSES,
	routes,
	SERVICE_ADDRESS,
	useStore
} from '../helpers';
import { useAxios } from './useAxios';

export type TransactionData = {
	blockNumber: number;
	header: {
		timestamp: number;
		symbol: string;
		scoin: string;
		fcoin: string;
		samt: string;
		net: string;
	};
	content: {
		qty: string;
		price: string;
		timestamp: number;
		cexFee: string;
		withdrawFee: string;
		success: boolean;
	} | null;
	gasFee: string;
	withdrawl: {
		amount: string;
		withdrawFee: string;
		url: string;
	} | null;
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
	const api = useAxios();
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
			let dataset = {} as TransactionData;
			dataset.blockNumber = transaction?.blockNumber;
			const { scoin, fcoin, samt, net } = JSON.parse(transaction?.args?.data);

			const actionFilter = contract.filters.Action(account, SERVICE_ADDRESS, transaction.args[2]);
			const actionRes = await contract.queryFilter(actionFilter, transaction?.blockNumber);
			if (actionRes.length === 0) {
				dataset = {
					...dataset,
					content: null,
					withdrawl: null
				};
			}
			if (actionRes.length === 2) {
				const { q: qty, p: price, ts: timestamp } = JSON.parse(actionRes[0]?.args?.data);
				const { id } = JSON.parse(actionRes[1]?.args?.data);

				try {
					const withdrawLink = await api.get(`${routes.transactionDetails}${id}`);
					const {
						data: { amount, url, withdrawFee }
					} = withdrawLink;

					dataset = { ...dataset, withdrawl: { amount, url, withdrawFee } };
				} catch (e) {
					console.log('error in withdrawLink', e);
				}

				const completeFilter = contract.filters.Complete(
					account,
					SERVICE_ADDRESS,
					transaction.args[2]
				);
				const completeRes = await contract.queryFilter(completeFilter, transaction?.blockNumber);
				const success = JSON.parse(completeRes[0]?.args?.success);

				dataset = {
					...dataset,
					content: {
						qty,
						price,
						timestamp,
						cexFee: (qty * price * BINANCE_FEE).toString(),
						withdrawFee: '',
						success
					}
				};
			}

			try {
				const block = await transaction.getBlock();
				const gasFee = utils.formatEther(
					BigNumber.from(block.baseFeePerGas['_hex']).mul(BigNumber.from(block.gasUsed['_hex']))
				);
				dataset = {
					...dataset,
					header: {
						timestamp: block.timestamp,
						symbol: `${scoin}${fcoin}`,
						scoin,
						fcoin,
						samt,
						net
					},
					gasFee
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
