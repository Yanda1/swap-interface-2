import { Portal } from '../../components';
import { SelectList } from '../selectList/selectList';
import { Button } from '../button/button';
import styled from 'styled-components';
import { fontSize, pxToRem, spacing } from '../../styles';

type Props = {
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
};

const ModalContainer = styled.div`
	display: flex;
	flex-direction: column;
	font-size: ${fontSize[16]};
	line-height: ${spacing[22]};
	font-weight: 400;
	color: #fff;
	padding: ${pxToRem(54)} ${pxToRem(88)} ${pxToRem(60)};
`;

const SelectWrapper = styled.div`
	padding: 0 ${pxToRem(105)};
	margin-bottom: ${pxToRem(32)};
`;

export const Network = ({ showModal, setShowModal }: Props) => {
	const handleClick = () => {
		setShowModal(!showModal);
	};

	return (
		<Portal handleClose={() => setShowModal(false)} isOpen={showModal}>
			<ModalContainer>
				<SelectWrapper>
					<SelectList
						data={['Metamask', 'WalletConnect', 'Ledger']}
						placeholder="Wallet Name"
						value="WALLET"
					/>
				</SelectWrapper>
				<Button onClick={handleClick}>Select</Button>
			</ModalContainer>
		</Portal>
	);
};
