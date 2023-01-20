import { CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as INCH } from '../../assets/1inch.svg';
import { ReactComponent as AAVE } from '../../assets/aave.svg';
import { ReactComponent as AVAXC } from '../../assets/avaxc.svg';
import { ReactComponent as AION } from '../../assets/aion.svg';
import { ReactComponent as ARBITRUM } from '../../assets/arbitrum.svg';
import { ReactComponent as ACH } from '../../assets/ach.svg';
import { ReactComponent as AGIX } from '../../assets/agix.svg';
import { ReactComponent as ALICE } from '../../assets/alice.svg';
import { ReactComponent as ANT } from '../../assets/ant.svg';
import { ReactComponent as APE } from '../../assets/ape.svg';
import { ReactComponent as AUDIO } from '../../assets/audio.svg';
import { ReactComponent as BUSD } from '../../assets/busd.svg';
import { ReactComponent as BNT } from '../../assets/bnt.svg';
import { ReactComponent as BCH } from '../../assets/bch.svg';
import { ReactComponent as CHZ } from '../../assets/chz.svg';
import { ReactComponent as DAI } from '../../assets/dai.svg';
import { ReactComponent as DOGE } from '../../assets/doge.svg';
import { ReactComponent as DOT } from '../../assets/dot.svg';
import { ReactComponent as FTT } from '../../assets/ftt.svg';
import { ReactComponent as GLMR } from '../../assets/glmr.svg';
import { ReactComponent as LINK } from '../../assets/link.svg';
import { ReactComponent as MANA } from '../../assets/mana.svg';
import { ReactComponent as MATIC } from '../../assets/matic.svg';
import { ReactComponent as OPTIMISM } from '../../assets/optimism.svg';
import { ReactComponent as QNT } from '../../assets/qnt.svg';
import { ReactComponent as SAND } from '../../assets/sand.svg';
import { ReactComponent as SHIB } from '../../assets/shib.svg';
import { ReactComponent as SUSHI } from '../../assets/sushi.svg';
import { ReactComponent as UNI } from '../../assets/uni.svg';
import { ReactComponent as USDT } from '../../assets/usdt.svg';
import { ReactComponent as WBTC } from '../../assets/wbtc.svg';
import { ReactComponent as BTC } from '../../assets/btc.svg';
import { ReactComponent as BSC } from '../../assets/bsc.svg';
import { ReactComponent as BNB } from '../../assets/bnb.svg';
import { ReactComponent as ETH } from '../../assets/eth.svg';
import { ReactComponent as SOL } from '../../assets/sol.svg';
import { ReactComponent as TRX } from '../../assets/trx.svg';
import { ReactComponent as XRP } from '../../assets/xrp.svg';
import { ReactComponent as XTZ } from '../../assets/xtz.svg';
import { ReactComponent as INFO } from '../../assets/info.svg';
import { ReactComponent as WARNING } from '../../assets/warning.svg';
import { ReactComponent as SUCCESS } from '../../assets/success.svg';
import { ReactComponent as ERROR } from '../../assets/error.svg';
import { ReactComponent as QuestionMark } from '../../assets/question-mark.svg';
import { ReactComponent as Sun } from '../../assets/sun.svg';
import { ReactComponent as Moon } from '../../assets/moon.svg';
import { ReactComponent as MenuDark } from '../../assets/menu-dark.svg';
import { ReactComponent as MenuLight } from '../../assets/menu-light.svg';
import { ReactComponent as LogoDark } from '../../assets/logo-dark.svg';
import { ReactComponent as LogoLight } from '../../assets/logo-light.svg';
import { ReactComponent as CheckLight } from '../../assets/check-light.svg';
import { ReactComponent as CheckDark } from '../../assets/check-dark.svg';
import { ReactComponent as LogoMobile } from '../../assets/logo-mobile.svg';
import { ReactComponent as ArrowDark } from '../../assets/arrow-dark.svg';
import { ReactComponent as ArrowLight } from '../../assets/arrow-light.svg';
import { ReactComponent as ArrowFullDark } from '../../assets/arrow-full-dark.svg';
import { ReactComponent as ArrowFullLight } from '../../assets/arrow-full-light.svg';
import { ReactComponent as Search } from '../../assets/search.svg';
import { ReactComponent as SwapperLight } from '../../assets/swapper-light.svg';
import { ReactComponent as SwapperDark } from '../../assets/swapper-dark.svg';
import { ReactComponent as SettingsDark } from '../../assets/settings-dark.svg';
import { ReactComponent as SettingsLight } from '../../assets/settings-light.svg';

