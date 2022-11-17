import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mainnet, Moonbeam, useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import { ReactComponent as LogoDark } from '../../assets/logo-dark.svg';
import { ReactComponent as LogoLight } from '../../assets/logo-light.svg';
import { ReactComponent as MenuDark } from '../../assets/menu-dark.svg';
import { ReactComponent as MenuLight } from '../../assets/menu-light.svg';
import { ReactComponent as LogoMobile } from '../../assets/logo-mobile.svg';
import { ReactComponent as Sun } from '../../assets/sun.svg';
import { ReactComponent as Moon } from '../../assets/moon.svg';
import { Theme, ColorType } from '../../styles';
import {
	mediaQuery,
	pxToRem,
	spacing,
	DEFAULT_BORDER_RADIUS,
	theme as defaultTheme,
	DEFAULT_OUTLINE,
	DEFAULT_OUTLINE_OFFSET
} from '../../styles';
import {
	ButtonEnum,
	getAuthTokensFromNonce,
	INITIAL_STORAGE,
	isLightTheme,
	loadBinanceKycScript,
	LOCAL_STORAGE_AUTH,
	LOCAL_STORAGE_THEME,
	makeBinanceKycCall,
	ETHEREUM_URL,
	ThemeEnum,
	useBreakpoint,
	useStore,
	VerificationEnum,
	button,
	KycStatusEnum,
	KycEnum,
	routes,
	BasicStatusEnum,
	DestinationEnum,
	CHAINS,
	hexToRgbA
} from '../../helpers';
import type { ApiAuthType } from '../../helpers';
import { Button, useToasts, Wallet } from '../../components';
import { useAxios, useLocalStorage, useClickOutside } from '../../hooks';
import _ from 'lodash';

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
		gap: ${spacing[16]};
		justify-content: space-between;
		margin-bottom: ${pxToRem(39.5)};
	}
`;

const ThemeButton = styled.button`
	cursor: pointer;
	background: none;
	border: none;
	outline: 1px solid transparent;

	&:hover {
		opacity: 0.8;
	}

	&:focus-visible {
		outline-offset: ${DEFAULT_OUTLINE_OFFSET};
		outline: ${(props: Props) => DEFAULT_OUTLINE(props.theme)};
	}

	&:active {
		outline: none;
	}
`;

const MenuWrapper = styled.div`
	position: fixed;
	inset: 0;
	background-color: ${(props: Props) => hexToRgbA(props.theme.modal.background, '0.8')};
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 1000;
	justify-content: center;
	overflow: hidden;
`;

const Menu = styled.ul`
	position: absolute;
	top: ${spacing[40]};
	right: ${spacing[4]};
	max-width: calc(100% - ${pxToRem(8)});
	background: ${(props: Props) => props.theme.background.secondary};
	text-align: right;
	padding: ${spacing[24]} ${spacing[18]};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	cursor: pointer;
	z-index: 1_000;

	border: 1px solid ${(props: Props) => props.theme.border.default};

	& > li {
		list-style: none;
	}

	& > li:not(:last-child) {
		margin-bottom: ${pxToRem(16)};
	}
