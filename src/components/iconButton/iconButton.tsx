import styled, { css } from 'styled-components';
import { useStore, isTokenSelected } from '../../helpers';
import USDT from '../../assets/usdt.png';
import INCH from '../../assets/1inch.png';
import AAVE from '../../assets/aave.png';
import ACH from '../../assets/ach.png';
import AGIX from '../../assets/agix.png';
import ALICE from '../../assets/alice.png';
import ANT from '../../assets/ant.png';
import APE from '../../assets/ape.png';
import AUDIO from '../../assets/audio.png';
import BNT from '../../assets/bnt.png';
import CHZ from '../../assets/chz.png';
import DAI from '../../assets/dai.png';
import FTT from '../../assets/ftt.png';
import LINK from '../../assets/link.png';
import MANA from '../../assets/mana.png';
import QNT from '../../assets/qnt.png';
import SAND from '../../assets/sand.png';
import SHIB from '../../assets/shib.png';
import SUSHI from '../../assets/sushi.png';
import UNI from '../../assets/uni.png';
import WBTC from '../../assets/wbtc.png';
import GLMR from '../../assets/glmr.png';
import BTC from '../../assets/btc.png';
import BSC from '../../assets/bsc.png';
import BNB from '../../assets/bnb.png';
import ETH from '../../assets/eth.png';
import SOL from '../../assets/sol.png';
import BUSD from '../../assets/busd.png';
import TRX from '../../assets/trx.png';
import MATIC from '../../assets/matic.png';
import XRP from '../../assets/xrp.png';
import XTZ from '../../assets/xtz.png';
import AVAXC from '../../assets/avaxc.png';
import SEGWIT from '../../assets/segwit.png';
import INFO from '../../assets/default.svg';
import WARNING from '../../assets/warning.svg';
import SUCCESS from '../../assets/success.svg';
import ERROR from '../../assets/error.svg';
import { ReactComponent as QuestionMark } from '../../assets/question-mark.svg';
import { pxToRem, spacing, DEFAULT_BORDER_RADIUS, DEFAULT_TRANSIITON } from '../../styles';
import type { DestinationNetworks } from '../../helpers';

const icons = {
	'1INCH': INCH,
	AAVE,
	ACH,
	AGIX,
	ALICE,
	ANT,
	APE,
	AUDIO,
	BNT,
	CHZ,
	DAI,
	FTT,
	LINK,
	MANA,
	QNT,
	SAND,
	SHIB,
	SUSHI,
	UNI,
	WBTC,
	BSC,
	USDT,
	GLMR,
	BTC,
	BNB,
	ETH,
	SOL,
	BUSD,
	TRX,
	MATIC,
	AVAXC,
	SEGWIT,
	XRP,
	XTZ,
	INFO,
	WARNING,
	SUCCESS,
	ERROR
};

const Icon = styled.button(({ disabled }: Props) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		cursor: ${!disabled && 'pointer'};
		padding: ${spacing[8]};
		border: 1px solid ${theme.font.default};
		border-radius: ${DEFAULT_BORDER_RADIUS};
		display: flex;
		align-items: center;
		justify-content: center;
		background: ${`linear-gradient(to left, ${theme.icon.default}, ${theme.icon.default})`};
		transition: ${DEFAULT_TRANSIITON};

		&:hover {
			opacity: 0.8;
		}

		&:active {
			outline: none;
		}

		&:focus-visible {
			outline-offset: 2px;
			outline: 1px solid ${theme.font.default};
		}
	`;
});

const Img = styled.img(({ iconOnly }: Props) => {
	return css`
		height: ${iconOnly ? pxToRem(25) : pxToRem(40)};
		width: ${iconOnly ? pxToRem(25) : pxToRem(40)};
		margin-right: ${iconOnly ? pxToRem(10) : pxToRem(0)};
		cursor: pointer;
	`;
});

type Props = {
	disabled?: boolean;
	icon?:
		| '1INCH'
		| 'AAVE'
		| 'ACH'
		| 'AGIX'
		| 'ALICE'
		| 'ANT'
		| 'APE'
		| 'AUDIO'
		| 'BNT'
		| 'CHZ'
		| 'DAI'
		| 'FTT'
		| 'LINK'
		| 'MANA'
		| 'QNT'
		| 'SAND'
		| 'SHIB'
		| 'SUSHI'
		| 'UNI'
		| 'WBTC'
		| 'BSC'
		| 'USDT'
		| 'GLMR'
		| 'BTC'
		| 'BNB'
		| 'ETH'
		| 'SOL'
		| 'BUSD'
		| 'TRX'
		| 'MATIC'
		| 'AVAXC'
		| 'SEGWIT'
		| 'XRP'
		| 'XTZ'
		| 'INFO'
		| 'WARNING'
		| 'SUCCESS'
		| 'ERROR'
		| 'Select Token';
	onClick?: () => void;
	iconOnly?: boolean;
};

export const IconButton = ({ disabled = false, icon, onClick, iconOnly }: Props) => {
	return !iconOnly ? (
		<Icon disabled={disabled} onClick={onClick}>
			{!icon || !isTokenSelected(icon) ? (
				<QuestionMark style={{ width: 40, height: 40 }} />
			) : (
				<Img src={icons[icon as DestinationNetworks]} alt={icon} onClick={onClick} />
			)}
		</Icon>
	) : !icon || !isTokenSelected(icon) ? (
		<QuestionMark style={{ width: 40, height: 40 }} />
	) : (
		<Img src={icons[icon as DestinationNetworks]} alt={icon} iconOnly />
	);
};