import type { ThemeProps } from '../../styles';
import {
	DEFAULT_BORDER_RADIUS,
	DEFAULT_OUTLINE,
	DEFAULT_OUTLINE_OFFSET,
	DEFAULT_TRANSITION,
	pxToRem,
	spacing
} from '../../styles';
import { useStore } from '../../helpers';

const Icons = {
	'1inch': INCH,
	aion: AION,
	arbitrum: ARBITRUM,
	aave: AAVE,
	ach: ACH,
	agix: AGIX,
	alice: ALICE,
	ant: ANT,
	ape: APE,
	audio: AUDIO,
	bch: BCH,
	bnt: BNT,
	chz: CHZ,
	dai: DAI,
	doge: DOGE,
	dot: DOT,
	ftt: FTT,
	link: LINK,
	mana: MANA,
	optimism: OPTIMISM,
	qnt: QNT,
	sand: SAND,
	shib: SHIB,
	suhsi: SUSHI,
	unit: UNI,
	wbtc: WBTC,
	bsc: BSC,
	usdt: USDT,
	glmr: GLMR,
	btc: BTC,
	bnb: BNB,
	eth: ETH,
	sol: SOL,
	busd: BUSD,
	trx: TRX,
	matic: MATIC,
	avaxc: AVAXC,
	xrp: XRP,
	xtz: XTZ,
	info: INFO,
	warning: WARNING,
	success: SUCCESS,
	error: ERROR,
	questionMark: QuestionMark,
	sun: Sun,
	moon: Moon,
	menuDark: MenuDark,
	menuLight: MenuLight,
	logoDark: LogoDark,
	logoLight: LogoLight,
	checkDark: CheckDark,
	checkLight: CheckLight,
	logoMobile: LogoMobile,
	arrowDark: ArrowDark,
	arrowLight: ArrowLight,
	arrowFullDark: ArrowFullDark,
	arrowFullLight: ArrowFullLight,
	search: Search,
	swapperDark: SwapperDark,
	swapperLight: SwapperLight,
	settingsDark: SettingsDark,
	settingsLight: SettingsLight
};

export type IconType = keyof typeof Icons;
export type SizeType = 'small' | 'medium' | 'large' | number;

type Props = {
	icon: IconType | undefined;
	size?: SizeType;
	onClick?: () => void;
	style?: CSSProperties;
};

type StyleProps = Omit<Props, 'icon'> & ThemeProps;

const fontSize = (size: SizeType) => {
	switch (size) {
		case 'small':
			return pxToRem(24);
		case 'medium':
			return pxToRem(32);
		case 'large':
			return pxToRem(40);
		default:
			return pxToRem(size);
	}
};

const StyledIcon = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	cursor: ${(props: StyleProps) => (props.onClick ? 'pointer' : 'unset')};
	transition: ${DEFAULT_TRANSITION};

	${(props: StyleProps) =>
		props.onClick && props.size === 'large'
			? css`
					padding: ${spacing[8]} ${spacing[12]};
					border: 1px solid ${props.theme.border.default};
					border-radius: ${DEFAULT_BORDER_RADIUS};
					display: flex;
					align-items: center;
					justify-content: center;
					background: ${`linear-gradient(to left, ${props.theme.background.secondary}, ${props.theme.background.secondary})`};
					transition: ${DEFAULT_TRANSITION};

					& svg {
						font-size: ${spacing[32]};
					}
			  `
			: null}
	${(props: StyleProps) =>
		props.onClick
			? css`
					outline: 1px solid transparent;

					&:hover {
						opacity: 0.8;
					}

					&:focus-visible {
						outline-offset: ${DEFAULT_OUTLINE_OFFSET};
						outline: ${(props: StyleProps) => DEFAULT_OUTLINE(props.theme)};
					}

					&:active {
						outline: none;
					}
			  `
			: null}
	& > * {
		width: 1em;
		height: 1em;
		font-size: ${(props: StyleProps) => fontSize(props.size ?? 'medium')};
	}
`;

export const Icon = ({ icon, size, onClick, style = {} }: Props) => {
	const {
		state: { theme }
	} = useStore();

	const Icon = icon ? Icons[icon] : undefined;

	return Icon ? (
		<StyledIcon onClick={onClick} size={size} theme={theme} style={style} data-testid="icon">
			<Icon onClick={onClick ?? null} theme={theme} />
		</StyledIcon>
	) : null;
};
