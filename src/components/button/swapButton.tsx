import { forwardRef, useImperativeHandle } from 'react';
import { useEthers, useContractFunction, useSendTransaction } from '@usedapp/core';
import { utils } from 'ethers';
import { Button } from '..';
import { Contract } from '@ethersproject/contracts';
import { CONTRACT_ADDRESSES, makeId, serviceAddress, useStore } from '../../helpers';
import CONTRACT_DATA from '../../data/YandaExtendedProtocol.json';

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
	const { state: createState, send: sendCreateProcess } = useContractFunction(
		// @ts-ignore
		contract,
		'createProcess',
		{ transactionName: 'Request Swap' }
	);
	const { sendTransaction, state: depositState } = useSendTransaction({
		transactionName: 'Deposit'
	});

	const {
		state: { destinationNetwork, destinationToken, destinationAddress, destinationMemo },
		dispatch
	} = useStore();
	const isDisabled =
		destinationNetwork === 'Select Network' ||
		destinationToken === 'Select Token' ||
		!amount ||
		!destinationAddress ||
		(hasMemo && !destinationMemo);

	// console.log('depositState.status', depositState.status);
	// console.log('createStatus.status', createState.status);

	// useEffect(() => {
	// 	if (createState.status.toString() == 'Mining') {
	// 		toast({
	// 			title: 'Waiting',
	// 			description: 'Transaction is mining at this moment, soon it will be confirmed...',
	// 			status: 'info',
	// 			duration: 9000,
	// 			isClosable: true
	// 		});
	// 	} else if (createState.status.toString() == 'Success') {
	// 		toast({
	// 			title: 'Confirmation',
	// 			description: 'Swap request was successfully sent.\nNow waiting for a deposit approval...',
	// 			status: 'success',
	// 			duration: 9000,
	// 			isClosable: true
	// 		});
	// 	} else if (createState.status.toString() == 'Exception') {
	// 		toast({
	// 			title: 'Something went wrong',
	// 			description:
	// 				"Looks like transaction wasn't signed and/or sent, \nplease try again if you didn't rejected it by yourself.",
	// 			status: 'error',
	// 			duration: 9000,
	// 			isClosable: true
	// 		});
	// 	}
	// }, [createState]);
	// useEffect(() => {
	// 	if (depositState.status.toString() == 'Mining') {
	// 		toast({
	// 			title: 'Waiting',
	// 			description: 'Transaction is mining at this moment, soon it will be confirmed...',
	// 			status: 'info',
	// 			duration: 9000,
	// 			isClosable: true
	// 		});
	// 	} else if (depositState.status.toString() == 'Success') {
	// 		toast({
	// 			title: 'Confirmation',
	// 			description:
	// 				'Your deposit have reached the contract.\nNow waiting for a broker to make the swap...',
	// 			status: 'success',
	// 			duration: 9000,
	// 			isClosable: true
	// 		});
	// 	} else if (depositState.status.toString() == 'Exception') {
	// 		toast({
	// 			title: 'Something went wrong',
	// 			description:
	// 				"Looks like transaction wasn't signed and/or sent, \nplease try again if you didn't rejected it by yourself.",
	// 			status: 'error',
	// 			duration: 9000,
	// 			isClosable: true
	// 		});
	// 	}
	// }, [depositState]);

	useImperativeHandle(ref, () => ({
		async onSubmit() {
			const productId = utils.id(makeId(32));
			// const shortNamedValues = JSON.stringify({
			//   'scoin': 'GLMR',
			//   'samt': utils.parseEther(amount).toString(),
			//   'fcoin': destCurrency,
			//   'net': destNetwork,
			//   'daddr': destAddr,
			//   // 'tag': '',
			// });

			const namedValues = {
				scoin: 'GLMR',
				samt: utils.parseEther(amount).toString(),
				fcoin: destinationToken,
				net: destinationNetwork,
				daddr: destinationAddress
			};

			// if (tag) {
			// 	namedValues.tag = tag;
			// }

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
		<Button onClick={onSubmit} disabled={isDisabled} color="default">
			SWAP
		</Button>
	);
});
