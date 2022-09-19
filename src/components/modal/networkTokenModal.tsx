import { useEffect, useState } from 'react';
import styled from 'styled-components';
import destinationNetworks from '../../data/destinationNetworks.json';
import { Button } from '..';
import { mediaQuery, spacing } from '../../styles';
import { SelectList } from '../../components';
import { Modal } from './modal';
import { DestinationNetworkEnum, isNetworkSelected, isTokenSelected, useStore, useWindowSize } from '../../helpers';

const ChildWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin: ${spacing[56]} 0;
	justify-content: center;
	column-gap: ${spacing[28]};
	row-gap: ${spacing[22]};

	${mediaQuery(491)} {
		flex-direction: column;
		flex-wrap: nowrap;
	}
`;

const NextBtnContainer = styled.div`
	margin: ${spacing[40]} 0;
`;

type Props = {
	showModal: boolean;
	setShowModal: (prev: boolean) => void;
};

export const NetworkTokenModal = ({ showModal, setShowModal }: Props) => {
	const [isDisabled, setIsDisabled] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	const [isShowList, setIsShowList] = useState(true);
	const size = useWindowSize()[0];

	const {
		dispatch,
		state: { destinationNetwork, destinationToken }
	} = useStore();
// TODO: useBreakPoint (number)
	useEffect(() => {
		if (size <= 491 && size !== 0) {
			setIsMobile(true);
			setIsShowList(true);
		} else {
			setIsMobile(false);
		}
	}, [size]);

	useEffect(() => {
		setIsDisabled(
			() => !isNetworkSelected(destinationNetwork) || !isTokenSelected(destinationToken)
		);
	}, [destinationNetwork, destinationToken]);

	const networksList = Object.keys(destinationNetworks);
	const networkTokensList =
		isNetworkSelected(destinationNetwork) &&
		Object.keys(destinationNetworks?.[destinationNetwork as keyof typeof destinationNetworks]?.['tokens']);

	const handleSubmit = () => {
		setShowModal(!showModal);
	};

	const handleBack = () => {
		setIsShowList(true);
		dispatch({ type: DestinationNetworkEnum.TOKEN, payload: 'Select Token' });
	};

	useEffect(() => {
		setIsShowList(true);
	}, [showModal]);

	return !isMobile ? (
		<div data-testid="network">
			<Modal showModal={showModal} setShowModal={setShowModal} background="mobile">
				<ChildWrapper>
					{networksList?.length > 0 ? (
						<>
							<SelectList value="NETWORK" data={networksList} placeholder="Network Name" />
							<SelectList value="TOKEN" data={networkTokensList} placeholder="Token Name" />
						</>
					) : (
						<div>No available networks...</div>
					)}
					<Button disabled={isDisabled} onClick={handleSubmit} color="default">
						{isDisabled ? 'Please select Network and Token' : 'Select'}
					</Button>
				</ChildWrapper>
			</Modal>
		</div>
	) : (
		<div data-testid="network">
			<Modal showModal={showModal} setShowModal={setShowModal} background="mobile">
				<ChildWrapper>
					{networksList?.length > 0 ? (
						<>
							{isShowList && (
								<SelectList value="NETWORK" data={networksList} placeholder="Network Name" />
							)}
							{!isShowList && (
								<SelectList value="TOKEN" data={networkTokensList} placeholder="Token Name" />
							)}
						</>
					) : (
						<div>No available networks...</div>
					)}
					{isShowList && (
						<NextBtnContainer>
							<Button
								onClick={() => setIsShowList(false)}
								color={isNetworkSelected(destinationNetwork) ? 'transparent' : 'transparent'}
								disabled={!isNetworkSelected(destinationNetwork)}>
								NEXT
							</Button>
						</NextBtnContainer>
					)}
					{!isShowList && (
						<Button disabled={isDisabled} onClick={handleSubmit} color="default">
							{isDisabled ? 'Please select Network and Token' : 'Select'}
						</Button>
					)}
					{!isShowList && (
						<Button onClick={handleBack} color="default">
							BACK
						</Button>
					)}
				</ChildWrapper>
			</Modal>
		</div>
	);
};
