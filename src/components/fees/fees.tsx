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
	ESTIMATED_NETWORK_TRANSACTION_GAS
} from '../../helpers';
import CONTRACT_DATA from '../../data/YandaExtendedProtocol.json';
import destinationNetworks from '../../data/destinationNetworks.json';
import { Contract } from '@ethersproject/contracts';
import { pxToRem, spacing, Theme } from '../../styles';

const Summary = styled.summary(
	({ color, theme }: { color: string; theme: Theme }) => css`
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
	({ color }: { color: string }) => css`
		flex-direction: column;
		padding: ${spacing[10]} ${spacing[16]};
		margin-bottom: ${spacing[56]};
		border-radius: ${pxToRem(6)};
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
		state: { theme }
	} = useStore();

	const [networkFee, setNetworkFee] = useState(0);
	const [cexFee, setCexFee] = useState(0);
	const [withdrawalFee, setWithdrawalFee] = useState(0);
	const [protocolFee, setProtocolFee] = useState(0);
	const [feeSum, setFeeSum] = useState(0);

	const { chainId, library: web3Provider } = useEthers();
	const gasPrice: any = useGasPrice();

	// @ts-ignore
	const contractAddress = CONTRACT_ADDRESSES[chainId];
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);

	const contract = new Contract(contractAddress, contractInterface, web3Provider);

	if (web3Provider) {
		contract.connect(web3Provider.getSigner());
	}
	// const provider = new ethers.providers.Web3Provider(window.ethereum);
	// if (provider)
	// 	provider
	// 		.estimateGas({
	// 			to: contractAddress,
	// 			value: ethers.utils.parseEther('0.001')
	// 		})
	// 		.then((gas) => console.log('PROVIDER', gas))
	// 		.catch((error) => console.log('!!!! ERROR PROVIDER !!!!!', error, typeof contractAddress));

	// const { state: createState, send: sendCreateProcess } = useContractFunction(
	// 	contract,
	// 	'createProcess',
	// 	{ transactionName: 'Request Swap' }
	// );
	// const { sendTransaction, state: depositState } = useSendTransaction({
	// 	transactionName: 'Deposit'
	// });

	useEffect(() => {
		const estimateNetworkFee = async () => {
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
					// console.log('!!! HERE !!!', calculatedFee['_hex'].toNumber());
					// setNetworkFee(BigNumber.from(calculatedFee['_hex']).toNumber());
				} catch (err: any) {
					throw new Error(err);
				}
			}
		};
		estimateNetworkFee();
	}, [amount, token, network, address]);

	useEffect(() => {
		if (token !== 'Select Token' && network !== 'Select Network') {
			// @ts-ignore
			const tokenDetails = destinationNetworks[network]['tokens'][token];
			setWithdrawalFee(tokenDetails['withdrawFee']);
		}
	}, [network, token]);

	useEffect(() => {
		setProtocolFee(Number(amount) * PROTOCOL_FEE);
	}, [amount]);

	useEffect(() => {
		setFeeSum(Number(networkFee) + protocolFee + Number(cexFee) + withdrawalFee);
	}, [networkFee, cexFee, withdrawalFee, protocolFee]);

	return (
		<details>
			<Summary color={theme.default} theme={theme}>
				Fee: {feeSum}
			</Summary>
			<Details color={theme.default}>
				<div>
					<p>Gas fee:</p>
					<p>{networkFee} GLMR</p>
				</div>
				<div>
					<p>Protocol fee:</p>
					<p>
						{protocolFee} {token !== 'Select Token' ? token : 'GLMR'}
					</p>
				</div>
				<div>
					<p>CEX fee:</p>
					<p>{cexFee?.toString()} DOT</p>
				</div>
				<div>
					<p>Withdrawal fee:</p>
					<p>
						{withdrawalFee} {token !== 'Select Token' ? token : 'GLMR'}
					</p>
				</div>
			</Details>
		</details>
	);
};
