import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mainnet, MetamaskConnector, Moonbeam, useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import {
	ColorType,
	DEFAULT_BORDER_RADIUS,
	DEFAULT_TRANSIITON,
	mediaQuery,
	pxToRem,
	spacing,
	Theme,
	theme as defaultTheme
} from '../../styles';
import type { ApiAuthType } from '../../helpers';
import {
	BasicStatusEnum,
	button,
	ButtonEnum,
	CHAINS,
	DefaultSelectEnum,
	DestinationEnum,
	ETHEREUM_URL,
	getAuthTokensFromNonce,
	hexToRgbA,
	INITIAL_STORAGE,
	isLightTheme,
	isNetworkSelected,
	KycEnum,
	KycStatusEnum,
	loadBinanceKycScript,
	LOCAL_STORAGE_AUTH,
	LOCAL_STORAGE_THEME,
	makeBinanceKycCall,
	MOONBEAM_URL,
	routes,
	SourceEnum,
	ThemeEnum,
	useStore,
	VerificationEnum
} from '../../helpers';
import type { IconType } from '../../components';
import { Button, Icon, useToasts, Wallet } from '../../components';
import { useAxios, useClickOutside, useLocalStorage, useMedia } from '../../hooks';
import _ from 'lodash';
import { KycL2Modal } from '../modal/kycL2Modal';

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
	box-sizing: border-box;
	max-width: calc(100% - ${pxToRem(8)});
	background: ${(props: Props) => props.theme.background.secondary};
	text-align: right;
	padding: ${spacing[24]} ${spacing[18]};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	border: 1px solid ${(props: Props) => props.theme.border.default};

	& > li {
		list-style: none;
	}

	& > li:not(:last-child) {
		margin-bottom: ${pxToRem(16)};
	}
`;

const Networks = styled(Menu)`
	width: 100%;

	& li {
		display: flex;
		align-items: center;
		gap: ${spacing[10]};
	}
`;

const NetworkWrapper = styled.button`
	all: unset;
	display: flex;
	gap: ${spacing[8]};
	align-items: center;
	cursor: pointer;
