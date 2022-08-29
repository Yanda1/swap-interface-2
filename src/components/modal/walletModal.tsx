import styled, { css } from 'styled-components';
import { Modal } from './modal';
import { fontSize, mediaQuery, pxToRem, spacing } from '../../styles';
import { Button } from '../button/button';
import { JazzIcon } from '../wallet/wallet';
import { useState } from 'react';
import { ButtonEnum, buttonType, useBreakpoint, useStore } from '../../helpers';
import { useEthers } from '@usedapp/core';

type Props = {
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
	account: string;
	isCopied?: boolean;
};

const ModalWrapper = styled.div`
	margin: ${pxToRem(10)} 0 0 ${pxToRem(26)};

	${mediaQuery('xs')} {
		display: flex;
		flex-direction: column;
	}
`;

const AccountTitle = styled.div
(() => {
	const { state: { theme } } = useStore();

	return css`
		font-size: ${fontSize[16]};
		color: ${theme.font.pure};
		line-height: ${spacing[22]};
		margin: ${pxToRem(16)} 0 ${pxToRem(30)} ${pxToRem(26)};
	`;
});

const AccountWrapper = styled.div`
	display: flex;
	align-items: center;
	font-size: ${fontSize[18]};
	line-height: ${spacing[24]};
	font-weight: 400;
	color: #FFF;
	margin-bottom: ${pxToRem(16)};

	${mediaQuery('xs')} {
		align-items: flex-start;
	}
`;

const Account = styled.div`
	display: inline-flex;
	margin-right: ${pxToRem(70)};

	${mediaQuery('xs')} {
		justify-content: flex-start;
	}
`;

const AccountNumber = styled.div(() => {
	const { state: { theme } } = useStore();

	return css`
		color: ${theme.font.pure};
		margin-right: ${pxToRem(6)};
	`;
});

const CopyContainer = styled.div(({ isCopied }: Props) => {

	const { state: { theme } } = useStore();

	return css`
		display: flex;
		align-items: center;
		cursor: pointer;
		margin-bottom: ${pxToRem(30)};
		color: ${isCopied ? theme.button.default : theme.default};
	`;
});

const IconContainer = styled.div(() => {
	const { state: { theme } } = useStore();

	return css`
		height: 8px;
		width: 10px;
		background-color: transparent;
		border: 1px solid grey;
		transform: rotate(90deg);
		margin-right: ${pxToRem(6)};

		&::after {
			content: '';
			display: block;
			position: relative;
			top: -60%;
			right: -25%;
			height: 8px;
			width: 10px;
			border: 1px solid grey;
			background-color: ${theme.background.mobile};
		}
	`;
});

export const WalletModal = ({ showModal, setShowModal, account }: Props) => {
	console.log(typeof account);
	const { isBreakpointWidth } = useBreakpoint('xs');
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
			<Modal showModal={showModal} setShowModal={setShowModal} background='mobile' width='small'>
				<AccountTitle>Account</AccountTitle>
				<ModalWrapper>
					<div style={{ marginBottom: '6px' }}>Connected with Metamask</div>
					{!isBreakpointWidth ? (
						<>
							<AccountWrapper>
								<Account>
									<AccountNumber>
										{account?.substring(0, 12)}...{account?.substring(37)}
									</AccountNumber>
									<JazzIcon account={account} />
								</Account>
								<Button variant='secondary' onClick={handleDisconnect}>Disconnect</Button>
							</AccountWrapper>
							<CopyContainer onClick={handleCopy} isCopied={isCopied}>
								<IconContainer />
								<p style={{ fontSize: '14px', lineHeight: '19px' }}>{!isCopied ? 'Copy Address' : 'Copied!'}</p>
							</CopyContainer>
						</>) : (
						<>
							<AccountWrapper>
								<Account>
									<AccountNumber>
										{account?.substring(0, 12)}...{account?.substring(37)}
									</AccountNumber>
									<JazzIcon account={account} />
								</Account>
							</AccountWrapper>
							<CopyContainer onClick={handleCopy} isCopied={isCopied}>
								<IconContainer />
								{!isCopied ? 'Copy Address' : 'Copied!'}
							</CopyContainer>
							<Button variant='secondary' onClick={handleDisconnect}>Disconnect</Button>
						</>)}
				</ModalWrapper>
			</Modal>
		</>
	);
};
