import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Moonbeam, useEtherBalance, useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import { ReactComponent as LogoDark } from '../../assets/logo-dark.svg';
import { ReactComponent as LogoLight } from '../../assets/logo-light.svg';
import { ReactComponent as MenuDark } from '../../assets/menu-dark.svg';
import { ReactComponent as MenuLight } from '../../assets/menu-light.svg';
import { ReactComponent as LogoMobile } from '../../assets/logo-mobile.svg';
import { ReactComponent as Sun } from '../../assets/sun.svg';
import { ReactComponent as Moon } from '../../assets/moon.svg';
import type { Theme } from '../../styles';
import { darkTheme, lightTheme, mediaQuery, pxToRem, spacing } from '../../styles';
import {
	isLightTheme,
	loadBinanceKycScript,
	LOCAL_STORAGE_AUTH,
	LOCAL_STORAGE_THEME,
	makeBinanceKycCall,
	MOONBEAM_URL,
	ThemeEnum,
	useBreakpoint,
	useKyc,
	useLocalStorage,
	useStore,
	VerificationEnum
} from '../../helpers';
import type { ColorType } from '../../components';
import { Button } from '../../components';

type Props = {
	theme: Theme;
};

const StyledHeader = styled.header`
	display: flex;
	align-items: center;
	gap: ${pxToRem(16)};
	height: ${pxToRem(63)};
	margin-bottom: ${pxToRem(67.5)};

	${mediaQuery('s')} {
		height: ${pxToRem(55)};
		gap: ${pxToRem(24)};
		margin-bottom: ${pxToRem(39.5)};
	}
`;

const Icon = styled.div`
	cursor: pointer;

	&:hover {
		opacity: 0.8;
	}
`;

const Menu = styled.ul`
	position: fixed;
	top: ${spacing[56]};
	right: ${spacing[14]};
	max-width: calc(100vw - ${pxToRem(28)});
	background: ${(props: Props) => props.theme.background.default};
	text-align: right;
	padding: ${spacing[14]};
	border-radius: ${pxToRem(6)};
	cursor: pointer;
	border: 1px solid ${(props: Props) => (props.theme.name === 'light' ? props.theme.default : props.theme.pure)};

	& > li:not(:last-child) {
		margin-bottom: ${pxToRem(16)};
	}
`;

export const Header = () => {
	const { isBreakpointWidth } = useBreakpoint('s');
	const { state, dispatch } = useStore();
	const { theme, buttonStatus } = state;
	const [showMenu, setShowMenu] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const isLight = isLightTheme(theme);
	const menuRef = useRef<HTMLUListElement | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { activateBrowserWallet, library, account, chainId, switchNetwork } = useEthers();
	const etherBalance = useEtherBalance(account);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [storage, setStorage] = useLocalStorage(LOCAL_STORAGE_AUTH, null); // TODO: check logic for default value

	const [authToken, setAuthToken] = useState('');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { kycStatus, kycToken } = useKyc(authToken);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [fireBinanceCall, setFireBinanceCall] = useState(false);
	const [kycScriptLoaded, setKycScriptLoaded] = useState(false);
	const shouldMakeBinanceCall = kycToken && kycScriptLoaded && fireBinanceCall;

	const checkNetwork = async () => {
		const NETWORK_PARAMS = [
			{
				chainId:ethers.utils.hexValue(Moonbeam.chainId),
				chainName:Moonbeam.chainName,
				rpcUrls:[MOONBEAM_URL],
				nativeCurrency:{
					name:'Glimer',
					symbol:'GLMR',
					decimals:18,
				},
				blockExplorerUrls:['https://moonscan.io/'],
			},
		];

		if (!chainId) {
			await switchNetwork(Moonbeam.chainId);
			if (chainId !== Moonbeam.chainId && library) {
				await library.send('wallet_addEthereumChain', NETWORK_PARAMS);
			}
		}
	};

	useEffect(() => {
		const localStorageTheme = localStorage.getItem(LOCAL_STORAGE_THEME);
		if (localStorageTheme) {
			dispatch({ type:ThemeEnum.THEME, payload:JSON.parse(localStorageTheme) as Theme });
		}
	}, []);

	useEffect(() => {
		if (account) {
			dispatch({ type:VerificationEnum.ACCOUNT, payload:true });
		} else {
			dispatch({ type:VerificationEnum.ACCOUNT, payload:false });
		}

		if (chainId) {
			dispatch({ type:VerificationEnum.NETWORK, payload:true });
		} else {
			dispatch({ type:VerificationEnum.NETWORK, payload:false });
			void checkNetwork();
		}
	}, [account, chainId, dispatch]);

	useEffect(() => {
		loadBinanceKycScript(() => {
			setKycScriptLoaded(true);
		});

		if (shouldMakeBinanceCall) makeBinanceKycCall(kycToken);
		// eslint-disable-next-line
	}, [shouldMakeBinanceCall]);

	const changeTheme = (): void => {
		const getTheme = isLight ? darkTheme : lightTheme;
		dispatch({ type:ThemeEnum.THEME, payload:getTheme });
		localStorage.setItem(LOCAL_STORAGE_THEME, JSON.stringify(getTheme));
	};

	const handleShowMenu = (): void => {
		if (!showMenu) {
			document.addEventListener('click', handleOutsideClick, { capture:true });
		} else {
			document.removeEventListener('click', handleOutsideClick, {
				capture:true
			});
		}
		setShowMenu((showMenu) => !showMenu);
	};

	const handleOutsideClick = (e: any): void => {
		if (menuRef.current) {
			// eslint-disable-next-line
			if (!menuRef.current.contains(e.target)) handleShowMenu();
		}
	};

	const handleButtonClick = async () => {
		if (!account) {
			try {
				activateBrowserWallet();
			} catch (error) {
				setShowModal(true);
			}
		}

		if (!chainId) {
			await checkNetwork();
		}
	};

	return (
		<StyledHeader theme={theme}>
			{isBreakpointWidth ? (
				<LogoMobile style={{ marginRight:'auto' }} />
			) : isLight ? (
				<LogoLight style={{ marginRight:'auto' }} />
			) : (
				<LogoDark style={{ marginRight:'auto' }} />
			)}
			{!isBreakpointWidth && (
				<Button variant="pure" onClick={() => console.log('hedader')}>
					Transaction History
				</Button>
			)}
			<Button variant="secondary" onClick={handleButtonClick}
							color={buttonStatus.color as ColorType}>
				{buttonStatus.text}
			</Button>

			<button onClick={changeTheme} style={{ border:'none', background:'none' }}>
				<Icon>{isLight ? <Moon /> : <Sun />}</Icon>
			</button>

			{isBreakpointWidth &&
				(isLight ? <MenuLight onClick={handleShowMenu} /> : <MenuDark onClick={handleShowMenu} />)}
			{showMenu && (
				<Menu theme={theme} ref={menuRef}>
					<li>Transaction History</li>
					<li>Change Network</li>
					<li>Logout</li>
				</Menu>
			)}
			{showModal && <div>Modal</div>}
		</StyledHeader>
	);
};
