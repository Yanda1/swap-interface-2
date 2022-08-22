import { useEffect, useState } from 'react';
import styled from 'styled-components';
import destinationNetworks from '../../data/destinationNetworks.json';
import { Button } from '..';
import { spacing } from '../../styles';
import { SelectList } from '../../components';
import { Modal } from './modal';
import { useStore } from '../../helpers';

const ChildWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin: ${spacing[56]} 0;
	justify-content: center;
	column-gap: ${spacing[28]};
	row-gap: ${spacing[22]};
`;

type Props = {
	showModal: boolean;
	setShowModal: (prev: boolean) => void;
};

export const NetworkTokenModal = ({ showModal, setShowModal }: Props) => {
	const [isDisabled, setIsDisabled] = useState(true);
	const {
		state: { destinationNetwork, destinationToken }
	} = useStore();

	useEffect(() => {
		setIsDisabled(
			() => destinationNetwork === 'Select Network' || destinationToken === 'Select Token'
		);
	}, [destinationNetwork, destinationToken]);

	const networks = Object.keys(destinationNetworks);
	const tokens =
		destinationNetwork !== 'Select Network' &&
		// @ts-ignore
		Object.keys(destinationNetworks?.[destinationNetwork]['tokens']);

	return (
		<Modal showModal={showModal} setShowModal={setShowModal} background="mobile">
			<ChildWrapper>
				<SelectList
					value="NETWORK"
					data={networks}
					title="Select Network"
					placeholder="Network Name"
				/>
				<SelectList value="TOKEN" data={tokens} title="Select Token" placeholder="Token Name" />
				<Button disabled={isDisabled} onClick={() => setShowModal(!showModal)}>
					{isDisabled ? 'Please select Network and Token' : 'Select'}
				</Button>
			</ChildWrapper>
		</Modal>
	);
};
