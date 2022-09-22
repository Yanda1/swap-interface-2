import styled, { css } from 'styled-components';
import { defaultBorderRadius, isTokenSelected, useStore } from '../../helpers';
import USDT from '../../assets/usdt.png';
import GLMR from '../../assets/glmr.png';
import BTC from '../../assets/btc.png';
import BSC from '../../assets/bsc.png';
import BNB from '../../assets/bnb.png';
import ETH from '../../assets/eth.png';
import SOL from '../../assets/sol.png';
import BUSD from '../../assets/busd.png';
import TRX from '../../assets/trx.png';
import MATIC from '../../assets/matic.png';
import XTZ from '../../assets/xtz.png';
import AVAXC from '../../assets/avaxc.png';
import SEGWIT from '../../assets/segwit.png';
import INFO from '../../assets/default.svg';
import WARNING from '../../assets/warning.svg';
import SUCCESS from '../../assets/success.svg';
import ERROR from '../../assets/error.svg';
import { ReactComponent as QuestionMark } from '../../assets/question-mark.svg';
import { pxToRem, spacing } from '../../styles';
import destinationNetworks from '../../data/destinationNetworks.json';

const icons = {
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
	XTZ,
	INFO,
	WARNING,
	SUCCESS,
	ERROR
};

type Props = {
	disabled?: boolean;
	icon?:
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
		| 'XTZ'
		| 'INFO'
		| 'WARNING'
		| 'SUCCESS'
		| 'ERROR'
		| 'Select Token';
	onClick?: () => void;
	value?: string;
	iconOnly?: boolean;
};

const Icon = styled.button(({ disabled }: Props) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		cursor: ${!disabled && 'pointer'};
		padding: ${spacing[8]};
		border: 1px solid ${theme.default};
		border-radius: ${defaultBorderRadius};
		display: flex;
		align-items: center;
		justify-content: center;
		background: ${theme.icon.default};
		transition: all 0.2s ease-in-out;

		&:hover {
			opacity: 0.8;
		}

		&:active {
			outline: none;
		}

		&:focus-visible {
			outline-offset: 2px;
			outline: 1px solid ${theme.default};
		}
	`;
});

const Img = styled.img(({ iconOnly }: Props) => {
	return css`
		height: ${iconOnly ? pxToRem(25) : pxToRem(42)};
		width: ${iconOnly ? pxToRem(25) : pxToRem(42)};
		margin-right: ${iconOnly ? pxToRem(10) : pxToRem(0)};
		cursor: pointer;
	`;
});

export const IconButton = ({ disabled = false, icon, onClick, iconOnly }: Props) => {
	return !iconOnly ? (
		<Icon disabled={disabled} onClick={onClick}>
			{!icon || !isTokenSelected(icon) ? (
				<QuestionMark style={{ width: 42, height: 42 }} />
			) : (
				<Img src={icons[icon as keyof typeof destinationNetworks]} alt={icon} onClick={onClick} />
			)}
		</Icon>
	) : !icon || !isTokenSelected(icon) ? (
		<QuestionMark style={{ width: 42, height: 42 }} />
	) : (
		<Img src={icons[icon as keyof typeof destinationNetworks]} alt={icon} iconOnly />
	);
};