`;

export const NETWORK_PARAMS = {
	'1': [
		{
			chainId: ethers.utils.hexValue(Mainnet.chainId),
			chainName: Mainnet.chainName,
			rpcUrls: [ETHEREUM_URL],
			nativeCurrency: {
				name: 'Ethereum',
				symbol: 'ETH',
				decimals: 18
			},
			blockExplorerUrls: ['https://etherscan.io/']
		}
	],
	'1284': [
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
	]
};

export const Header = () => {
	const { mobileWidth: isMobile } = useMedia('s');
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
	const [showNetworksList, setShowNetworksList] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [binanceToken, setBinanceToken] = useState('');
	const [binanceScriptLoaded, setBinanceScriptLoaded] = useState(false);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const noKycStatusMessage = 'kyc verify not exist';

	const isLight = isLightTheme(theme);
	const { activate, library, account, chainId, switchNetwork, activateBrowserWallet } = useEthers();

	const changeTheme = (): void => {
		dispatch({ type: ThemeEnum.THEME, payload: isLight ? defaultTheme.dark : defaultTheme.light });
		localStorage.setItem(LOCAL_STORAGE_THEME, JSON.stringify(isLight));
	};

	const checkNetwork = async (): Promise<void> => {
		if (Object.keys(CHAINS).includes(chainId?.toString() as string)) {
			await switchNetwork(chainId === 1 ? Mainnet.chainId : Moonbeam.chainId); // TODO: has to be dynamic
		} else {
			await switchNetwork(Mainnet.chainId);
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

	const handleNetworkChange = async (name: string) => {
		setShowNetworksList(!showNetworksList);
		try {
			// @ts-ignore
			await ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [
					{
						chainId: ethers.utils.hexValue(chainId === 1 ? Moonbeam.chainId : Mainnet.chainId)
					}
				]
			});
		} catch (error: any) {
			if ((error.code === 4902 || error.code === -32603) && name === 'GLMR') {
				try {
					// @ts-ignore
					await ethereum.request({
						method: 'wallet_addEthereumChain',
						params: NETWORK_PARAMS['1284']
					});
					dispatch({
						type: SourceEnum.NETWORK,
						payload: name
					});
					dispatch({
						type: SourceEnum.TOKEN,
						payload: name
					});
				} catch (e) {
					dispatch({
						type: SourceEnum.NETWORK,
						payload: name === 'GLMR' ? 'ETH' : 'GLMR'
					});
					dispatch({ type: SourceEnum.TOKEN, payload: name === 'GLMR' ? 'ETH' : 'GLMR' });
				}
			} else if (error.code === 4001) {
				return;
			} else {
				addToast('Something went wrong - please try again');
			}
		}
		dispatch({ type: DestinationEnum.NETWORK, payload: DefaultSelectEnum.NETWORK });
		dispatch({ type: DestinationEnum.TOKEN, payload: DefaultSelectEnum.TOKEN });
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
		let metamaskMissing = true;
		const onMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

		try {
			// @ts-ignore
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			if (provider) {
				metamaskMissing = false;
			}
		} catch (error) {
			console.log('Can not find a Web3Provider in the browser');
		}

		if (!account) {
			if (onMobileDevice && metamaskMissing) {
				window.open(
					`https://metamask.app.link/dapp/${process.env.REACT_APP_PROD_URL}`,
					'_blank',
					'noopener,noreferrer'
				);
			}
			if (onMobileDevice && !metamaskMissing) {
				try {
					await activate(new MetamaskConnector());
				} catch (error) {
					console.log('error in connect wallet', error);
				}
			}
			if (!onMobileDevice && metamaskMissing) {
				console.log('HERE');
				addToast(
					'Looks like your browser doesent have Metamask wallet. Please install it first and then try again.'
				);
				setTimeout(
					() => window.open('https://metamask.io/download/', '_blank', 'noopener,noreferrer'),
					5000
				);
			}
			if (!onMobileDevice && !metamaskMissing) {
				try {
					activateBrowserWallet();
				} catch (error) {
					console.log('error in connect wallet', error);
				}
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

	const domNode: any = useClickOutside(() => {
		setShowMenu(false);
		setShowNetworksList(false);
	});

	useEffect(() => {
		if (binanceScriptLoaded && binanceToken) {
			makeBinanceKycCall(binanceToken);
		}
	}, [binanceToken, binanceScriptLoaded]);

	useEffect(() => {
		dispatch({ type: DestinationEnum.NETWORK, payload: DefaultSelectEnum.NETWORK });
		dispatch({ type: DestinationEnum.TOKEN, payload: DefaultSelectEnum.TOKEN });
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

		if (account && storage?.account && storage?.account !== account) {
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
			<Icon
				icon={isMobile ? 'logoMobile' : isLight ? 'logoLight' : 'logoDark'}
				style={{ marginRight: 'auto' }}
				size={isMobile ? 'medium' : 112}
			/>
			{!isMobile && (
				<Button
					variant="pure"
					onClick={() =>
						navigate(pathname !== '/transaction-history' ? '/transaction-history' : '/')
					}>
					{pathname !== '/transaction-history' ? 'Transaction History' : 'Swap Form'}
				</Button>
			)}
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
			{isMobile && isNetworkSelected(sourceNetwork) && (
				<NetworkWrapper onClick={() => setShowNetworksList(!showNetworksList)}>
					<Icon icon={sourceNetwork.toLowerCase() as IconType} size="small" />
					<Icon
						icon={isLightTheme(theme) ? 'arrowDark' : 'arrowLight'}
						size={16}
						style={{
							transform: `rotate(${showNetworksList ? 180 : 0}deg)`,
							transition: DEFAULT_TRANSIITON
						}}
					/>
				</NetworkWrapper>
			)}
			{!isMobile && <Icon icon={isLight ? 'moon' : 'sun'} onClick={changeTheme} size="small" />}
			{isMobile && (
				<Icon
					icon={isLight ? 'menuLight' : 'menuDark'}
					onClick={() => setShowMenu(!showMenu)}
					size="small"
				/>
			)}
			{showMenu && (
				<MenuWrapper theme={theme}>
					<Menu theme={theme} ref={domNode}>
						<li
							onClick={() => {
								navigate(pathname !== '/transaction-history' ? '/transaction-history' : '/');
								setShowMenu(!showMenu);
							}}>
							{pathname !== '/transaction-history' ? <>Transaction History</> : <>Swap Form</>}
						</li>
						<li
							onClick={() => {
								changeTheme();
								setShowMenu(!showMenu);
							}}>
							{isLightTheme(theme) ? <>Dark theme</> : <>Light theme</>}
						</li>
					</Menu>
				</MenuWrapper>
			)}
			{showNetworksList && (
				<MenuWrapper theme={theme}>
					<Networks theme={theme} ref={domNode}>
						{Object.values(CHAINS).map((chain) => (
							<li onClick={() => handleNetworkChange(chain.name)} key={chain.name}>
								<Icon icon={chain.name === 'ETH' ? 'eth' : 'glmr'} size="small" />
								{chain.name === 'ETH' ? 'Ethereum' : 'Moonbeam'}
								<Icon
									icon={
										sourceNetwork !== chain.name
											? undefined
											: isLightTheme(theme)
											? 'checkLight'
											: 'checkDark'
									}
									size={16}
									style={{ marginLeft: 'auto' }}
								/>
							</li>
						))}
					</Networks>
					<KycL2Modal  />
				</MenuWrapper>
			)}
		</StyledHeader>
	);
};
