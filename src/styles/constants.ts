import type { Theme } from '../styles';
import { pxToRem } from '../styles';

export const DEFAULT_BORDER_RADIUS = pxToRem(6);
export const DEFAULT_OUTLINE_OFFSET = '1px';
export const DEFAULT_OUTLINE = (theme: Theme) => `1px solid ${theme.border.secondary}`;
export const DEFAULT_TRANSITION = 'all .2s ease-in-out';
export const MAIN_MAX_WIDTH = pxToRem(450);
export const HORIZONTAL_PADDING = 8;
