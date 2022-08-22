import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { fontSize, mediaQuery, pxToRem, spacing } from '../../styles';
import { useStore } from '../../helpers';

const ModalWrapper = styled.div(({ width, showModal, background }: Props) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: ${showModal ? 'block' : 'none'};
		justify-content: center;
		align-items: center;
		z-index: 100;
		width: ${pxToRem(width === 'large' ? 605 : 478)}; // TODO: improove operator
		max-width: calc(100% - ${spacing[64]});
		background-color: ${theme.background[background]};
		border: 1px solid ${theme.default};
		border-radius: ${pxToRem(6)};
		padding: ${spacing[12]};

		${mediaQuery('xxs')} {
			// TODO: mobile style
			max-width: ${pxToRem(347)};
			width: calc(100% - ${pxToRem(10)});
			border-radius: ${pxToRem(28)};
			border: none;
			margin: 0 auto;
			margin-top: ${spacing[48]};
		}
	`;
});

const CloseIcon = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		cursor: pointer;
		position: fixed;
		top: 10px;
		right: 10px;
		font-size: ${fontSize[16]};
		line-height: ${fontSize[22]};
		color: ${theme.font.pure};
	`;
});

type Props = {
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
	width?: 'large' | 'small';
	background: 'default' | 'mobile';
	children?: ReactNode;
};

export const Modal = ({
	showModal,
	setShowModal,
	width = 'large',
	background,
	children
}: Props) => {
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
