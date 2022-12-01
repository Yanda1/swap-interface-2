import { useState } from 'react';
import styled from 'styled-components';
import { Portal, TextField, Button, Switch } from '../../components';
import { spacing } from '../../styles';

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
	gap: ${spacing[28]};
	width: 100%;
`;

const Newsletter = styled.div`
	display: flex;
	justify-content: space-between;
	gap: ${spacing[8]};

	& input {
		flex: 2;
	}

	& button {
		flex: 1;
	}
`;

const Notifications = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: ${spacing[12]};
`;

type Props = {
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
};

export const NotificationsModal = ({ showModal, setShowModal }: Props) => {
	const [email, setEmail] = useState('');

	return (
		<Portal handleClose={() => setShowModal(false)} isOpen={showModal}>
			<Wrapper>
				<Newsletter>
					<TextField
						value={email}
						size="small"
						placeholder="Insert email address"
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Button variant="secondary" color="default" onClick={() => console.log('save email')}>
						Save
					</Button>
				</Newsletter>
				<Notifications>
					Notifications
					<Switch />
				</Notifications>
			</Wrapper>
		</Portal>
	);
};
