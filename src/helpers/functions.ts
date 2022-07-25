import type { Breakpoint, Theme } from './../styles';
import { useState, useLayoutEffect } from 'react';
import { breakpoint } from './../styles';

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

export const useBreakpoint = (size: Breakpoint) => {
  const [windowWidth, windowHeight] = useWindowSize();
  return {
    isBreakpointWidth: windowWidth < breakpoint[size],
    isBreakpointHeight: windowHeight < breakpoint[size],
  };
};

export const isLightTheme = (theme: Theme) => theme.name === 'light';
