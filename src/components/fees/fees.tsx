import { useEffect, useState } from 'react';
import { useEthers, useGasPrice } from '@usedapp/core';
import { BigNumber, utils } from 'ethers';
import styled, { css } from 'styled-components';
import {
	BINANCE_FEE,
	CONTRACT_ADDRESSES,
	ESTIMATED_NETWORK_TRANSACTION_GAS,
	Fee,
	FeeEnum,
	FEE_CURRENCY,
	Graph,
	isNetworkSelected,
	isTokenSelected,
	makeId,
	PROTOCOL_FEE,
	serviceAddress,
	START_TOKEN,
	useBinanceApi,
	useStore
} from '../../helpers';
import type { Price } from '../../helpers';
import { defaultBorderRadius, spacing } from '../../styles';
import type { Theme } from '../../styles';
import CONTRACT_DATA from '../../data/YandaExtendedProtocol.json';
import destinationNetworks from '../../data/destinationNetworks.json';
import { Contract } from '@ethersproject/contracts';

const Summary = styled.summary(
	({ color, theme }: { color: string; theme: Theme }) => css`
		color: ${theme.font.pure};
		margin-top: ${spacing[28]};
		cursor: pointer;

		&:focus-visible {
			outline-offset: 2px;
			outline: 1px solid ${color};
		}

		&:active {
			outline: none;
		}
	`
);

const Details = styled.div(
	({ color }: { color: string }) => css`
		flex-direction: column;
		padding: ${spacing[10]} ${spacing[16]};
		margin: ${spacing[28]} 0 ${spacing[56]};
		border-radius: ${defaultBorderRadius};
		border: 1px solid ${color};

		& > * {
			display: flex;
			justify-content: space-between;
		}
	`
);

type Props = {
	amount: string;
	token: string;
	address: string;
	network: string;
};

