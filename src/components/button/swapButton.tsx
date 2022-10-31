import { forwardRef, useImperativeHandle } from 'react';
import { ERC20Interface, useContractFunction, useEthers, useSendTransaction } from '@usedapp/core';
import styled from 'styled-components';
import CONTRACT_DATA from '../../data/YandaExtendedProtocol.json';
import { useContractFunction, useEthers, useSendTransaction } from '@usedapp/core';
import { utils } from 'ethers';
import { Button } from '..';
import { Contract } from '@ethersproject/contracts';
import {
	CONTRACT_ADDRESSES,
	isNetworkSelected,
	isTokenSelected,
	makeId,
	SERVICE_ADDRESS,
	useStore,
	START_TOKEN
} from '../../helpers';
import type { ContractAdress } from '../../helpers';
import CONTRACT_DATA from '../../data/YandaMultitokenProtocolV1.json';
import sourceNetworks from '../../data/sourceNetworks.json';
import styled from 'styled-components';
import { spacing } from '../../styles';

const ButtonWrapper = styled.div`
	margin-top: ${spacing[28]};
`;

type Props = {
	validInputs: boolean;
	amount: string;
	onClick: () => void;
};

export const SwapButton = forwardRef(({ validInputs, amount, onClick }: Props, ref) => {
	const {
		state: {
			destinationNetwork,
			destinationToken,
			destinationAddress,
			destinationMemo,
			isUserVerified,
			destinationAmount
		}
	} = useStore();
	const isDisabled =
		!validInputs ||
		!isNetworkSelected(destinationNetwork) ||
		!isTokenSelected(destinationToken) ||
		!isUserVerified ||
		+destinationAmount < 0;

	const { account, chainId, library: web3Provider } = useEthers();
	const startTokenData =
		// @ts-ignore
		sourceNetworks[chainId.toString()]?.tokens[START_TOKEN];
	const tokenContract = startTokenData.contractAddr && new Contract(startTokenData.contractAddr, ERC20Interface, web3Provider);

	const protocolAddress = CONTRACT_ADDRESSES?.[chainId as ContractAdress] || '';
	const protocolInterface = new utils.Interface(CONTRACT_DATA.abi);
	const protocol = new Contract(protocolAddress, protocolInterface, web3Provider);
	if (web3Provider) {
		protocol.connect(web3Provider.getSigner());
		if (tokenContract) {
			tokenContract.connect(web3Provider.getSigner());
		}
	}

	const { send: sendTokenApprove } = useContractFunction(
		// @ts-ignore
		tokenContract,
		'approve',
		{ transactionName: 'Approve token to be used for Swap' }
	);
	const { send: sendCreateProcess } = useContractFunction(
		// @ts-ignore
		protocol,
		'createProcess(address,bytes32,string)',
		{ transactionName: 'Request Swap' }
	);
	const { send: sendTokenCreateProcess } = useContractFunction(
		// @ts-ignore
		protocol,
		'createProcess(address,address,bytes32,string)',
		{ transactionName: 'Request Swap' }
	);
	const { send: sendDeposit } = useContractFunction(
		// @ts-ignore
		protocol,
		'deposit',
		{ transactionName: 'deposit' }
	);
	const { sendTransaction } = useSendTransaction({
		transactionName: 'Deposit'
	});

	useImperativeHandle(ref, () => ({
		async onSubmit() {
			const productId = utils.id(makeId(32));

			const namedValues = {
				scoin: 'ETH',
				samt: utils.parseEther(amount).toString(),
				fcoin: destinationToken,
				net: destinationNetwork,
				daddr: destinationAddress,
				tag: destinationMemo
			};

			const shortNamedValues = JSON.stringify(namedValues);

			if(startTokenData.isNative) {
				await sendCreateProcess(SERVICE_ADDRESS, productId, shortNamedValues);
			} else {
				console.log('Calling sendCreateProcess with the contractAddr', startTokenData.contractAddr);
				await sendTokenCreateProcess(startTokenData.contractAddr, SERVICE_ADDRESS, productId, shortNamedValues);
			}
			const filter = protocol.filters.CostResponse(account, SERVICE_ADDRESS, productId);
			protocol.on(filter, (customer, service, productId, cost) => {
				console.log('Oracle deposit estimation:', utils.formatEther(cost));
				if(startTokenData.isNative) {
					void sendTransaction({ to: protocolAddress, value: cost });
				} else {
					sendTokenApprove(protocolAddress, cost)
						.then(result => {
							console.log('Approved ', utils.formatEther(cost), ' tokens of "', protocolAddress, '" contract.', result);

							void sendDeposit(cost);
						})
						.catch(error => {
							console.log('Error in sending approve', error);
						});
				}
			});
		}
	}));

	return (
		<ButtonWrapper>
			<Button disabled={isDisabled} color="default" onClick={onClick}>
				SWAP
			</Button>
		</ButtonWrapper>
	);
});
