import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Jazzicon from '@metamask/jazzicon';
import { isLightTheme, useBreakpoint, useStore } from '../../helpers';
import type { Theme } from '../../styles';
import { pxToRem, spacing } from '../../styles';
import { WalletModal } from '../modal/walletModal';

const StyledJazzIcon = styled.div`
	height: ${pxToRem(16)};
	width: ${pxToRem(16)};
`;

export const JazzIcon = ({ account }: { account: string }) => {
	const ref = useRef<HTMLDivElement>();

	useEffect(() => {
		if (account && ref.current) {
			ref.current.innerHTML = '';
			ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)));
		}
	}, [account]);

	return <StyledJazzIcon ref={ref as any} />;
};

type StyledProps = {
	theme: Theme;
};

const Wrapper = styled.div`
	border: ${(props: StyledProps) => `1px solid ${props.theme.button.wallet}`};
	border-radius: ${pxToRem(6)};
	display: flex;
	align-items: center;
	margin-left: -1px;
`;

const Amount = styled.div`
	color: ${(props: StyledProps) => props.theme.font.pure};
	padding: ${spacing[6]} ${spacing[14]};
`;
const Account = styled.div`
	background-color: ${(props: StyledProps) => props.theme.icon.default};
	outline: ${(props: StyledProps) => `1px solid ${props.theme.font.pure}`};
	border: 1px solid transparent;
	color: ${(props: StyledProps) => props.theme.font.pure};
	border-radius: ${pxToRem(6)};
	display: flex;
	gap: ${spacing[4]};
	padding: ${(props: StyledProps) => (isLightTheme(props.theme) ? spacing[6] : pxToRem(7))} // TODO: mixing spacing & pxToRem is far from ideal
	${spacing[10]};
	cursor: pointer;
	margin-right: -1px;
`;

type Props = {
	balance: string;
	token: string;
	account: string;
};

export const Wallet = ({ balance, token, account }: Props) => {
	const [showModal, setShowModal] = useState(false);
	const openModal = () => setShowModal(!showModal);
	const {
		state: { theme }
	} = useStore();
	const { isBreakpointWidth: isMobile } = useBreakpoint('s');

	return isMobile ? (
		<>
			<WalletModal showModal={showModal} setShowModal={setShowModal} account={account} />
			<Account theme={theme} onClick={openModal}>
				{account.slice(0, 6)}...{account.slice(account.length - 4, account.length)}
				<JazzIcon account={account} />
			</Account>
		</>
	) : (
		<Wrapper theme={theme}>
			<WalletModal showModal={showModal} setShowModal={setShowModal} account={account} />
			<Amount theme={theme}>
				{balance} {token}
			</Amount>
			<Account theme={theme} onClick={openModal}>
				{account.slice(0, 6)}...{account.slice(account.length - 4, account.length)}
				<JazzIcon account={account} />
			</Account>
		</Wrapper>
	);
};
