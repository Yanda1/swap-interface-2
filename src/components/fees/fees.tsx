import { useEffect, useState } from 'react';
import { useEthers, useGasPrice } from '@usedapp/core';
import { BigNumber, utils } from 'ethers';
import styled, { css } from 'styled-components';
import {
	BINANCE_FEE,
	CONTRACT_ADDRESSES,
	defaultBorderRadius,
	ESTIMATED_NETWORK_TRANSACTION_GAS,
	Graph,
	makeId,
	PROTOCOL_FEE,
	serviceAddress,
	startToken,
	useBinanceApi,
	useStore
} from '../../helpers';
import CONTRACT_DATA from '../../data/YandaExtendedProtocol.json';
import destinationNetworks from '../../data/destinationNetworks.json';
import { Contract } from '@ethersproject/contracts';
import { spacing, Theme } from '../../styles';

const Summary = styled.summary(
	({color, theme}: { color: string; theme: Theme }) => css`
		color: ${theme.pure};
		margin: ${spacing[28]} 0;
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
	({color}: { color: string }) => css`
		flex-direction: column;
		padding: ${spacing[10]} ${spacing[16]};
		margin-bottom: ${spacing[56]};
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

export const Fees = ({amount, token, address, network}: Props) => {
	const {
		state: {theme}
	} = useStore();
	const {allPairs, allPrices} = useBinanceApi();

	const [networkFee, setNetworkFee] = useState({amount: 0, currency: 'GLMR'});
	const [cexFee, setCexFee] = useState([{amount: 0, currency: 'GLMR'}]);
	const [withdrawalFee, setWithdrawalFee] = useState({amount: 0, currency: 'GLMR'});
	const [protocolFee, setProtocolFee] = useState({amount: 0, currency: 'GLMR'});
	const [feeSum, setFeeSum] = useState({amount: 0, currency: 'GLMR'});
	const [cexGraph, setCexGraph] = useState<Graph>();

	const {chainId, library: web3Provider} = useEthers();
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
			if (token !== 'Select Token' && network !== 'Select Network' && address && amount) {
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
						amount: Number(utils.formatEther(calculatedFee['_hex'])), // TODO: @daniel - is this correct conversion?
						currency: token
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
				); // TODO: @daniel - only one edge atm?

				if (graphPath) {
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
						allCexFees.push({amount: result * BINANCE_FEE, currency: graphPath.path[i + 1]});
					}
					setCexFee(allCexFees);
				}
			}
		};
		estimateCexFee();
	}, [token, cexGraph, amount]);

	useEffect(() => {
		if (token !== 'Select Token' && network !== 'Select Network') {
			// @ts-ignore
			const tokenDetails = destinationNetworks[network]['tokens'][token];
			setWithdrawalFee({amount: Number(tokenDetails?.['withdrawFee']), currency: token});
		}
	}, [network, token]);

	useEffect(() => {
		setProtocolFee({amount: Number(amount) * PROTOCOL_FEE, currency: 'GLMR'});
	}, [amount]);

	useEffect(() => {
		setFeeSum({
			amount: networkFee.amount + protocolFee.amount + cexFee[0].amount + withdrawalFee.amount, // TODO: @daniel - feeSum currency? reduce for cexFee
			currency: 'GLMR'
		});
	}, [networkFee, cexFee, withdrawalFee, protocolFee]);

	return (
		<details>
			<Summary color={theme.default} theme={theme}>
				Fee: {feeSum.amount} {feeSum.currency}
			</Summary>
			<Details color={theme.default}>
				<div>
					<p>Gas fee:</p>
					{/* TODO: @daniel- should this be named gas or network fee? check logic for currency */}
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
							<p key={fee.currency}>
								{fee.amount} {fee.currency}
							</p>
						))}
					</div>
				</div>
				<div>
					<p>Withdrawal fee:</p>
					<p>
						{withdrawalFee.amount} {withdrawalFee.currency}
					</p>
				</div>
			</Details>
		</details>
	);
};
