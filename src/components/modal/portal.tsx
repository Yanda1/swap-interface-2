import { ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { createPortal } from 'react-dom';
import type { ThemeProps } from '../../styles';
import { DEFAULT_BORDER_RADIUS, pxToRem, spacing } from '../../styles';
import { DestinationEnum, hexToRgbA, useStore } from '../../helpers';
import { useClickOutside } from '../../hooks';

type StyledProps = ThemeProps & { size: PortalSizeProps };

const Wrapper = styled.div(
	({ theme }: ThemeProps) => css`
		position: fixed;
		inset: 0;
		background-color: ${hexToRgbA(theme.modal.background, '0.8')};
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		z-index: 1000;
	`
);

const Content = styled.div(
	({ theme, size }: StyledProps) => css`
		background-color: ${theme.modal.default};
		width: ${pxToRem(size === 'small' ? 450 : size === 'large' ? 685 : size === 'xs' ? 480 : 755)};
		max-width: calc(100% - ${spacing[40]});
		display: flex;
		box-sizing: border-box;
		align-items: stretch;
		justify-content: flex-start;
		position: ${size === 'small' ? 'absolute' : 'relative'};
		top: ${size === 'small' ? pxToRem(90) : null};
		padding: ${spacing[48]} ${spacing[22]} ${spacing[24]};
		border-radius: ${DEFAULT_BORDER_RADIUS};
		border: 1px solid ${theme.border.default};
		box-shadow: ${pxToRem(10)} ${pxToRem(10)} ${pxToRem(20)} ${hexToRgbA(theme.modal.shadow)};
		height: calc(100% - ${spacing[40]});
		max-height: ${pxToRem(size === 'small' ? 305 : size === 'large' ? 530 : size === 'xs' ? 200 : 690)};
	`
);

const BackButton = styled.div(
	({ theme }: ThemeProps) =>
		css`
			cursor: pointer;
			position: absolute;
			line-height: ${spacing[22]};
			top: 0;
			left: 0;
			padding: ${spacing[12]} ${spacing[22]};
			font-weight: 400;
			color: ${theme.font.secondary};
		`
);

const CloseIcon = styled(BackButton)`
	font-size: ${spacing[10]};
	padding: ${spacing[12]} ${spacing[14]};
	left: unset;
	right: 0;
`;

const createWrapperAndAppendToBody = (wrapperId: string) => {
	const wrapperElement = document.createElement('div') as HTMLElement;
	wrapperElement.setAttribute('id', wrapperId);
	document.body.appendChild(wrapperElement);

	return wrapperElement;
};

type WrapperProps = {
	children: ReactNode;
	wrapperId: string;
};

export type PortalSizeProps = 'xl' | 'large' | 'small' | 'xs';

const PortalWrapper = ({ children, wrapperId = 'react-portal-wrapper' }: WrapperProps) => {
	const [ wrapperElement, setWrapperElement ] = useState<HTMLElement | null>(null);

	useLayoutEffect(() => {
		let element = document.getElementById(wrapperId) as HTMLElement;
		let systemCreated = false;
		if (!element) {
			systemCreated = true;
			element = createWrapperAndAppendToBody(wrapperId);
		}
		setWrapperElement(element);

		return () => {
			if (systemCreated && element.parentNode) {
				element.parentNode.removeChild(element);
			}
		};
	}, [ wrapperId ]);

	if (wrapperElement === null) return null;

	return createPortal(children, wrapperElement);
};

type Props = {
	children: ReactNode;
	isOpen: boolean;
	hasBackButton?: boolean;
	size?: PortalSizeProps;
	handleClose: () => void;
	handleBack?: () => void;
	closeOutside?: boolean;
};

export const Portal = ({
												 children,
												 isOpen,
												 hasBackButton = false,
												 handleClose,
												 size = 'small',
												 handleBack,
												 closeOutside = true
											 }: Props) => {
	const {
		state: { theme, destinationNetwork, destinationToken, sourceNetwork, sourceToken },
		dispatch
	} = useStore();

	const domNode = useClickOutside(() => {
		if (isOpen && closeOutside) handleClick();
	});

	const [ selectedSourceTokenNetwork, setSelectedSourceTokenNetwork ] = useState({
		network: '',
		token: ''
	});
	const [ selectedDestinationTokenNetwork, setSelectedDestinationTokenNetwork ] = useState({
		network: '',
		token: ''
	});

	const handleClick = () => {
		if (selectedSourceTokenNetwork.network === sourceNetwork) {
			dispatch({ type: DestinationEnum.NETWORK, payload: selectedDestinationTokenNetwork.network });
			dispatch({ type: DestinationEnum.TOKEN, payload: selectedDestinationTokenNetwork.token });
		}
		handleClose();
	};

	useEffect(() => {
		if (isOpen) {
			setSelectedSourceTokenNetwork({ network: sourceNetwork, token: sourceToken });
			setSelectedDestinationTokenNetwork({ network: destinationNetwork, token: destinationToken });
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [ isOpen ]);

	useEffect(() => {
		const closeOnEscapeKey = (e: any) => {
			if (isOpen && e.key === 'Escape') handleClick();
		};
		document.body.addEventListener('keydown', closeOnEscapeKey);

		return () => {
			document.body.removeEventListener('keydown', closeOnEscapeKey);
		};
	});

	return isOpen ? (
		<PortalWrapper wrapperId="react-portal-modal-container">
			<Wrapper theme={theme}>
				{/* @ts-ignore */}
				<Content theme={theme} size={size} ref={closeOutside ? domNode : null}>
					{hasBackButton ? (
						<BackButton onClick={handleBack} theme={theme}>
							&#8592; BACK
						</BackButton>
					) : null}
					<CloseIcon onClick={handleClick} theme={theme}>
						&#x2715;
					</CloseIcon>
					{children}
				</Content>
			</Wrapper>
		</PortalWrapper>
	) : null;
};
