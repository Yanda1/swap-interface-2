import { createContext, ReactNode, useContext, useState } from 'react';
import styled from 'styled-components';

const ToastContext = createContext(undefined);

const ToastContainer = styled.div`
	position: fixed;
	right: 0;
	bottom: 0;
`;

type Props = {
	message: string;
	onDismiss: () => void;
};

const Toast = ({ message, onDismiss }: Props) => (
	<div
		style={{
			background: 'LemonChiffon',
			cursor: 'pointer',
			fontSize: 14,
			margin: 10,
			padding: 10
		}}
		onClick={onDismiss}>
		{message}
	</div>
);

let toastCount = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [toasts, setToasts] = useState<{ message: string; id: number }[]>([]);

	const addToast = (message: string) => {
		const id = toastCount++;
		const toast = { message, id };
		setToasts([...toasts, toast]);
	};
	const remove = (id: number) => {
		// @ts-ignore
		const newToasts = toasts.filter((t) => t.id !== id);
		setToasts(newToasts);
	};
	// avoid creating a new fn on every render
	const onDismiss = (id: number) => () => remove(id);

	return (
		// @ts-ignore
		<ToastContext.Provider value={{ addToast, remove }}>
			{children}
			<ToastContainer>
				{toasts.map(({ message, id }: { message: string; id: number }) => (
					<Toast key={id} message={message} onDismiss={onDismiss(id)} />
				))}
			</ToastContainer>
		</ToastContext.Provider>
	);
};

export const useToasts = () => useContext(ToastContext);