export const Fees = ({ amount, token, address, network }: Props) => {
	const {
		state: {
			theme,
			destinationAddress,
			destinationMemo,
			destinationAmount,
			destinationToken,
			isNetworkConnected,
			fees
		},
		dispatch
	} = useStore();
	const { allFilteredPairs, allFilteredPrices } = useBinanceApi();
	const [cexGraph, setCexGraph] = useState<Graph>();
	const { chainId, library: web3Provider } = useEthers();
	// @ts-ignore
	const gasPrice: any = useGasPrice();
	const contractAddress = CONTRACT_ADDRESSES?.[chainId as keyof typeof CONTRACT_ADDRESSES] || '';
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const contract = new Contract(contractAddress, contractInterface, web3Provider);

	if (web3Provider && isNetworkConnected) {
		contract.connect(web3Provider.getSigner());
	}

	const estimateNetworkFee = async (): Promise<void> => {
		if (isNetworkSelected(network) && isTokenSelected(token) && address && amount && contract) {
			const namedValues = {
				scoin: 'GLMR',
				samt: utils.parseEther(amount).toString(),
				fcoin: token,
				net: network,
				daddr: address
			};
			const shortNamedValues = JSON.stringify(namedValues);
			const productId = utils.id(makeId(32));
			try {
				const gasAmount = await contract.estimateGas.createProcess(
					serviceAddress,
					productId,
					shortNamedValues
				);
				const calculatedProcessFee = BigNumber.from(gasAmount['_hex']).mul(
					BigNumber.from(gasPrice['_hex'])
				);
				const calculatedTransactionFee = BigNumber.from(ESTIMATED_NETWORK_TRANSACTION_GAS).mul(
					BigNumber.from(gasPrice['_hex'])
				);
				const calculatedFee = BigNumber.from(calculatedProcessFee).add(
					BigNumber.from(calculatedTransactionFee)
				);
				dispatch({
					type: FeeEnum.ALL,
					payload: {
						...fees,
						NETWORK: {
							amount: Number(utils.formatEther(calculatedFee['_hex'])),
							currency: 'GLMR'
						}
					}
				});
			} catch (err: any) {
				throw new Error(err); // TODO: handle all throw new Error with Toast?
			}
		}
	};

	useEffect(() => {
		void estimateNetworkFee();
	}, [amount, address, token]);

	useEffect(() => {
		const localGraph = new Graph();
		for (let i = 0; i < allFilteredPairs.length; i++) {
			// @ts-ignore
			localGraph.addEdge(allFilteredPairs[i].baseAsset, allFilteredPairs[i].quoteAsset);
			if (allFilteredPairs.length === localGraph.edges) {
				setCexGraph(localGraph);
			}
		}
	}, [allFilteredPairs]);

	const estimateCexFee = () => {
		if (cexGraph) {
			const graphPath: false | { distance: number; path: string[] } = cexGraph.bfs(
				START_TOKEN,
				token
			);

			if (graphPath && allFilteredPrices) {
				let result = Number(amount);
				const allCexFees: Fee[] = [];
				for (let i = 0; i < graphPath.distance; i++) {
					let edgePrice = 0;
					let ticker: undefined | Price = allFilteredPrices.find(
						(x: Price) => x.symbol === graphPath.path[i] + graphPath.path[i + 1]
					);
					if (ticker) {
						edgePrice = Number(ticker?.price);
					} else {
						ticker = allFilteredPrices.find(
							(x: any) => x.symbol === graphPath.path[i + 1] + graphPath.path[i]
						);
						edgePrice = 1 / Number(ticker?.price);
					}
					result *= edgePrice;
					allCexFees.push({ amount: result * BINANCE_FEE, currency: graphPath.path[i + 1] });
				}
				dispatch({ type: FeeEnum.ALL, payload: { ...fees, CEX: allCexFees } });
			}
		}
	};

	useEffect(() => {
		estimateCexFee();
	}, [token, cexGraph, amount]);

	useEffect(() => {
		if (isTokenSelected(token) && isNetworkSelected(network)) {
			// @ts-ignore
			const tokenDetails = destinationNetworks[network]['tokens'][token];

			dispatch({
				type: FeeEnum.ALL,
				payload: {
					...fees,
					WITHDRAW: { amount: Number(tokenDetails?.['withdrawFee']), currency: 'schwerin' }
				}
			});
		}
	}, [token]);

	useEffect(() => {
		dispatch({
			type: FeeEnum.ALL,
			payload: { ...fees, PROTOCOL: { amount: Number(amount) * PROTOCOL_FEE, currency: 'GLMR' } }
		});
	}, [amount]);

	useEffect(() => {
		const amount = [...fees.CEX, fees.NETWORK, fees.WITHDRAW, fees.PROTOCOL].reduce(
			(total, fee) => {
				const ticker = allFilteredPrices.find(
					(pair: Price) => pair.symbol === `${fee.currency}${FEE_CURRENCY}`
				);
				if (ticker) {
					return (total += +ticker.price * fee.amount);
				} else {
					const reverseTicker = allFilteredPrices.find(
						(pair: Price) => pair.symbol === `${fee.currency}${FEE_CURRENCY}`
					);
					if (reverseTicker) {
						return (total += fee.amount / +reverseTicker.price);
					}
				}
				if (fee.currency === FEE_CURRENCY) {
					return (total += fee.amount);
				}

				return total;
			},
			0
		);
		dispatch({
			type: FeeEnum.ALL,
			payload: { ...fees, TOTAL: { ...fees.TOTAL, amount } }
		});
	}, [destinationAddress, destinationMemo, destinationAmount, destinationToken]);

	return (
		<details>
			<Summary color={theme.font.default} theme={theme}>
				Fee: {fees.TOTAL.amount.toFixed(4)} {fees.TOTAL.currency}
			</Summary>
			<Details color={theme.font.default}>
				<div>
					<p>Network fee:</p>
					<p>
						{fees.NETWORK.amount} {fees.NETWORK.currency}
					</p>
				</div>
				<div>
					<p>Protocol fee:</p>
					<p>
						{fees.PROTOCOL.amount} {fees.PROTOCOL.currency}
					</p>
				</div>
				<div>
					<p>CEX fee:</p>
					<div>
						{fees.CEX.map((fee) => (
							<p style={{ textAlign: 'right' }} key={fee.currency}>
								{fee.amount} {fee.currency}
							</p>
						))}
					</div>
				</div>
				<div>
					<p>Withdrawal fee:</p>
					<p>
						{fees.WITHDRAW.amount} {fees.WITHDRAW.currency}
					</p>
				</div>
			</Details>
		</details>
	);
};
