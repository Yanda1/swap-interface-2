import { forwardRef, useImperativeHandle } from 'react';
import { useContractFunction, useEthers } from '@usedapp/core';
import styled from 'styled-components';
import CONTRACT_DATA from '../../data/YandaMultitokenProtocolV1.json';
import SOURCE_NETWORKS from '../../data/sourceNetworks.json';
import { utils } from 'ethers';
import { Button } from '..';
import { Contract } from '@ethersproject/contracts';
import type { ContractAdress } from '../../helpers';
import {
	CONTRACT_ADDRESSES,
	isTokenSelected,
	makeId,
	PairEnum,
	ProductIdEnum,
	SERVICE_ADDRESS,
	useStore,
	NETWORK_TO_ID
} from '../../helpers';
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
			sourceNetwork,
			sourceToken,
			destinationNetwork,
			destinationToken,
			destinationAddress,
			destinationMemo,
			isUserVerified,
			destinationAmount
		},
		dispatch
	} = useStore();
	const isDisabled =
		!validInputs ||
		!isTokenSelected(sourceToken) ||
		!isTokenSelected(destinationToken) ||
		!isUserVerified ||
		+destinationAmount < 0;

	const { chainId, library: web3Provider } = useEthers();
	const sourceTokenData =
		// @ts-ignore
		// eslint-disable-next-line
		SOURCE_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.['tokens'][sourceToken];

	const protocolAddress = CONTRACT_ADDRESSES?.[chainId as ContractAdress] || '';
	const protocolInterface = new utils.Interface(CONTRACT_DATA.abi);
	const protocol = new Contract(protocolAddress, protocolInterface, web3Provider);
	if (web3Provider) {
		protocol.connect(web3Provider.getSigner());
	}

	const { send: sendCreateProcess } = useContractFunction(
		// @ts-ignore
		protocol,
		'createProcess(address,bytes32,string)',
		{
			transactionName: 'Request Swap',
			gasLimitBufferPercentage: 25
		}
	);
	const { send: sendTokenCreateProcess } = useContractFunction(
		// @ts-ignore
		protocol,
		'createProcess(address,address,bytes32,string)',
		{
			transactionName: 'Request Swap',
			gasLimitBufferPercentage: 25
		}
	);

	useImperativeHandle(ref, () => ({
		async onSubmit() {
			const productId = utils.id(makeId(32));

			const namedValues = {
				scoin: sourceToken,
				samt: utils.parseUnits(amount, sourceTokenData?.decimals).toString(),
				fcoin: destinationToken,
				net: destinationNetwork,
				daddr: destinationAddress,
				tag: destinationMemo
			};
			dispatch({ type: ProductIdEnum.PRODUCTID, payload: productId });
			const shortNamedValues = JSON.stringify(namedValues);
			dispatch({ type: PairEnum.PAIR, payload: `${sourceToken} ${destinationToken}` });

			if (sourceTokenData?.isNative) {
				await sendCreateProcess(SERVICE_ADDRESS, productId, shortNamedValues);
			} else {
				console.log(
					'Calling sendTokenCreateProcess with the contractAddr',
					sourceTokenData?.contractAddr
				);
				await sendTokenCreateProcess(
					sourceTokenData?.contractAddr,
					SERVICE_ADDRESS,
					productId,
					shortNamedValues
				);
			}
		}
	}));

	return (
		<ButtonWrapper>
			<Button disabled={isDisabled} color="default" onClick={onClick}>
				Swap
			</Button>
		</ButtonWrapper>
	);
});
