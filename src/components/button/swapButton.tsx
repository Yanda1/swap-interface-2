import { forwardRef, useImperativeHandle } from 'react';
import { useContractFunction, useEthers, useSendTransaction } from '@usedapp/core';
import { utils } from 'ethers';
import { Button } from '..';
import { Contract } from '@ethersproject/contracts';
import {
	CONTRACT_ADDRESSES,
	isNetworkSelected,
	isTokenSelected,
	makeId,
	serviceAddress,
	useStore
} from '../../helpers';
import CONTRACT_DATA from '../../data/YandaExtendedProtocol.json';
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
			isUserVerified
		}
	} = useStore();
	const isDisabled =
		!validInputs ||
		!isNetworkSelected(destinationNetwork) ||
		!isTokenSelected(destinationToken) ||
		!isUserVerified;

	const { account, chainId, library: web3Provider } = useEthers();
	const contractAddress = CONTRACT_ADDRESSES?.[chainId as keyof typeof CONTRACT_ADDRESSES] || '';
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const contract = new Contract(contractAddress, contractInterface, web3Provider);
	if (web3Provider) {
		contract.connect(web3Provider.getSigner());
	}
	const { send: sendCreateProcess } = useContractFunction(
		// @ts-ignore
		contract,
		'createProcess',
		{ transactionName: 'Request Swap' }
	);
	const { sendTransaction } = useSendTransaction({
		transactionName: 'Deposit'
	});

	useImperativeHandle(ref, () => ({
		async onSubmit() {
			const productId = utils.id(makeId(32));

			const namedValues = {
				scoin: 'GLMR',
				samt: utils.parseEther(amount).toString(),
				fcoin: destinationToken,
				net: destinationNetwork,
				daddr: destinationAddress,
				tag: destinationMemo
			};

			const shortNamedValues = JSON.stringify(namedValues);

			await sendCreateProcess(serviceAddress, productId, shortNamedValues);
			const filter = contract.filters.CostResponse(account, serviceAddress, productId);
			console.log('filter', filter);
			contract.on(filter, (customer, service, productId, cost) => {
				console.log('Oracle deposit estimation:', utils.formatEther(cost));
				void sendTransaction({ to: contractAddress, value: cost });
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
