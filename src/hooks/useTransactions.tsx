import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
// import { utils, BigNumber } from 'ethers';
import { BINANCE_FEE, routes, GRAPH_URLS, TransactionData, useStore } from '../helpers';
import type { CostRequest, ChainIds } from '../helpers';
import { useAxios } from './useAxios';
import { createClient } from 'urql';
import _ from 'lodash';

export const useTransactions = () => {
	const [loading, setLoading] = useState(true);
	const [contentLoading, setContentLoading] = useState(true);
	const [startFetchDetails, setStartFetchDetails] = useState(false);
	const [data, setData] = useState<TransactionData[]>([]);
	const [events, setEvents] = useState<any[]>([]);

	const { chainId } = useEthers();
	const {
		state: { account, isUserVerified }
	} = useStore();
	const api = useAxios();

	const getAllTransactions = async () => {
		if (account && isUserVerified && chainId) {
			const query = `
				query {
					costRequests(where: {customer: "${account}"}) {
						id
						customer
						service
						productId
						validatorsList
						data
						blockNumber
						blockTimestamp
						transactionHash
					}
				}
			`;

			const client = createClient({ url: GRAPH_URLS[chainId.toString() as ChainIds] });
			// @ts-ignore
			const graphQuery: any = await client.query(query).toPromise();
			const graphData: CostRequest[] = graphQuery.data.costRequests.filter(
				(item: CostRequest) => item.data
			);

			setEvents(graphData);
			setLoading(false);
		}
	};

	const getTransactionsHeaderData = () => {
		const headerData: TransactionData[] = [];
		events.map((transaction: CostRequest) => {
			const { scoin, fcoin, samt, net } = JSON.parse(transaction?.data);
			const dataset: TransactionData = {
				blockNumber: +transaction?.blockNumber,
				header: {
					timestamp: +transaction?.blockTimestamp,
					symbol: `${scoin}${fcoin}`,
					scoin,
					fcoin,
					samt,
					net
				},
				content: null,
				withdrawl: null,
				gasFee: ''
			};
			headerData.push(dataset);
		});

		const uniqueData = _.uniqBy([...data, ...headerData], 'blockNumber');
		setData(uniqueData);
		setStartFetchDetails(true);
	};

	const getTransactionsData = async (transaction: CostRequest) => {
		let dataset = {} as TransactionData;
		dataset.blockNumber = +transaction?.blockNumber;
		const { scoin, fcoin, samt, net } = JSON.parse(transaction?.data);
		const actionQuery = `
			query {
				actions(where: {productId: "${transaction?.productId}"}) {
					data
				}
			}
		`;

		if (chainId) {
			const client = createClient({ url: GRAPH_URLS[chainId.toString() as ChainIds] });
			// @ts-ignore
			const graphQuery: any = await client.query(actionQuery).toPromise();
			const actionRes: { data: string }[] = graphQuery.data.actions;

			if (actionRes.length === 0) {
				dataset = {
					...dataset,
					content: 'none',
					withdrawl: null
				};
			}
			if (actionRes.length === 2) {
				const { q: qty, p: price, ts: timestamp } = JSON.parse(actionRes[0]?.data);
				const { id } = JSON.parse(actionRes[1]?.data);

				try {
					const withdrawLink = await api.get(`${routes.transactionDetails}${id}`);
					const {
						data: { amount, url, withdrawFee }
					} = withdrawLink;

					dataset = { ...dataset, withdrawl: { amount, url, withdrawFee } };
				} catch (e) {
					console.log('error in withdrawLink', e);
				}

				const completeQuery = `
					query {
						completes(where: {productId: "${transaction?.productId}"}) {
							success
						}
					}
				`;

				// @ts-ignore
				const graphQuery: any = await client.query(completeQuery).toPromise();
				const completeRes: { success: boolean }[] = graphQuery.data.completes;
				const success = completeRes[0]?.success;

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

			// const block = transaction.blockNumber;
			// const gasFee = utils.formatEther(
			// 	BigNumber.from(block.baseFeePerGas['_hex']).mul(BigNumber.from(block.gasUsed['_hex']))
			// );
			const gasFee = '10';
			dataset = {
				...dataset,
				header: {
					...dataset.header,
					timestamp: +transaction?.blockTimestamp,
					symbol: `${scoin}${fcoin}`,
					scoin,
					fcoin,
					samt,
					net
				},
				gasFee
			};

			return dataset;
		}
	};

	useEffect(() => {
		void getAllTransactions();
	}, [account, isUserVerified]);

	useEffect(() => {
		if (events.length > 0) {
			getTransactionsHeaderData();
		}
	}, [events]);

	useEffect(() => {
		if (events.length > 0) {
			const all = events.map(async (event) => getTransactionsData(event));
			Promise.all(all)
				// @ts-ignore
				.then((transactions: TransactionData[]) => {
					const dataCopy = [...data];
					transactions.map((transaction: TransactionData) => {
						// TODO: solution if undefined - also for the lastBlock logic
						const findTransactionInData = data.find(
							(item) => item.blockNumber === transaction.blockNumber
						);

						if (findTransactionInData) {
							const transactionIndexInData = dataCopy.indexOf(findTransactionInData);
							dataCopy[transactionIndexInData] = transaction;
						} else {
							dataCopy.push(transaction);
						}
					});
					setData(dataCopy);
				})
				.catch((e) => console.log('e in PromiseAll', e))
				.finally(() => setContentLoading(false));
		}
	}, [startFetchDetails]);

	return { loading, contentLoading, data };
};
