import React, { createContext, ReactNode, useContext, useState } from 'react';
import styled from 'styled-components';
import { fontSize, mediaQuery, spacing } from '../../styles';
import { defaultBorderRadius, useStore } from '../../helpers';
import { IconButton } from '../iconButton/iconButton';

const ToastContext = createContext({});

const ToastContainer = styled.div`
	position: fixed;
	right: 0;
	bottom: 0;
	overflow-wrap: break-word;
	max-width: 335px;

	${mediaQuery('xs')} {
		width: 100%;
		max-width: none;
	}
`;

type Props = {
	message: string;
	type: 'default' | 'warning' | 'error' | 'success';
	timer?: number;
	onDismiss: () => void;
};

const Toast = ({ message, onDismiss, type }: Props) => {
	const {
		state: { theme }
	} = useStore();
	const icon = type.toUpperCase();

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				background: `${theme.button[type]}`,
				color: `${theme.font.pure}`,
				cursor: 'pointer',
				fontSize: `${fontSize[14]}`,
				margin: `${spacing[10]}`,
				padding: `${spacing[10]}`,
				borderRadius: `${defaultBorderRadius}`
			}}
			onClick={onDismiss}>
			<IconButton
				// @ts-ignore
				icon={icon}
				iconOnly
			/>
			{message}
		</div>
	);
};

let toastCount = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [toasts, setToasts] = useState<{ message: string; id: number; type: string; timer: number }[]>([]);

	const addToast = (message: string, type: string, timer = 5000) => {
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
