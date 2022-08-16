import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { fontSize, mediaQuery, pxToRem, spacing } from '../../styles';
import { useStore } from '../../helpers';

type Props = {
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
	width?: 'large' | 'small';
	background: 'default' | 'mobile';
	children?: ReactNode;
};

const ModalWrapper = styled.div(
	({ width, showModal, background }: Props) => {
		const { state: { theme } } = useStore();

		return css`
			position: fixed;
			display: ${showModal ? 'flex' : 'none'};
			justify-content: center;
			align-items: center;
			top: 50%;
			left: 50%;
			right: 50%;
			transform: translate(-50%, -50%);
			width: 100%;
			z-index: 1000;
			max-width: ${pxToRem(width === 'large' ? 605 : 478)}; // TODO: improove operator
			margin: 0 ${spacing[20]};
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

const CloseIcon = styled.div(
	() => {
		const { state: { theme } } = useStore();

		return css`
			cursor: pointer;
			position: fixed;
			top: 10px;
			right: 10px;
			font-size: ${fontSize[16]};
			line-height: ${fontSize[22]};
			color: ${theme.font.pure};
		`;
	}
);

export const Modal = ({ showModal, setShowModal, width = 'large', background, children }: Props) => {
	const handleClose = () => {
		setShowModal(false);
	};

	return (
		// @ts-ignore
		<ModalWrapper width={width} showModal={showModal} background={background}>
			<CloseIcon onClick={handleClose}>&#x2716;</CloseIcon>
			{children}
		</ModalWrapper>
	);
};
