import styled, { css } from 'styled-components';
import {fontSize, mediaQuery, pxToRem } from '../../styles';
import { useStore } from '../../helpers';

type Props = {
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
	width?: 'large' | 'small';
	background: 'default' | 'mobile';
	children?: React.ReactNode;
};

const ModalWrapper = styled.div(
	({ width, showModal, background } : Props) => {
		const { state } = useStore();
		const { theme } = state;

		return css`
			position: fixed;
			display: ${showModal ? 'inline-flex' : 'none'};
			justify-content: center;
			align-items: center;
			top: 50%;
			left: 50%;
			right: 50%;
			transform: translate(-50%, -50%);
			width: 100%;
			max-width: ${pxToRem(width === 'large' ? 605 : 478)}; // TODO: improove operator
			margin: 0 auto;
			background-color: ${theme.background[background]};
			border: 1px solid ${theme.default};
			border-radius: ${pxToRem(6)};
			${mediaQuery('xxs')} { // TODO: mobile style
				max-width: ${pxToRem(347)};
				width: calc(100% - ${pxToRem(10)});
				border-radius: ${pxToRem(28)};
				border: none;
				margin: 0 auto;
				margin-top: 50px;
			}
		`;
});

const CloseIcon = styled.div`
	cursor: pointer;
	position: fixed;
	top: 10px;
	right: 10px;
	font-size: ${fontSize[16]};
	line-height: ${fontSize[22]};
	color: #FFF;
	${mediaQuery('xxs')} {
		margin-right: ${pxToRem(9)};
		font-size: ${pxToRem(16)};
	}
`;

export const Modal = ({showModal = false, setShowModal, width = 'large', background, children}: Props) => {
	return (
		// @ts-ignore
		<ModalWrapper width={width} showModal={showModal} background={background}>
			<CloseIcon onClick={() => setShowModal(false)}>&#x2716;</CloseIcon>
			{children}
		</ModalWrapper>
	);
};