`;

export const Header = () => {
	const { isBreakpointWidth: isMobile } = useBreakpoint('s');
	const {
		state: {
			buttonStatus,
			isUserVerified,
			accessToken,
			kycStatus,
			sourceNetwork,
			account: userAccount,
			isNetworkConnected,
			theme
		},
		dispatch
	} = useStore();
	const [storage, setStorage] = useLocalStorage(LOCAL_STORAGE_AUTH, INITIAL_STORAGE);
	// @ts-ignore
	const { addToast } = useToasts();
	const api = useAxios();

	const [showMenu, setShowMenu] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [binanceToken, setBinanceToken] = useState('');
	const [binanceScriptLoaded, setBinanceScriptLoaded] = useState(false);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const noKycStatusMessage = 'kyc verify not exist';

	const isLight = isLightTheme(theme);
	const { activateBrowserWallet, library, account, chainId, switchNetwork } = useEthers();

	const changeTheme = (): void => {
		dispatch({ type: ThemeEnum.THEME, payload: isLight ? defaultTheme.dark : defaultTheme.light });
		localStorage.setItem(LOCAL_STORAGE_THEME, JSON.stringify(isLight));
	};

	const checkNetwork = async (): Promise<void> => {
		// TODO: improve, seems to have a lot of redundancies
		const NETWORK_PARAMS = [
			{
				chainId: ethers.utils.hexValue(Mainnet.chainId),
				chainName: Mainnet.chainName,
				rpcUrls: [ETHEREUM_URL],
				nativeCurrency: {
					name: 'Ethereum',
					symbol: 'ETH',
					decimals: 18
				},
				blockExplorerUrls: ['https://moonscan.io/']
			}
		];
		// @ts-ignore
		if (Object.keys(CHAINS).includes(chainId?.toString())) {
			await switchNetwork(chainId === 1 ? Mainnet.chainId : Moonbeam.chainId); // TODO: has to be dynamic

			if (library) {
				// @ts-ignore
				await library.send('wallet_addEthereumChain', NETWORK_PARAMS['1']); // TODO: @daniel - are we just going for the Ethereum chain?
			}
		} else {
			await switchNetwork(Mainnet.chainId);

			if (library) {
				// @ts-ignore
				await library.send('wallet_addEthereumChain', NETWORK_PARAMS['1']);
			}
		}
	};

	const setTokensInStorageAndContext = async () => {
		if (account) {
			setIsLoading(true);
			try {
				const res: ApiAuthType = await getAuthTokensFromNonce(account, library);
				dispatch({ type: VerificationEnum.ACCESS, payload: res.access });
				dispatch({ type: VerificationEnum.REFRESH, payload: res.refresh });
				dispatch({
					type: KycEnum.STATUS,
					payload: res.is_kyced ? KycStatusEnum.PASS : KycStatusEnum.INITIAL
				});
				setStorage({ account, access: res.access, isKyced: res.is_kyced, refresh: res.refresh });
			} catch (error: any) {
				// TODO: do we need toast here?
				addToast('You have rejected signing the nonce. To proceed login again!', 'info');
			}
			setIsLoading(false);
		}
	};

	const getBinanceToken = async () => {
		try {
			setIsLoading(true);
			const res = await api.get(routes.kycToken);

			setBinanceToken(res?.data?.token);
			setIsLoading(false);
		} catch (error: any) {
			await setTokensInStorageAndContext();
		}
	};

	const checkStatus = async () => {
		if (!isUserVerified && account === userAccount && isNetworkConnected) {
			setIsLoading(true);
			try {
				const res = await api.get(routes.kycStatus);
				if (res.data.errorData === noKycStatusMessage) {
					await getBinanceToken();
				}
				const { kycStatus: kyc, basicStatus: basic } = res?.data?.statusInfo;
				dispatch({
					type: KycEnum.STATUS,
					payload: kyc
				});
				setStorage({ ...storage, isKyced: kyc === KycStatusEnum.PASS });
				// TODO: move this part to context?
				if (kyc === KycStatusEnum.REJECT) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.PASS_KYC });
					addToast('Your KYC process has been rejected - please start again!', 'warning');
				} else if (basic === BasicStatusEnum.INITIAL && kyc === KycStatusEnum.PROCESS) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.PASS_KYC });
				} else if (kyc === KycStatusEnum.REVIEW) {
					dispatch({ type: ButtonEnum.BUTTON, payload: button.CHECK_KYC });
				}
			} catch (error: any) {
				if (error?.response?.status === 401) {
					await setTokensInStorageAndContext();
				}
			}
			setIsLoading(false);
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

		if (_.isEqual(buttonStatus, button.CHANGE_NETWORK)) {
			await checkNetwork();
		}

		if (chainId && account) {
			if (buttonStatus === button.PASS_KYC || buttonStatus === button.CHECK_KYC) {
				await getBinanceToken();
			} else if (buttonStatus === button.LOGIN) {
				await setTokensInStorageAndContext();
			} else {
				void checkStatus();
			}
		}
	};

	const domNode: any = useClickOutside(() => setShowMenu(false));

	useEffect(() => {
		if (binanceScriptLoaded && binanceToken) {
			makeBinanceKycCall(binanceToken);
		}
	}, [binanceToken, binanceScriptLoaded]);

	useEffect(() => {
		dispatch({ type: DestinationEnum.NETWORK, payload: 'Select Network' });
		dispatch({ type: DestinationEnum.TOKEN, payload: 'Select Token' });
	}, [sourceNetwork]);

	useEffect(() => {
		const localStorageTheme = localStorage.getItem(LOCAL_STORAGE_THEME);
		const localStorageAuth = localStorage.getItem(LOCAL_STORAGE_AUTH);

		if (localStorageTheme) {
			dispatch({
				type: ThemeEnum.THEME,
				payload: JSON.parse(localStorageTheme) ? defaultTheme.dark : defaultTheme.light
			});
		}
		if (localStorageAuth) {
			dispatch({ type: VerificationEnum.ACCOUNT, payload: JSON.parse(localStorageAuth).account });
			dispatch({ type: VerificationEnum.ACCESS, payload: JSON.parse(localStorageAuth).access });
			dispatch({ type: VerificationEnum.REFRESH, payload: JSON.parse(localStorageAuth).refresh });
			dispatch({
				type: KycEnum.STATUS,
				payload: JSON.parse(localStorageAuth).isKyced ? KycStatusEnum.PASS : KycStatusEnum.INITIAL
			});
		}
	}, []);

	useEffect(() => {
		loadBinanceKycScript(() => {
			setBinanceScriptLoaded(true);
		});
	}, []);

	useEffect(() => {
		if (account) {
			dispatch({ type: VerificationEnum.ACCOUNT, payload: account });
		} else {
			dispatch({ type: VerificationEnum.ACCOUNT, payload: '' });
		}

		if (account && storage && storage?.account !== account) {
			addToast(
				'Please login to the account that has already passed KYC or connect wallet again',
				'warning'
			);
			dispatch({ type: VerificationEnum.ACCESS, payload: '' });
			dispatch({ type: VerificationEnum.REFRESH, payload: '' });
			dispatch({
				type: KycEnum.STATUS,
				payload: KycStatusEnum.INITIAL
			});
			setStorage({ account, access: '', isKyced: false, refresh: '' });
		}
	}, [account, isUserVerified, isNetworkConnected]);

	useEffect(() => {
		if (!chainId) {
			dispatch({ type: VerificationEnum.NETWORK, payload: false });
			void checkNetwork();
		} else {
			dispatch({ type: VerificationEnum.NETWORK, payload: true });
		}
	}, [chainId]);

	useEffect(() => {
		void checkStatus();
	}, [kycStatus, accessToken, account, userAccount]);

	return (
		<StyledHeader theme={theme}>
			{isMobile ? (
				<LogoMobile />
			) : isLight ? (
				<LogoLight style={{ marginRight: 'auto' }} />
			) : (
				<LogoDark style={{ marginRight: 'auto' }} />
			)}
			{!isMobile && (
				<Button
					variant="pure"
					onClick={() =>
						navigate(pathname !== '/transaction-history' ? '/transaction-history' : '/')
					}>
					{pathname !== '/transaction-history' ? 'Transaction History' : 'Swap Form'}
				</Button>
			)}
			{showModal && <Network showModal={showModal} setShowModal={setShowModal} />}
			{isUserVerified && account && isNetworkConnected ? (
				<Wallet />
			) : (
				<Button
					isLoading={isLoading}
					variant="secondary"
					onClick={handleButtonClick}
					color={buttonStatus.color as ColorType}>
					{buttonStatus.text}
				</Button>
			)}

			{!isMobile && (
				<ThemeButton theme={theme} onClick={changeTheme} aria-label="change theme">
					{isLight ? <Moon /> : <Sun />}
				</ThemeButton>
			)}
			{isMobile &&
				(isLight ? (
					<MenuLight onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer' }} />
				) : (
					<MenuDark onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer' }} />
				))}
			{showMenu && (
				<MenuWrapper theme={theme}>
					<Menu theme={theme} ref={domNode}>
						<li
							onClick={() => {
								navigate(pathname !== '/transaction-history' ? '/transaction-history' : '/');
								setShowMenu(!showMenu);
							}}>
							{pathname !== '/transaction-history' ? (
								<>Transaction History &#11044;</>
							) : (
								<>Swap Form &#11044;</>
							)}
						</li>
						<li
							onClick={() => {
								changeTheme();
								setShowMenu(!showMenu);
							}}>
							{isLightTheme(theme) ? <>Dark theme &#9733;</> : <>Light theme &#9733;</>}
						</li>
					</Menu>
				</MenuWrapper>
			)}
			{showModal && <div>Modal</div>}
		</StyledHeader>
	);
};
