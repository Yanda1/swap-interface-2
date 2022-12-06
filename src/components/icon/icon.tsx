import styled from 'styled-components';
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
import { pxToRem } from '../../styles';

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
	dat: DAI,
	doge: DOGE,
	dot: DOT,
	ftt: FTT,
	lnk: LINK,
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
	xyz: XTZ,
	info: INFO,
	warning: WARNING,
	success: SUCCESS,
	error: ERROR,
	questionMark: QuestionMark,
	sun: Sun,
	moon: Moon
};

export type IconType = keyof typeof Icons;
type SizeProps = 'small' | 'medium' | 'large';

type Props = {
	icon: IconType;
	size?: SizeProps;
	onClick?: () => void;
};

export const Icon = ({ icon, size, onClick }: Props) => {
	const Icon = Icons[icon ?? 'questionMark'];

	const iconSize = size ?? 'medium';

	const fontSize = (size: SizeProps) => {
		switch (size) {
			case 'small':
				return pxToRem(24);
			case 'medium':
				return pxToRem(32);
			case 'large':
				return pxToRem(40);
		}
	};

	const StyledIcon = styled(Icon)`
		width: 1em;
		height: 1em;
		font-size: ${fontSize(iconSize)};
		cursor: ${(props: Props) => (props.onClick ? 'pointer' : 'unset')};
	`;

	return <StyledIcon onClick={onClick ?? null} />;
};
