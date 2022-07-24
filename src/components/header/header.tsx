import { useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as LogoDark } from '../../assets/logo-dark.svg';
import { ReactComponent as LogoLight } from '../../assets/logo-light.svg';
import { ReactComponent as MenuDark } from '../../assets/menu-dark.svg';
import { ReactComponent as MenuLight } from '../../assets/menu-light.svg';
import { ReactComponent as LogoMobile } from '../../assets/logo-mobile.svg';
import {
  pxToRem,
  mediaQuery,
  spacing,
  lightTheme,
  darkTheme,
  viewport,
} from '../../styles';
import sun from '../../assets/sole.png';
import moon from '../../assets/moon.png';
import { Button } from '../button/button';
import { ThemeEnum, useAuth, useBreakpoint } from '../../helpers';

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  gap: ${pxToRem(16)};
  height: ${pxToRem(52)};
  padding: 0 ${spacing[20]};
  max-width: ${viewport[1760]};
  margin: 0 auto;
  ${mediaQuery('s')} {
    gap: ${pxToRem(24)};
  }
`;

const Icon = styled.img`
  display: inline-block;
  min-height: ${pxToRem(21)};
  cursor: pointer;
`;

export const Header = () => {
  const { isBreakpointWidth } = useBreakpoint('s');
  const localStorageThemeName: string = 'current-theme'; // to constatnts file
  const { state, dispatch } = useAuth(); // make a seoncd hook
  const { theme } = state;
  const isLightTheme = theme.name === 'light'; // HELPER !!!!

  useEffect(() => {
    const localStorageTheme = JSON.parse(
      localStorage.getItem(localStorageThemeName) as string
    );
    if (localStorageTheme) {
      dispatch({ type: ThemeEnum.THEME, payload: localStorageTheme });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeTheme = (): void => {
    const getTheme = isLightTheme ? darkTheme : lightTheme;
    dispatch({ type: ThemeEnum.THEME, payload: getTheme });
    localStorage.setItem(localStorageThemeName, JSON.stringify(getTheme));
  };

  return (
    <StyledHeader theme={theme}>
      {isBreakpointWidth ? (
        <LogoMobile style={{ marginRight: 'auto' }} />
      ) : isLightTheme ? (
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

      <button
        onClick={changeTheme}
        style={{ border: 'none', background: 'none' }}
      >
        <Icon src={isLightTheme ? moon : sun} alt={isLightTheme ? moon : sun} />
      </button>

      {isBreakpointWidth && (isLightTheme ? <MenuLight /> : <MenuDark />)}
    </StyledHeader>
  );
};
