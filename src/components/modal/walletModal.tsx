import styled, { css } from 'styled-components';
import { Modal } from './modal';
import { fontSize, fontWeight, mediaQuery, pxToRem, spacing } from '../../styles';
import { Button } from '../button/button';
import { JazzIcon } from '../wallet/wallet';
import { useState } from 'react';
import { ButtonEnum, buttonType, useStore } from '../../helpers';
import { useEthers } from '@usedapp/core';

type Props = {
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
	account: string;
	isCopied?: boolean;
};

const ModalWrapper = styled.div`
	display: flex;
	align-items: center;
	column-gap: ${spacing[60]};
	padding: ${spacing[18]} ${spacing[46]} 0 ${spacing[26]};

	${mediaQuery('xs')} {
		flex-direction: column;
		align-items: flex-start;
		padding: ${spacing[18]} ${spacing[46]} 0 ${spacing[14]};
		margin-bottom: ${spacing[8]};
	}
`;

const ModalContainer = styled.div``;

const AccountTitle = styled.div
(() => {
	const { state: { theme } } = useStore();

	return css`
		font-size: ${fontSize[16]};
		color: ${theme.font.pure};
		line-height: ${fontSize[22]};
		margin-bottom: ${spacing[28]};
	`;
});

const StatusContainer = styled.div`
	margin-bottom: ${spacing[6]};
`;

const CopyContainer = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;

	${mediaQuery('xs')} {
		margin-bottom: ${spacing[16]};
	}
`;

const Account = styled.div`
	display: inline-flex;
	font-size: ${fontSize[18]};
	font-weight: ${fontWeight['regular']};
	line-height: ${fontSize[26]};

	${mediaQuery('xs')} {
		justify-content: flex-start;
	}
`;

const AccountNumber = styled.div(() => {
	const { state: { theme } } = useStore();

	return css`
		color: ${theme.font.pure};
		margin-right: ${spacing[6]};
	`;
});

const IconContainer = styled.div(() => {
	const { state: { theme } } = useStore();

	return css`
		height: ${pxToRem(8)};
		width: ${pxToRem(10)};
		background-color: ${theme.button.transparent};
		border: 1px solid ${theme.default};
		transform: rotate(90deg);
		margin-right: ${spacing[6]};

		&::after {
			content: '';
			display: block;
			position: relative;
			top: -60%;
			right: -25%;
			height: ${pxToRem(8)};
			width: ${pxToRem(10)};
			border: 1px solid ${theme.default};
			background-color: ${theme.background.mobile};
		}
	`;
});

const CopyText = styled.p.attrs((props: { isCopied: boolean }) => props)`
	opacity: ${(props) => props.isCopied ? '0.5' : '1'};;
	font-size: ${fontSize[14]};
	line-height: ${fontSize[20]};
`;

export const WalletModal = ({ showModal, setShowModal, account }: Props) => {
	const { deactivate } = useEthers();
	const { dispatch } = useStore();
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = () => {
		setIsCopied(true);
		void navigator.clipboard.writeText(account);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};

	const handleDisconnect = () => {
		deactivate();
		setShowModal(false);
		dispatch({
			type: ButtonEnum.BUTTON,
			payload: buttonType.CONNECT_WALLET
		});
	};

	return (
		<>
			<Modal showModal={showModal} setShowModal={setShowModal} background='default' width='small'>
				<ModalWrapper>
					<ModalContainer>
						<AccountTitle>Account</AccountTitle>
						<StatusContainer>Connected with Metamask</StatusContainer>
						<Account>
							<AccountNumber>
								{account?.substring(0, 12)}...{account?.substring(37)}
							</AccountNumber>
							<JazzIcon account={account} />
						</Account>
						<CopyContainer>
							<IconContainer />
							<CopyText onClick={handleCopy} isCopied={isCopied}>{!isCopied ? 'Copy Address' : 'Copied!'}</CopyText>
						</CopyContainer>
					</ModalContainer>
					<Button variant='secondary' onClick={handleDisconnect}>Disconnect</Button>
				</ModalWrapper>
			</Modal>
		</>
	);
};
