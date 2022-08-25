import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import Jazzicon from '@metamask/jazzicon';
import { useStore, useBreakpoint, isLightTheme } from '../../helpers';
import { pxToRem, spacing } from '../../styles';
import type { Theme } from '../../styles';

const StyledJazzIcon = styled.div`
	height: ${pxToRem(16)};
	width: ${pxToRem(16)};
`;

const JazzIcon = ({ account }: { account: string }) => {
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
const Account = styled.button`
	background-color: ${(props: StyledProps) => props.theme.icon.default};
	outline: ${(props: StyledProps) => `1px solid ${props.theme.font.pure}`};
	border: 1px solid transparent;
	color: ${(props: StyledProps) => props.theme.font.pure};
	border-radius: ${pxToRem(6)};
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

type Props = {
	balance: string;
	token: string;
	account: string;
};

export const Wallet = ({ balance, token, account }: Props) => {
	const {
		state: { theme }
	} = useStore();
	const { isBreakpointWidth: isMobile } = useBreakpoint('s');

	return isMobile ? (
		<Account theme={theme} onClick={() => alert('here goes your modal, Ali :)')}>
			{account.slice(0, 6)}...{account.slice(account.length - 4, account.length)}
			<JazzIcon account={account} />
		</Account>
	) : (
		<Wrapper theme={theme}>
			<Amount theme={theme}>
				{balance} {token}
			</Amount>
			<Account theme={theme} onClick={() => alert('here goes your modal, Ali :)')}>
				{account.slice(0, 6)}...{account.slice(account.length - 4, account.length)}
				<JazzIcon account={account} />
			</Account>
		</Wrapper>
	);
};
