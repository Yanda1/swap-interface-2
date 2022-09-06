import React, { createContext, ReactNode, useContext, useState } from 'react';
import styled from 'styled-components';
import {fontSize, pxToRem, spacing} from '../../styles';
import {useStore} from '../../helpers';
import {IconButton} from '../iconButton/iconButton';

const ToastContext = createContext(undefined);

const ToastContainer = styled.div`
	position: fixed;
	right: 0;
	bottom: 0;
`;

type Props = {
	message: string;
	type: 'default' | 'warning' | 'error' | 'success';
	timer?: number;
	onDismiss: () => void;
};

const Toast = ({ message, onDismiss, type }: Props) => {
	const { state: { theme } } = useStore();

	return <div
		style={{
			display: 'flex',
			alignItems: 'center',
			background: `${theme.button[type]}`,
			color: `${theme.font.pure}`,
			cursor: 'pointer',
			fontSize: `${fontSize[14]}`,
			margin: `${spacing[10]}`,
			padding: `${spacing[10]}`,
			borderRadius: `${pxToRem(4)}`
	}}
		onClick={onDismiss}>
		<IconButton
			// @ts-ignore
			icon={type.toUpperCase()}
			iconOnly
		/>
		{message}
	</div>;
};

let toastCount = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [toasts, setToasts] = useState<{ message: string; id: number; type: string; timer: number }[]>
	([
		{message: 'Wallet was successfully connected!', id: 130, type: 'default', timer: 2000},
		{message: 'Swap was ended!', id: 230, type: 'success', timer: 2000},
		{message: 'Swap was paused!', id: 330, type: 'warning', timer: 2000},
		{message: 'Transaction was failed!', id: 430, type: 'error', timer: 2000}
	]);

	const addToast = (message: string, type: string, timer = 5000) => {
		const id = toastCount++;
		const toast = { message, id, type, timer };
		console.log({message, timer});
		setToasts([...toasts, toast]);
	};
	const remove = (id: number) => {
		// @ts-ignore
		const newToasts = toasts.filter((t) => t.id !== id);
		setToasts(newToasts);
	};
	// avoid creating a new fn on every render
	const onDismiss = (id: number) => () => remove(id);

	if (toasts.length > 0) {
		setTimeout(() => {
				setToasts(prev => prev.filter(toast => toast !== toasts[toasts.length - 1]));
		}, toasts[toasts.length - 1].timer);
	}

	return (
		// @ts-ignore
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
