import { createContext, ReactNode, useContext, useState } from 'react';
import styled from 'styled-components';
import {fontSize, pxToRem, spacing} from '../../styles';
import {useStore} from '../../helpers';

const ToastContext = createContext(undefined);

const ToastContainer = styled.div`
	position: fixed;
	right: 0;
	bottom: 0;
`;

type Props = {
	message: string;
	type?: 'default' | 'warning' | 'error' | 'success';
	onDismiss: () => void;
};

const Toast = ({ message, onDismiss, type }: Props) => {
	const { state: { theme } } = useStore();

	return <div
		style={{
			background: type ? `${theme.button[type]}` : 'LemonChiffon',
			color: '#FFF',
			cursor: 'pointer',
			fontSize: `${fontSize[14]}`,
			margin: `${spacing[10]}`,
			padding: `${spacing[10]}`,
			borderRadius: `${pxToRem(4)}`
	}}
		onClick={onDismiss}>
		{message}
	</div>;
};

let toastCount = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [toasts, setToasts] = useState<{ message: string; id: number; type: string }[]>
	([
		{message: 'Wallet was successfully connected.', id: 1, type: 'default'},
		{message: 'Something went wrong in handleButtonClick call.', id: 2, type: 'error'},
		{message: 'Please check destination address', id: 3, type: 'warning'},
		{message: 'Swap was ended!.', id: 4, type: 'success'}
	]);

	const addToast = (message: string, type: string) => {
		const id = toastCount++;
		const toast = { message, id, type };
		setToasts([...toasts, toast]);
	};
	const remove = (id: number) => {
		// @ts-ignore
		const newToasts = toasts.filter((t) => t.id !== id);
		setToasts(newToasts);
	};
	// avoid creating a new fn on every render
	const onDismiss = (id: number) => () => remove(id);

	setTimeout(() => {
		if(toasts.length > 0) {
			// remove(toasts[toasts.length - 1].id);
			setToasts(prev => prev.filter(toast => toast !== toasts[toasts.length - 1]));
		}
	}, 5000);

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
