import { useState, useEffect } from 'react';
import { useEthers, useGasPrice } from '@usedapp/core';
import { ethers } from 'ethers';
import { utils } from 'ethers';
import styled, { css } from 'styled-components';
import { CONTRACT_ADDRESSES, PROTOCOL_FEE, useStore } from '../../helpers';
import CONTRACT_DATA from '../../data/YandaExtendedProtocol.json';
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

	const [gasFee, setGasFee] = useState(0);
	const [cexFee, setCexFee] = useState(0);
	const [withdrawalFee, setWithdrawalFee] = useState(0);
	const [protocolFee, setProtocolFee] = useState(0);
	const [feeSum, setFeeSum] = useState(0);

	const { chainId, library: web3Provider } = useEthers();
	const gasPrice = useGasPrice();
	// @ts-ignore
	const contractAddress = CONTRACT_ADDRESSES[chainId];
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	// @ts-ignore
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	if (provider)
		provider
			.estimateGas({
				to: contractAddress,
				value: ethers.utils.parseEther('0.001')
			})
			.then((gas) => console.log('PROVIDER', gas))
			.catch((error) => console.log('!!!! ERROR PROVIDER !!!!!', error, typeof contractAddress));

	// @ts-ignore
	const contract = new Contract(contractAddress, contractInterface, web3Provider);

	if (web3Provider) {
		contract.connect(web3Provider.getSigner());
	}

	const makeid = (length: number) => {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	};

	const productId = utils.id(makeid(32));

	const namedValues = {
		scoin: 'GLMR',
		samt: utils.parseEther('324234').toString(),
		fcoin: token,
		net: network,
		daddr: address
	};

	const shortNamedValues = JSON.stringify(namedValues);

	const serviceAddress = '0xeB56c1d19855cc0346f437028e6ad09C80128e02';

	contract.estimateGas
		.createProcess(serviceAddress, productId, shortNamedValues)
		.then((gas) => console.log('gas', gas, gasPrice))
		.catch((error) => console.log('!!!! ERROR !!!!!', error));
	// const { state: createState, send: sendCreateProcess } = useContractFunction(
	// 	contract,
	// 	'createProcess',
	// 	{ transactionName: 'Request Swap' }
	// );
	// const { sendTransaction, state: depositState } = useSendTransaction({
	// 	transactionName: 'Deposit'
	// });

	useEffect(() => {
		setProtocolFee(Number(amount) * PROTOCOL_FEE);
	}, [amount]);

	useEffect(() => {
		setFeeSum(gasFee + cexFee + withdrawalFee + protocolFee);
	}, [gasFee, cexFee, withdrawalFee, protocolFee]);

	return (
		<details>
			<Summary color={theme.default} theme={theme}>
				Fee: {feeSum}
			</Summary>
			<Details color={theme.default}>
				<div>
					<p>Gas fee:</p>
					<p>{gasFee} GLMR</p>
				</div>
				<div>
					<p>Protocol fee:</p>
					<p>{protocolFee} DOT</p>
				</div>
				<div>
					<p>CEX fee:</p>
					<p>{cexFee} DOT</p>
				</div>
				<div>
					<p>Withdrawal fee:</p>
					<p>{withdrawalFee} DOT</p>
				</div>
			</Details>
		</details>
	);
};
