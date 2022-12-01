import React, { createContext, ReactNode, useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { fontSize, mediaQuery, spacing, DEFAULT_BORDER_RADIUS } from '../../styles';
import type { ColorType } from '../../styles';
import { useStore } from '../../helpers';
import { IconButton } from '../iconButton/iconButton';

const ToastContext = createContext({});

const ToastContainer = styled.div`
	position: fixed;
	right: ${spacing[40]};
	bottom: ${spacing[48]};
	overflow-wrap: break-word;
	max-width: 335px;

	${mediaQuery('xs')} {
		right: 0;
		bottom: 0;
		width: 100%;
		max-width: none;
	}
`;

const Toaster = styled.div(({ color }: { color: ColorType }) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		align-items: center;
		background: ${theme.button[color]};
		color: ${theme.background.default};
		cursor: pointer;
		font-size: ${fontSize[14]};
		margin: ${spacing[10]};
		padding: ${spacing[10]};
		gap: ${spacing[8]};
		border-radius: ${DEFAULT_BORDER_RADIUS};
	`;
});

type Props = {
	message: string;
	type?: 'info' | 'warning' | 'error' | 'success';
	timer?: number;
	onDismiss: () => void;
};

const Toast = ({ message, onDismiss, type = 'error' }: Props) => {
	const icon = type?.toUpperCase();
	const color = type === 'info' ? 'default' : type;

	return (
		<Toaster color={color} onClick={onDismiss}>
			<IconButton
				// @ts-ignore
				icon={icon}
				iconOnly
			/>
			{message}
		</Toaster>
	);
};

let toastCount = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [toasts, setToasts] = useState<
		{ message: string; id: number; type: string; timer: number }[]
	>([]);

	const addToast = (message: string, type = 'error', timer = 5000) => {
		const id = toastCount++;
		const toast = { message, id, type, timer };
		setToasts([...toasts, toast]);
	};
	const remove = (id: number) => {
		const newToasts = toasts.filter((t) => t.id !== id);
		setToasts(newToasts);
	};
	// avoid creating a new fn on every render
	const onDismiss = (id: number) => () => remove(id);

	if (toasts.length > 0) {
		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast !== toasts[toasts.length - 1]));
		}, toasts[toasts.length - 1].timer);
	}

	return (
		<ToastContext.Provider value={{ addToast, remove }}>
			{children}
			<ToastContainer>
				{toasts.map(({ message, id, type }: { message: string; id: number; type: any }) => (
					<Toast key={id} message={message} type={type} onDismiss={onDismiss(id)} />
				))}
			</ToastContainer>
		</ToastContext.Provider>
	);
};

export const useToasts = () => useContext(ToastContext);
