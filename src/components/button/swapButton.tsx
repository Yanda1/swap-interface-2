import { forwardRef, useImperativeHandle } from 'react';
import { useEthers, useContractFunction, useSendTransaction } from '@usedapp/core';
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
	hasMemo: boolean;
	amount: string;
	onSubmit: () => void;
};

export const SwapButton = forwardRef(({ hasMemo, amount, onSubmit }: Props, ref) => {
	const { account, chainId, library: web3Provider } = useEthers();
	// const toast = useToast();
	// @ts-ignore
	const contractAddress = CONTRACT_ADDRESSES[chainId];
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const contract = new Contract(contractAddress, contractInterface, web3Provider);
	if (web3Provider) {
		contract.connect(web3Provider.getSigner());
	}
	const { send: sendCreateProcess } = useContractFunction(
		// TODO: add state for logs?
		// @ts-ignore
		contract,
		'createProcess',
		{ transactionName: 'Request Swap' }
	);
	const { sendTransaction } = useSendTransaction({
		// TODO: add state for logs?
		transactionName: 'Deposit'
	});

	const {
		state: { destinationNetwork, destinationToken, destinationAddress, destinationMemo },
		dispatch
	} = useStore();
	const isDisabled =
		!isNetworkSelected(destinationNetwork) ||
		!isTokenSelected(destinationToken) ||
		!amount ||
		!destinationAddress ||
		(hasMemo && !destinationMemo);

	useImperativeHandle(ref, () => ({
		async onSubmit() {
			const productId = utils.id(makeId(32));

			const namedValues = {
				scoin: 'GLMR',
				samt: utils.parseEther(amount).toString(),
				fcoin: destinationToken,
				net: destinationNetwork,
				daddr: destinationAddress
			};

			const shortNamedValues = JSON.stringify(namedValues);

			await sendCreateProcess(serviceAddress, productId, shortNamedValues);
			const filter = contract.filters.CostResponse(account, serviceAddress, productId);
			console.log('filter', filter);
			contract.on(filter, (cost) => {
				console.log('Oracle deposit estimation:', utils.formatEther(cost));
				void sendTransaction({ to: contractAddress, value: cost });
			});
		}
	}));

	return (
		<ButtonWrapper>
			<Button onClick={onSubmit} disabled={isDisabled} color="default">
				SWAP
			</Button>
		</ButtonWrapper>
	);
});
