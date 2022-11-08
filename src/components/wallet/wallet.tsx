import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Jazzicon from '@metamask/jazzicon';
import { useEtherBalance, useTokenBalance } from '@usedapp/core';
import { formatEther, formatUnits } from '@ethersproject/units';
import {
	beautifyNumbers,
	isLightTheme,
	useBreakpoint,
	useStore,
	NETWORK_TO_ID
} from '../../helpers';
import { pxToRem, spacing, DEFAULT_BORDER_RADIUS } from '../../styles';
import type { Theme } from '../../styles';
import { WalletModal } from '../../components';
import SOURCE_NETWORKS from '../../data/sourceNetworks.json';

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
	border-radius: ${DEFAULT_BORDER_RADIUS};
	display: flex;
	align-items: center;
	margin-left: -1px;
`;

const Amount = styled.div`
	color: ${(props: StyledProps) => props.theme.font.pure};
	padding: ${spacing[6]} ${spacing[14]};
`;
const Account = styled.button`
	background-color: ${(props: StyledProps) => props.theme.icon.default};
	outline: ${(props: StyledProps) => `1px solid ${props.theme.font.pure}`};
	border: 1px solid transparent;
	color: ${(props: StyledProps) => props.theme.font.pure};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	display: flex;
	gap: ${spacing[4]};
	padding: ${(props: StyledProps) => (isLightTheme(props.theme) ? spacing[6] : pxToRem(7))}
		// TODO: mixing spacing & pxToRem is far from ideal
		${spacing[10]};
	cursor: pointer;
	margin-right: -1px;

	&:hover {
		opacity: 0.8;
	}

	&:active {
		outline: none;
	}

	&:focus-visible {
		border: ${(props: StyledProps) => `1px solid ${props.theme.font.pure}`};
	}
`;

export const Wallet = () => {
	const [showModal, setShowModal] = useState(false);
	const openModal = () => setShowModal(!showModal);
	const {
		state: { theme, account, sourceNetwork, sourceToken }
	} = useStore();
	const { isBreakpointWidth: isMobile } = useBreakpoint('s');

	const etherBalance = account && useEtherBalance(account);
	const tokenData =
		// @ts-ignore
		// eslint-disable-next-line
		sourceToken && SOURCE_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.['tokens'][sourceToken];
	const tokenBalance = useTokenBalance(tokenData?.contractAddr, account);
	const balance = tokenData?.isNative
		? etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)
		: tokenBalance && parseFloat(formatUnits(tokenBalance, tokenData?.decimals)).toFixed(3);

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
				{beautifyNumbers({ n: balance ?? '0.0', digits: 3 })} {sourceToken}
			</Amount>
			<Account theme={theme} onClick={openModal}>
				{account.slice(0, 6)}...{account.slice(account.length - 4, account.length)}
				<JazzIcon account={account} />
			</Account>
		</Wrapper>
	);
};
