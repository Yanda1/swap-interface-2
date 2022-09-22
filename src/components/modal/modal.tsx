import { ReactNode, useEffect } from 'react';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import { fontSize, mediaQuery, pxToRem, spacing } from '../../styles';
import { defaultBorderRadius, useStore, DestinationNetworkEnum } from '../../helpers';
import type { ThemeProps } from '../../styles';

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
		width: ${pxToRem(width === 'large' ? 605 : 478)};
		max-width: calc(100% - ${spacing[64]});
		background-color: ${theme.background[background]};
		border: 1px solid ${theme.font.default};
		border-radius: ${defaultBorderRadius};
		padding: ${spacing[12]};

		${mediaQuery('xxs')} {
			width: calc(100% - ${pxToRem(10)});
		}
	`;
});

const CloseIcon = styled.div(({ theme }: ThemeProps) => {
	return css`
		cursor: pointer;
		position: fixed;
		top: ${pxToRem(10)};
		right: ${pxToRem(10)};
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
	const [selectedTokenNetwork, setSelectedTokenNetwork] = useState({ network: '', token: '' });
	const {
		state: { theme, destinationNetwork, destinationToken },
		dispatch
	} = useStore();

	useEffect(() => {
		if (showModal) {
			setSelectedTokenNetwork({ network: destinationNetwork, token: destinationToken });
		}
	}, [showModal]);

	const handleClose = () => {
		dispatch({ type: DestinationNetworkEnum.NETWORK, payload: selectedTokenNetwork.network });
		dispatch({ type: DestinationNetworkEnum.TOKEN, payload: selectedTokenNetwork.token });
		setShowModal(false);
	};

	return (
		<ModalWrapper
			width={width}
			showModal={showModal}
			background={background}
			data-testid="modal-container"
			setShowModal={setShowModal}
		>
			<CloseIcon onClick={handleClose} theme={theme}>
				&#x2716;
			</CloseIcon>
			{children}
		</ModalWrapper>
	);
};
