import { useState, useEffect } from 'react';
import { useEthers, useGasPrice } from '@usedapp/core';
import { utils, BigNumber } from 'ethers';
import styled, { css } from 'styled-components';
import {
	CONTRACT_ADDRESSES,
	PROTOCOL_FEE,
	makeId,
	useStore,
	serviceAddress,
	ESTIMATED_NETWORK_TRANSACTION_GAS,
	useBinanceApi,
	Graph,
	startToken,
	BINANCE_FEE,
	isTokenSelected,
	isNetworkSelected
} from '../../helpers';
import CONTRACT_DATA from '../../data/YandaExtendedProtocol.json';
import destinationNetworks from '../../data/destinationNetworks.json';
import { Contract } from '@ethersproject/contracts';
import { pxToRem, spacing, Theme } from '../../styles';

const Details = styled.div(
	({ color }: { color: string }) => css`
		flex-direction: column;
		padding: ${spacing[10]} ${spacing[16]};
		margin: ${spacing[28]} 0 ${spacing[56]};
		border-radius: ${pxToRem(6)};
		border: 1px solid ${color};

		& > * {
			display: flex;
			justify-content: space-between;
		}
	`
);

const Summary = styled.summary(
	({ color, theme }: { color: string; theme: Theme }) => css`
		color: ${theme.pure};
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
			destinationNetwork,
			destinationToken
		}
	} = useStore();
	const { allPairs, allPrices } = useBinanceApi();

	const [networkFee, setNetworkFee] = useState({ amount: 0, currency: 'GLMR' });
	const [cexFee, setCexFee] = useState([{ amount: 0, currency: 'GLMR' }]);
	const [withdrawlFee, setWithdrawlFee] = useState({ amount: 0, currency: 'GLMR' });
	const [protocolFee, setProtocolFee] = useState({ amount: 0, currency: 'GLMR' });
	const [feeSum, setFeeSum] = useState({ amount: 0, currency: 'USDT' });
	const [cexGraph, setCexGraph] = useState<Graph>();

	const { chainId, library: web3Provider } = useEthers();
	const gasPrice: any = useGasPrice();
	// @ts-ignore
	const contractAddress = CONTRACT_ADDRESSES[chainId];
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);

	const contract = new Contract(contractAddress, contractInterface, web3Provider);

	if (web3Provider) {
		contract.connect(web3Provider.getSigner());
	}

	useEffect(() => {
		const estimateNetworkFee = async (): Promise<void> => {
			if (isNetworkSelected(network) && isTokenSelected(token) && address && amount) {
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
					setNetworkFee({
						amount: Number(utils.formatEther(calculatedFee['_hex'])),
						currency: 'GLMR'
					});
				} catch (err: any) {
					throw new Error(err);
				}
			}
		};
		void estimateNetworkFee();
	}, [amount, token, network, address]);

	useEffect(() => {
		const localGraph = new Graph();
		for (let i = 0; i < allPairs.length; i++) {
			// @ts-ignore
			localGraph.addEdge(allPairs[i].baseAsset, allPairs[i].quoteAsset);
			if (allPairs.length === localGraph.edges) {
				// @ts-ignore
				setCexGraph(localGraph);
			}
		}
	}, [allPairs]);

	useEffect(() => {
		const estimateCexFee = () => {
			if (cexGraph) {
				const graphPath: false | { distance: number; path: string[] } = cexGraph.bfs(
					startToken,
					token
				);

				if (graphPath && allPrices) {
					let result = Number(amount);
					const allCexFees: { amount: number; currency: string }[] = [];
					for (let i = 0; i < graphPath.distance; i++) {
						let edgePrice = 0;
						let ticker: undefined | { symbol: string; price: string } = allPrices.find(
							(x: { symbol: string; price: string }) =>
								x.symbol === graphPath.path[i] + graphPath.path[i + 1]
						);
						if (ticker) {
							edgePrice = Number(ticker?.price);
						} else {
							ticker = allPrices.find(
								(x: any) => x.symbol === graphPath.path[i + 1] + graphPath.path[i]
							);
							edgePrice = 1 / Number(ticker?.price);
						}
						result *= edgePrice;
						allCexFees.push({ amount: result * BINANCE_FEE, currency: graphPath.path[i + 1] });
					}
					setCexFee(allCexFees);
				}
			}
		};
		estimateCexFee();
	}, [token, cexGraph, amount, allPrices]);

	useEffect(() => {
		if (isTokenSelected(token) && isNetworkSelected(network)) {
			// @ts-ignore
			const tokenDetails = destinationNetworks[network]['tokens'][token];
			setWithdrawlFee({ amount: Number(tokenDetails?.['withdrawFee']), currency: token });
		}
	}, [network, token]);

	useEffect(() => {
		setProtocolFee({ amount: Number(amount) * PROTOCOL_FEE, currency: 'GLMR' });
	}, [amount]);

	useEffect(() => {
		const amount = [...cexFee, networkFee, withdrawlFee, protocolFee].reduce((total, fee) => {
			const ticker = allPrices.find(
				(pair: { symbol: string; price: string }) => pair.symbol === `${fee.currency}USDT`
			);
			if (ticker) {
				return (total += +ticker.price * fee.amount);
			} else {
				const reverseTicker = allPrices.find(
					(pair: { symbol: string; price: string }) => pair.symbol === `${fee.currency}USDT`
				);
				if (reverseTicker) {
					return (total += fee.amount / +reverseTicker.price);
				}
			}

			return total;
		}, 0);
		setFeeSum({ ...feeSum, amount });
	}, [
		networkFee,
		cexFee,
		withdrawlFee,
		protocolFee,
		destinationAddress,
		destinationMemo,
		destinationAmount,
		destinationNetwork,
		destinationToken
	]);

	return (
		<details>
			<Summary color={theme.default} theme={theme}>
				Fee: {feeSum.amount.toFixed(2)} {feeSum.currency}
			</Summary>
			<Details color={theme.default}>
				<div>
					<p>Network fee:</p>
					<p>
						{networkFee.amount} {networkFee.currency}
					</p>
				</div>
				<div>
					<p>Protocol fee:</p>
					<p>
						{protocolFee.amount} {protocolFee.currency}
					</p>
				</div>
				<div>
					<p>CEX fee:</p>
					<div>
						{cexFee.map((fee) => (
							<p style={{ textAlign: 'right' }} key={fee.currency}>
								{fee.amount} {fee.currency}
							</p>
						))}
					</div>
				</div>
				<div>
					<p>Withdrawal fee:</p>
					<p>
						{withdrawlFee.amount} {withdrawlFee.currency}
					</p>
				</div>
			</Details>
		</details>
	);
};
