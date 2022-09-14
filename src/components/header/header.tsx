import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Moonbeam, useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import { ReactComponent as LogoDark } from '../../assets/logo-dark.svg';
import { ReactComponent as LogoLight } from '../../assets/logo-light.svg';
import { ReactComponent as MenuDark } from '../../assets/menu-dark.svg';
import { ReactComponent as MenuLight } from '../../assets/menu-light.svg';
import { ReactComponent as LogoMobile } from '../../assets/logo-mobile.svg';
import { ReactComponent as Sun } from '../../assets/sun.svg';
import { ReactComponent as Moon } from '../../assets/moon.svg';
import type { ApiAuthType, Theme } from '../../styles';
import { darkTheme, lightTheme, mediaQuery, pxToRem, spacing } from '../../styles';
import {
	ButtonEnum,
	defaultBorderRadius,
	getAuthTokensFromNonce,
	initialStorage,
	isLightTheme,
	loadBinanceKycScript,
	LOCAL_STORAGE_AUTH,
	LOCAL_STORAGE_THEME,
	makeBinanceKycCall,
	MOONBEAM_URL,
	routes,
	ThemeEnum,
	useAxios,
	useBreakpoint,
	useLocalStorage,
	useStore,
	VerificationEnum,
	buttonType,
	KycStatusEnum,
	KycEnum
} from '../../helpers';
import type { ColorType } from '../../components';
import { Button, Network, useToasts, Wallet } from '../../components';

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

const ThemeButton = styled.button`
	cursor: pointer;
	background: none;
	border: none;

	&:hover {
		opacity: 0.8;
	}

	&:focus-visible {
		outline-offset: 2px;
		outline: 1px solid ${(props: Props) => props.theme.default};
	}

	&:active {
		outline: none;
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
	border-radius: ${defaultBorderRadius};
	cursor: pointer;
	border: 1px solid
		${(props: Props) => (isLightTheme(props.theme) ? props.theme.default : props.theme.pure)};

	& > li:not(:last-child) {
		margin-bottom: ${pxToRem(16)};
	}
`;

export const Header = () => {
	const { isBreakpointWidth } = useBreakpoint('s');
	const { state, dispatch } = useStore();
	const { theme, buttonStatus, isUserVerified } = state;
	const [storage, setStorage] = useLocalStorage(LOCAL_STORAGE_AUTH, initialStorage);
	// @ts-ignore
	const { addToast } = useToasts();
	const api = useAxios();

	const [showMenu, setShowMenu] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [binanceToken, setBinanceToken] = useState('');
	const [binanceScriptLoaded, setBinanceScriptLoaded] = useState(false);
	const menuRef = useRef<HTMLUListElement | null>(null);

	const isLight = isLightTheme(theme);
	const { activateBrowserWallet, library, account, chainId, switchNetwork } = useEthers();

	const checkNetwork = async () => {
		const NETWORK_PARAMS = [
			{
				chainId: ethers.utils.hexValue(Moonbeam.chainId),
				chainName: Moonbeam.chainName,
				rpcUrls: [MOONBEAM_URL],
				nativeCurrency: {
					name: 'Glimer',
					symbol: 'GLMR',
					decimals: 18
				},
				blockExplorerUrls: ['https://moonscan.io/']
			}
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
			dispatch({ type: ThemeEnum.THEME, payload: JSON.parse(localStorageTheme) as Theme });
		}
	}, []);

	useEffect(() => {
		if (account) {
			dispatch({ type: VerificationEnum.ACCOUNT, payload: true });
		} else {
			dispatch({ type: VerificationEnum.ACCOUNT, payload: false });
		}

		if (chainId) {
			dispatch({ type: VerificationEnum.NETWORK, payload: true });
		} else {
			dispatch({ type: VerificationEnum.NETWORK, payload: false });
			void checkNetwork();
		}
	}, [account, chainId, dispatch]);

	useEffect(() => {
		loadBinanceKycScript(() => {
			setBinanceScriptLoaded(true);
		});
	}, []);

	useEffect(() => {
		if (binanceScriptLoaded && binanceToken) {
			makeBinanceKycCall(binanceToken);
		}
	}, [binanceToken, binanceScriptLoaded]);

	useEffect(() => {
		const checkUsersKycStatus = async () => {
			if (storage.account === account) {
				try {
					const status = await api.get(routes.kycStatus);
					dispatch({
						type: KycEnum.STATUS,
						payload: status.data.statusInfo.kycStatus
					});
				} catch (err: any) {
					console.log('err', err.message);
				}
			}
		};
		void checkUsersKycStatus();
	}, [account, chainId]);

	useEffect(() => {
		if (account && storage.account && storage.account !== account) {
			addToast(
				'Please login to the account that has already passed KYC or check your KYC process again',
				'warning'
			);
			dispatch({ type: ButtonEnum.BUTTON, payload: buttonType.CHECK_KYC }); // TODO: difference between check and pass in UI
			dispatch({ type: KycEnum.STATUS, payload: KycStatusEnum.PROCESS });
			setStorage({ account, isKyced: false, access: '', refresh: '' });
		}
	}, [account]);

	const changeTheme = (): void => {
		const getTheme = isLight ? darkTheme : lightTheme;
		dispatch({ type: ThemeEnum.THEME, payload: getTheme });
		localStorage.setItem(LOCAL_STORAGE_THEME, JSON.stringify(getTheme));
	};

	const handleShowMenu = (): void => {
		if (!showMenu) {
			document.addEventListener('click', handleOutsideClick, { capture: true });
		} else {
			document.removeEventListener('click', handleOutsideClick, {
				capture: true
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

		if (account && chainId && library) {
			try {
				const res: ApiAuthType = await getAuthTokensFromNonce(account, library);
				setStorage({
					account,
					access: res.access,
					refresh: res.refresh,
					isKyced: res.is_kyced
				});
				dispatch({
					type: KycEnum.STATUS,
					payload: res.is_kyced ? KycStatusEnum.PASS : KycStatusEnum.PROCESS
				});
				if (!res.is_kyced) {
					const res = await api.get(routes.kycToken);
					setBinanceToken(res.data.token);
				}
			} catch (err: any) {
				addToast('Oops, Looks like something went wrong. Please reload and try again!');
			}
		}
	};

	return (
		<StyledHeader theme={theme}>
			{isBreakpointWidth ? (
				<LogoMobile style={{ marginRight: 'auto' }} />
			) : isLight ? (
				<LogoLight style={{ marginRight: 'auto' }} />
			) : (
				<LogoDark style={{ marginRight: 'auto' }} />
			)}
			{!isBreakpointWidth && (
				<Button variant="pure" onClick={() => console.log('header')}>
					Transaction History
				</Button>
			)}
			{showModal && <Network showModal={showModal} setShowModal={setShowModal} />}
			{isUserVerified && account ? (
				<Wallet token="GLMR" account={account} />
			) : (
				<Button
					variant="secondary"
					onClick={handleButtonClick}
					color={buttonStatus.color as ColorType}>
					{buttonStatus.text}
				</Button>
			)}

			<ThemeButton theme={theme} onClick={changeTheme}>
				{isLight ? <Moon /> : <Sun />}
			</ThemeButton>
			{/* TODO: do we show this now? */}
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
