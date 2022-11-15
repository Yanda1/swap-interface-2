import { ReactNode, useLayoutEffect, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { createPortal } from 'react-dom';
import { DEFAULT_BORDER_RADIUS, fontSize, pxToRem, spacing } from '../../styles';
import type { ThemeProps } from '../../styles';
import { hexToRgbA, useStore } from '../../helpers';
import { useClickOutside } from '../../hooks';

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
		z-index: 1_000;
		padding: ${spacing[40]} ${spacing[20]};
	`
);

const Content = styled.div(
	({ theme }: ThemeProps) => css`
		max-width: 100%;
		max-height: 100%;
		background-color: ${theme.modal.default};
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		padding: ${spacing[40]} ${spacing[22]};
		border-radius: ${DEFAULT_BORDER_RADIUS};
		border: 1px solid ${theme.modal.border};
		box-shadow: ${pxToRem(10)} ${pxToRem(10)} ${pxToRem(20)} ${hexToRgbA(theme.modal.shadow)};
	`
);

const CloseIcon = styled.div(({ theme }: ThemeProps) => {
	return css`
		cursor: pointer;
		position: absolute;
		top: 0;
		right: 0;
		font-size: ${fontSize[16]};
		padding: ${spacing[12]} ${spacing[14]};
		font-weight: 400;
		color: ${theme.font.pure};
	`;
});

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

const PortalWrapper = ({ children, wrapperId = 'react-portal-wrapper' }: WrapperProps) => {
	const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null);

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
	}, [wrapperId]);

	if (wrapperElement === null) return null;

	return createPortal(children, wrapperElement);
};

type Props = {
	children: ReactNode;
	isOpen: boolean;
	size?: 'large' | 'small';
	handleClose: () => void;
};

export const Portal = ({ children, isOpen, handleClose, size = 'large' }: Props) => {
	const {
		state: { theme }
	} = useStore();

	const domNode = useClickOutside(() => {
		handleClose();
	});

	useEffect(() => {
		const closeOnEscapeKey = (e: any) => (e.key === 'Escape' ? handleClose() : null);
		document.body.addEventListener('keydown', closeOnEscapeKey);

		return () => {
			document.body.removeEventListener('keydown', closeOnEscapeKey);
		};
	}, [handleClose]);

	return isOpen ? (
		<PortalWrapper wrapperId="react-portal-modal-container">
			<Wrapper theme={theme}>
				{/* @ts-ignore */}
				<Content theme={theme} size={size} ref={domNode}>
					<CloseIcon onClick={handleClose} theme={theme}>
						&#x2715;
					</CloseIcon>
					{children}
				</Content>
			</Wrapper>
		</PortalWrapper>
	) : null;
};
