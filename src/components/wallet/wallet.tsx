import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Jazzicon from '@metamask/jazzicon';
import { useEtherBalance, useTokenBalance, useEthers } from '@usedapp/core';
import { formatEther, formatUnits } from '@ethersproject/units';
import { beautifyNumbers, useStore, NETWORK_TO_ID, isTokenSelected } from '../../helpers';
import {
	pxToRem,
	spacing,
	DEFAULT_BORDER_RADIUS,
	DEFAULT_TRANSIITON,
	mediaQuery,
	DEFAULT_OUTLINE_OFFSET,
	DEFAULT_OUTLINE
} from '../../styles';
import type { Theme } from '../../styles';
import { useMedia } from '../../hooks';
import { WalletModal } from '../../components';
import SOURCE_NETWORKS from '../../data/sourceNetworks.json';

const StyledJazzIcon = styled.div`
	height: ${pxToRem(16)};
	width: ${pxToRem(16)};
`;

export const JazzIcon = () => {
	const ref = useRef<HTMLDivElement>();
	const { account } = useEthers();

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
	display: flex;
`;

const Amount = styled.div`
	border: ${(props: StyledProps) => `1px solid ${props.theme.border.default}`};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	padding: ${spacing[6]} ${spacing[18]} ${spacing[6]} ${spacing[14]};
	margin-right: -${spacing[8]};
`;
const Account = styled.button`
	background-color: ${(props: StyledProps) => props.theme.background.secondary};
	color: ${(props: StyledProps) => props.theme.font.default};
	border: ${(props: StyledProps) => `1px solid ${props.theme.border.secondary}`};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	padding: ${spacing[6]} ${spacing[14]};
	outline: 1px solid transparent;
	display: flex;
	align-items: center;
	gap: ${spacing[4]};
	transition: ${DEFAULT_TRANSIITON};
	cursor: pointer;

	${mediaQuery('s')} {
		border-color: ${(props: StyledProps) => props.theme.font.default};
	}

	&:hover {
		outline: ${(props: StyledProps) => `1px solid ${props.theme.border.secondary}`};
	}

	&:active {
		outline: none;
	}

	&:focus-visible {
		outline-offset: ${DEFAULT_OUTLINE_OFFSET};
		outline: ${(props: StyledProps) => DEFAULT_OUTLINE(props.theme)};
	}
`;

export const Wallet = () => {
	const [showModal, setShowModal] = useState(false);
	const openModal = () => setShowModal(!showModal);
	const {
		state: { theme, account, sourceNetwork, sourceToken }
	} = useStore();
	const { mobileWidth: isMobile } = useMedia('s');

	const etherBalance = account && useEtherBalance(account);
	const tokenData =
		// @ts-ignore
		sourceToken && SOURCE_NETWORKS[[NETWORK_TO_ID[sourceNetwork]]]?.['tokens'][sourceToken];
	const tokenBalance = useTokenBalance(tokenData?.contractAddr, account);
	const balance = tokenData?.isNative
		? etherBalance && formatEther(etherBalance)
		: tokenBalance && formatUnits(tokenBalance, tokenData?.decimals);

	return isMobile ? (
		<>
			<WalletModal showModal={showModal} setShowModal={setShowModal} account={account} />
			<Account theme={theme} onClick={openModal}>
				{account.slice(0, 6)}...{account.slice(account.length - 4, account.length)}
				<JazzIcon />
			</Account>
		</>
	) : (
		<Wrapper theme={theme}>
			<WalletModal showModal={showModal} setShowModal={setShowModal} account={account} />
			{isTokenSelected(sourceToken) && (
				<Amount theme={theme}>
					{beautifyNumbers({ n: balance ?? '0.0', digits: 3 })} {sourceToken}
				</Amount>
			)}
			<Account theme={theme} onClick={openModal}>
				{account.slice(0, 6)}...{account.slice(account.length - 4, account.length)}
				<JazzIcon />
			</Account>
		</Wrapper>
	);
};
