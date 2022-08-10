import styled from 'styled-components';
import { Button } from '..';
import { spacing } from '../../styles';
import { SelectList } from '../../components';
import { Modal } from './modal';
import { useState, useEffect } from 'react';
import { useStore } from '../../helpers';

const ChildWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin: ${spacing[56]} 0;
	justify-content: center;
	column-gap: ${spacing[28]};
	row-gap: ${spacing[22]};
`;
type SelectionProps = {
	network: string;
	token: string;
};
export const NetworkTokenModal  = () => {
	const [isDisabled, setIsDisabled] = useState(true);
	const { state: { network, token } } = useStore();

	useEffect(() => {
		setIsDisabled(() => (network === '' || token === ''));
	}, [network, token]);
	console.log(network, token);

	return (
		<Modal showModal={true} setShowModal={() => false} background='mobile'>
			<ChildWrapper>
				<SelectList
					value='NETWORK'
					data={['name', 'string', 'hello', 'goodbye', 'one', 'two', 'three', 'four', 'five', 'six', 'seven']}
					title='Select Network'
					placeholder='Network Name'/>
				<SelectList
					value='TOKEN'
					data={['name', 'string', 'hello', 'goodbye']}
					title='Select Token'
					placeholder='Token Name' />
				<Button
					disabled={isDisabled}
					onClick={() => console.log({ network, token })}>{isDisabled ? 'Please select Network and Token' : 'Select'}</Button>
			</ChildWrapper>
		</Modal>
	);
};
function useAuth() {
    throw new Error('Function not implemented.');
}

