import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styled from 'styled-components';
import CONTRACT_DATA from '../../data/YandaExtendedProtocol.json';
import { useContractFunction, useEthers } from '@usedapp/core';
import { utils } from 'ethers';
import { Button } from '..';
import { Contract } from '@ethersproject/contracts';
import type { ContractAdress } from '../../helpers';
import {
	CONTRACT_ADDRESSES,
	isNetworkSelected,
	isTokenSelected,
	makeId,
	PairEnum,
	ProductIdEnum,
	SERVICE_ADDRESS,
	useStore
} from '../../helpers';
import { spacing } from '../../styles';
import { useLocalStorage } from '../../hooks';

const ButtonWrapper = styled.div`
	margin-top: ${spacing[28]};
`;

type Props = {
	validInputs: boolean;
	amount: string;
	onClick: () => void;
};

export const SwapButton = forwardRef(({ validInputs, amount, onClick }: Props, ref) => {
	const { dispatch } = useStore();
	const {
		state: {
			destinationNetwork,
			destinationToken,
			destinationAddress,
			destinationMemo,
			isUserVerified,
			destinationAmount,
			productId
		}
	} = useStore();
	const isDisabled =
		!validInputs ||
		!isNetworkSelected(destinationNetwork) ||
		!isTokenSelected(destinationToken) ||
		!isUserVerified ||
		Number(destinationAmount) < 0;

	const { chainId, library: web3Provider } = useEthers();
	const contractAddress = CONTRACT_ADDRESSES?.[chainId as ContractAdress] || '';
	const contractInterface = new utils.Interface(CONTRACT_DATA.abi);
	const contract = new Contract(contractAddress, contractInterface, web3Provider);
	if (web3Provider) {
		contract.connect(web3Provider.getSigner());
	}
	const { send: sendCreateProcess, state: transactionSwapState } = useContractFunction(
		// @ts-ignore
		contract,
		'createProcess',
		{ transactionName: 'Request Swap' }
	);

	const [swapsStorage, setSwapsStorage] = useLocalStorage('swaps', []);
	const [transactionState, setTransactionState] = useState<{
		status: string;
		errorMessage: string;
	}>({
		status: '',
		errorMessage: ''
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
			dispatch({ type: ProductIdEnum.PRODUCTID, payload: productId });
			const shortNamedValues = JSON.stringify(namedValues);
			dispatch({ type: PairEnum.PAIR, payload: `GLMR ${destinationToken}` });
			await sendCreateProcess(SERVICE_ADDRESS, productId, shortNamedValues);
		}
	}));

	useEffect(() => {
		if (transactionSwapState.status !== 'None' && transactionSwapState.errorMessage) {
			setTransactionState({
				...transactionState,
				status: transactionSwapState.status,
				errorMessage: transactionSwapState.errorMessage
			});
		}
	}, [transactionSwapState]);

	useEffect(() => {
		if (
			transactionState.status === 'Exception' &&
			transactionState.errorMessage === 'user rejected transaction'
		) {
			if (swapsStorage) {
				const copySwapsStorage = [...swapsStorage];
				copySwapsStorage.splice(copySwapsStorage[productId as any], 1);
				setSwapsStorage(copySwapsStorage);
				dispatch({ type: ProductIdEnum.PRODUCTID, payload: '' });
				setTransactionState({ status: '', errorMessage: '' });
			}
		}
	}, [transactionState]);

	return (
		<ButtonWrapper>
			<Button disabled={isDisabled} color="default" onClick={onClick}>
				SWAP
			</Button>
		</ButtonWrapper>
	);
});
