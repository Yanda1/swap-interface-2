import styled, { css } from 'styled-components';
import { useStore } from '../../helpers';
import USDT from '../../assets/USDT.png';
import GLMR from '../../assets/GLMR.png';
import BTC from '../../assets/BTC.png';
import BNB from '../../assets/BNB.png';
import ETH from '../../assets/ETH.png';
import SOL from '../../assets/SOL.png';
import BUSD from '../../assets/BUSD.png';
import TRX from '../../assets/TRX.png';
import MATIC from '../../assets/MATIC.png';
import { pxToRem, spacing } from '../../styles';

const icons = {
	USDT,
	GLMR,
	BTC,
	BNB,
	ETH,
	SOL,
	BUSD,
	TRX,
	MATIC,
};

type IconButtonsProps = {
	disabled?: boolean;
	icon: 'USDT' | 'GLMR' | 'BTC' | 'BNB' | 'ETH' | 'SOL' | 'BUSD'| 'TRX' | 'MATIC';
	onClick?: () => void;
};

const Icon = styled.button(() => {
	const {state: {theme}} = useStore();

	return css `
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
		};
`;
});

const Img = styled.img(() => {
	return css `
		height: ${pxToRem(42)};
		width: ${pxToRem(42)};
`;
});

export const IconButton = ({disabled = false, icon, onClick }: IconButtonsProps) => {

	return  (
		onClick ? <Icon disabled={disabled} onClick={onClick}>
			<Img src={icons[icon]} alt={icon} />
		</Icon> : <Img src={icons[icon]} alt={icon} style={{marginRight: spacing[10], width: '25px', height: '25px'}} />
	);
};
