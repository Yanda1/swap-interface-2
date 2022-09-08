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
import type { Theme } from '../../styles';
import { darkTheme, lightTheme, mediaQuery, pxToRem, spacing } from '../../styles';
import {
	apiCall,
	BASE_URL,
	ButtonEnum,
	buttonType,
	defaultBorderRadius,
	getAuthTokensFromNonce,
	isLightTheme,
	KycEnum,
	KycStatusEnum,
	loadBinanceKycScript,
	LOCAL_STORAGE_AUTH,
	LOCAL_STORAGE_THEME,
	makeBinanceKycCall,
	MOONBEAM_URL,
	ThemeEnum,
	useBreakpoint,
	useLocalStorage,
	useStore,
	VerificationEnum
} from '../../helpers';
import type { ColorType } from '../../components';
import { Button, Network, useToasts, Wallet } from '../../components';
import axios from 'axios';

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
	border: 1px solid ${(props: Props) => (isLightTheme(props.theme) ? props.theme.default : props.theme.pure)};

	& > li:not(:last-child) {
		margin-bottom: ${pxToRem(16)};
	}
`;

export const Header = () => {
	const {isBreakpointWidth} = useBreakpoint('s');
	const {state, dispatch} = useStore();
	const {theme, buttonStatus, isUserVerified} = state;
	const [storage, setStorage] = useLocalStorage(LOCAL_STORAGE_AUTH); // TODO: check logic for default value
	// @ts-ignore
	const {addToast} = useToasts();

	const [showMenu, setShowMenu] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [authToken, setAuthToken] = useState('');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [kycScriptLoaded, setKycScriptLoaded] = useState(false);
	const menuRef = useRef<HTMLUListElement | null>(null);

	const isLight = isLightTheme(theme);
	const {activateBrowserWallet, library, account, chainId, switchNetwork} = useEthers();

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
			dispatch({type: ThemeEnum.THEME, payload: JSON.parse(localStorageTheme) as Theme});
		}
	}, []);

	useEffect(() => {
		if (account) {
			dispatch({type: VerificationEnum.ACCOUNT, payload: true});
		} else {
			dispatch({type: VerificationEnum.ACCOUNT, payload: false});
		}

		if (chainId) {
			dispatch({type: VerificationEnum.NETWORK, payload: true});
		} else {
			dispatch({type: VerificationEnum.NETWORK, payload: false});
			void checkNetwork();
		}
	}, [account, chainId, dispatch]);

	useEffect(() => {
		loadBinanceKycScript(() => {
			setKycScriptLoaded(true);
		});
	}, []);

	useEffect(() => {
		const checkUsersKycStatus = async (): Promise<void> => {
			if (account && chainId && !storage) {
				dispatch({
					type: ButtonEnum.BUTTON,
					payload: buttonType.PASS_KYC
				});
			}

			if (account && chainId && storage) {
				// @ts-ignore
				if (account !== storage?.account) {
					dispatch({
						type: ButtonEnum.BUTTON,
						payload: buttonType.PASS_KYC
					});
					dispatch({type: VerificationEnum.USER, payload: false});
					addToast(
						'Please sign in with the account that has already passed KYC or start the KYC process again'
						, 'warning');
				} else {
					// @ts-ignore
					if (storage.isKyced) {
						dispatch({type: KycEnum.STATUS, payload: KycStatusEnum.PASS});
					} else {
						try {
							const tokenRes: any = await axios.request({
								url: `${BASE_URL}${apiCall.kycToken}`,
								headers: {
									// @ts-ignore
									Authorization: `Bearer ${storage.access}`
								}
							});
							const statusRes: any = await axios.request({
								url: `${BASE_URL}${apiCall.kycStatus}`,
								headers: {
									// @ts-ignore
									Authorization: `Bearer ${storage.access}`
								}
							});
							if (tokenRes.status === 200 && statusRes.status === 200) {
								makeBinanceKycCall(tokenRes.data.token);
								dispatch({type: KycEnum.STATUS, payload: statusRes.data.statusInfo.kycStatus}); // check typing
								// @ts-ignore
								setStorage({
									...storage,
									isKyced: statusRes.data.statusInfo.kycStatus === KycStatusEnum.PASS
								});
							} else {
								try {
									const tokenRes: any = await axios.request({
										url: `${BASE_URL}${apiCall.kycToken}`,
										headers: {
											// @ts-ignore
											Authorization: `Bearer ${storage.refresh}`
										}
									});
									const statusRes: any = await axios.request({
										url: `${BASE_URL}${apiCall.kycStatus}`,
										headers: {
											// @ts-ignore
											Authorization: `Bearer ${storage.refresh}`
										}
									});
									if (tokenRes.status === 200 && statusRes.status === 200) {
										makeBinanceKycCall(tokenRes.data.token);
										dispatch({
											type: KycEnum.STATUS,
											payload: statusRes.data.statusInfo.kycStatus
										}); // check typing
										// @ts-ignore
										setStorage({
											...storage,
											isKyced: statusRes.data.statusInfo.kycStatus === KycStatusEnum.PASS
										});
									} else {
										dispatch({
											type: ButtonEnum.BUTTON,
											payload: buttonType.GET_NONCE
										});
									}
								} catch (err: any) {
									addToast('Sorry, something went wrong', 'error');
								}
							}
						} catch (err: any) {
							addToast('Sorry, something went wrong', 'error');
						}
					}
				}
			}
		};
		void checkUsersKycStatus();
	}, [account, buttonStatus, isUserVerified]); // toast, storage?

	const changeTheme = (): void => {
		const getTheme = isLight ? darkTheme : lightTheme;
		dispatch({type: ThemeEnum.THEME, payload: getTheme});
		localStorage.setItem(LOCAL_STORAGE_THEME, JSON.stringify(getTheme));
	};

	const handleShowMenu = (): void => {
		if (!showMenu) {
			document.addEventListener('click', handleOutsideClick, {capture: true});
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
				const res: { access: string; is_kyced: boolean; refresh: string } =
					await getAuthTokensFromNonce(account, library);
				console.log('res', res);
				// @ts-ignore
				setStorage({
					account,
					access: res.access,
					refresh: res.refresh,
					isKyced: res.is_kyced
				}); // check with Daniel if this is the right place
				try {
					const tokenRes: { data: { token: string } } = await axios.request({
						url: `${BASE_URL}${apiCall.kycToken}`,
						headers: {
							Authorization: `Bearer ${res.access}`
						}
					});
					makeBinanceKycCall(tokenRes.data.token);
				} catch (err: any) {
					addToast('Sorry, something went wrong', 'error');
				}
			} catch (err: any) {
				addToast('Something went wrong in handleButtonClick call', 'error');
			}
		}
	};

	return (
		<StyledHeader theme={theme}>
			{isBreakpointWidth ? (
				<LogoMobile style={{marginRight: 'auto'}}/>
			) : isLight ? (
				<LogoLight style={{marginRight: 'auto'}}/>
			) : (
				<LogoDark style={{marginRight: 'auto'}}/>
			)}
			{!isBreakpointWidth && (
				<Button variant="pure" onClick={() => console.log('header')}>
					Transaction History
				</Button>
			)}
			{showModal && <Network showModal={showModal} setShowModal={setShowModal}/>}
			{isUserVerified && account ? (
				<Wallet token="GLMR" account={account}/>
			) : (
				<Button
					variant="secondary"
					onClick={handleButtonClick}
					color={buttonStatus.color as ColorType}>
					{buttonStatus.text}
				</Button>
			)}

			<ThemeButton theme={theme} onClick={changeTheme}>
				{isLight ? <Moon/> : <Sun/>}
			</ThemeButton>

			{isBreakpointWidth &&
				(isLight ? <MenuLight onClick={handleShowMenu}/> : <MenuDark onClick={handleShowMenu}/>)}
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
