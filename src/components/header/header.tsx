import { useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as LogoDark } from '../../assets/logo-dark.svg';
import { ReactComponent as LogoLight } from '../../assets/logo-light.svg';
import { ReactComponent as MenuDark } from '../../assets/menu-dark.svg';
import { ReactComponent as MenuLight } from '../../assets/menu-light.svg';
import { ReactComponent as LogoMobile } from '../../assets/logo-mobile.svg';
import { pxToRem, mediaQuery, lightTheme, darkTheme } from '../../styles';
import sun from '../../assets/sole.png';
import moon from '../../assets/moon.png';
import { Button } from '../button/button';
import {
    isLightTheme,
    localStorageThemeName,
    ThemeEnum,
    useAuth,
    useBreakpoint
} from '../../helpers';

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
const Icon = styled.img`
	cursor: pointer;
	border: none;
	background: none;
	&:hover {
		opacity: 0.8;
	}
`;

export const Header = () => {
    const { isBreakpointWidth } = useBreakpoint('s');
    const { state, dispatch } = useAuth();
    const { theme } = state;
    const isLight = isLightTheme(theme);

    useEffect(() => {
        const localStorageTheme = localStorage.getItem(localStorageThemeName);
        if (localStorageTheme) {
            dispatch({ type: ThemeEnum.THEME, payload: JSON.parse(localStorageTheme) });
        }
        // eslint-disable-next-line
    }, []);

    const changeTheme = (): void => {
        const getTheme = isLight ? darkTheme : lightTheme;
        dispatch({ type: ThemeEnum.THEME, payload: getTheme });
        localStorage.setItem(localStorageThemeName, JSON.stringify(getTheme));
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
                <Icon src={isLight ? moon : sun} alt={isLight ? moon : sun} />
            </button>

            {isBreakpointWidth && (isLight ? <MenuLight /> : <MenuDark />)}
        </StyledHeader>
    );
};
