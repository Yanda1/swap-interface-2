import styled, { css } from 'styled-components';
import { useStore } from '../../helpers';
import USDT from '../../assets/USDT.png';
import GLMR from '../../assets/GLMR.png';
import BTC from '../../assets/BTC.png';
import BSC from '../../assets/BSC.png';
import BNB from '../../assets/BNB.png';
import ETH from '../../assets/ETH.png';
import SOL from '../../assets/SOL.png';
import BUSD from '../../assets/BUSD.png';
import TRX from '../../assets/TRX.png';
import MATIC from '../../assets/MATIC.png';
import AVAXC from '../../assets/AVAXC.png';
import XTZ from '../../assets/XTZ.png';
import { ReactComponent as QuestionMark } from '../../assets/question-mark.svg';
import { pxToRem, spacing } from '../../styles';

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
	XTZ,
};

type IconButtonsProps = {
	disabled?: boolean;
	icon: 'BSC' | 'USDT' | 'GLMR' | 'BTC' | 'BNB' | 'ETH' | 'SOL' | 'BUSD' | 'TRX' | 'MATIC' | 'AVAXC' | 'XTZ' | 'Select Token';
	onClick?: () => void;
	iconOnly?: boolean;
};

const Icon = styled.button(() => {
	const { state: { theme } } = useStore();

	return css`
		padding: ${spacing[8]};
		border: 1px solid ${theme.default};
		border-radius: ${pxToRem(6)};
		display: flex;
		align-items: center;
		justify-content: center;
		background: ${theme.button.icon};
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
	;
	`;
});

const Img = styled.img(
	({ iconOnly }: IconButtonsProps) => {

		return css`
			height: ${iconOnly ? pxToRem(25) : pxToRem(42)};
			width: ${iconOnly ? pxToRem(25) : pxToRem(42)};
			margin-right: ${iconOnly ? pxToRem(10) : pxToRem(0)};
			cursor: pointer;
		`;
	});

export const IconButton = ({ disabled = false, icon, onClick, iconOnly }: IconButtonsProps) => {
	return (
		!iconOnly ?
			<Icon
				disabled={disabled}
				onClick={onClick}
			>
				{!icon || icon === 'Select Token' ? <QuestionMark style={{ width: 42, height: 42 }} /> :
					// @ts-ignore
					<Img
						src={icons[icon]}
						alt={icon}
					/>}
			</Icon> : !icon || icon === 'Select Token' ?
				<QuestionMark style={{ width: 42, height: 42 }} /> :
				// @ts-ignore
				<Img
					src={icons[icon]}
					alt={icon}
					iconOnly
				/>
	);
};
