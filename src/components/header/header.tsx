import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as LogoDark } from '../../assets/logo-dark.svg';
import { ReactComponent as LogoLight } from '../../assets/logo-light.svg';
import { ReactComponent as MenuDark } from '../../assets/menu-dark.svg';
import { ReactComponent as MenuLight } from '../../assets/menu-light.svg';
import { ReactComponent as LogoMobile } from '../../assets/logo-mobile.svg';
import { ReactComponent as Sun } from '../../assets/sun.svg';
import { ReactComponent as Moon } from '../../assets/moon.svg';
import { pxToRem, mediaQuery, lightTheme, darkTheme, spacing } from '../../styles';
import type { Theme } from '../../styles';
import { Button } from '../button/button';
import {
	isLightTheme,
	localStorageThemeName,
	ThemeEnum,
	useAuth,
	useBreakpoint
} from '../../helpers';

type Props = {
	theme: Theme;
};

const StyledHeader = styled.header`
	display: flex;
	align-items: center;
	gap: ${pxToRem(16)};
	height: ${pxToRem(52)};
	margin-bottom: ${pxToRem(67.5)};
	${mediaQuery('s')} {
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
	border: 1px solid
		${(props: Props) => (props.theme.name === 'light' ? props.theme.default : props.theme.pure)};
	& > li:not(:last-child) {
		margin-bottom: ${pxToRem(16)};
	}
`;

export const Header = () => {
	const { isBreakpointWidth } = useBreakpoint('s');
	const { state, dispatch } = useAuth();
	const { theme } = state;
	const [showMenu, setShowMenu] = useState(false);
	const isLight = isLightTheme(theme);
	const menuRef = useRef<HTMLUListElement | null>(null);

	useEffect(() => {
		const localStorageTheme = JSON.parse(localStorage.getItem(localStorageThemeName) as string);
		if (localStorageTheme) {
			dispatch({ type: ThemeEnum.THEME, payload: localStorageTheme });
		}
		// eslint-disable-next-line
	}, []);

	const changeTheme = (): void => {
		const getTheme = isLight ? darkTheme : lightTheme;
		dispatch({ type: ThemeEnum.THEME, payload: getTheme });
		localStorage.setItem(localStorageThemeName, JSON.stringify(getTheme));
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
			if (!menuRef.current.contains(e.target)) handleShowMenu();
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
				<Button variant="pure" onClick={() => console.log('hedader')}>
					Transaction History
				</Button>
			)}
			<Button variant="secondary" onClick={() => console.log('hedader')}>
				Connect Wallet
			</Button>

			<button onClick={changeTheme} style={{ border: 'none', background: 'none' }}>
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
		</StyledHeader>
	);
};
