import { pxToRem } from '../styles';
import type { Theme } from '../styles';

export const DEFAULT_BORDER_RADIUS = pxToRem(6);
export const DEFAULT_OUTLINE_OFFSET = '1px';
export const DEFAULT_OUTLINE = (theme: Theme) => `1px solid ${theme.border.secondary}`;
export const DEFAULT_TRANSIITON = 'all .2s ease-in-out';
export const SELECT_LIST_HEIGHT = pxToRem(478);
export const MAIN_MAX_WIDTH = pxToRem(450);
export const HORIZONTAL_PADDING = 10;
