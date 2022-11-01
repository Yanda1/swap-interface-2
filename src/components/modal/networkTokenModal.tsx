import { useEffect, useState } from 'react';
import styled from 'styled-components';
import destinationNetworks from '../../data/destinationNetworks.json';
import sourceNetworks from '../../data/sourceNetworks.json';
import { mediaQuery, spacing } from '../../styles';
import { SelectList, Modal, Button } from '../../components';
import {
	DestinationEnum,
	isNetworkSelected,
	isTokenSelected,
	SourceEnum,
	SOURCE_NETWORK_NUMBER,
	useBreakpoint,
	useStore
} from '../../helpers';
import type { DestinationNetworks, SourceNetworks } from '../../helpers';

const ChildWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin: ${spacing[56]} 0;
	justify-content: center;
	column-gap: ${spacing[28]};
	row-gap: ${spacing[22]};

	${mediaQuery(515)} {
		// TODO: all 515 values should be one const
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
	type: 'SOURCE' | 'DESTINATION';
};

export const NetworkTokenModal = ({ showModal, setShowModal, type }: Props) => {
	const [isDisabled, setIsDisabled] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	const [isShowList, setIsShowList] = useState(true);
	const { isBreakpointWidth } = useBreakpoint(516);
	const {
		dispatch,
		state: { destinationNetwork, destinationToken, sourceNetwork, sourceToken }
	} = useStore();
	const isSource = type === 'SOURCE';

	useEffect(() => {
		if (isBreakpointWidth) {
			setIsMobile(true);
			setIsShowList(true);
		} else {
			setIsMobile(false);
		}
	}, [isBreakpointWidth]);

	useEffect(() => {
		setIsDisabled((isSource) =>
			isSource
				? !isNetworkSelected(sourceNetwork) || !isTokenSelected(sourceToken)
				: !isNetworkSelected(destinationNetwork) || !isTokenSelected(destinationToken)
		);
	}, [destinationNetwork, destinationToken, sourceNetwork, sourceToken]);

	const destinationNetworksList = Object.keys(destinationNetworks);
	const destinationTokensList =
		isNetworkSelected(destinationNetwork) &&
		Object.keys(destinationNetworks?.[destinationNetwork as DestinationNetworks]?.['tokens']);

	const sourceNetworksList = Object.keys(sourceNetworks).map(
		// @ts-ignore
		(item: SourceNetworks) => sourceNetworks[item]?.shortName
	);
	const sourceTokensList =
		isNetworkSelected(sourceNetwork) &&
		Object.keys(
			// @ts-ignore
			sourceNetworks?.[SOURCE_NETWORK_NUMBER[sourceNetwork] as SourceNetworks]?.['tokens']
		);

	const handleSubmit = () => {
		setShowModal(!showModal);
	};

	const handleBack = () => {
		setIsShowList(true);
		dispatch({
			type: isSource ? SourceEnum.TOKEN : DestinationEnum.TOKEN,
			payload: 'Select Token'
		});
	};

	useEffect(() => {
		setIsShowList(true);
	}, [showModal]);

	return !isMobile ? (
		<div data-testid="network">
			<Modal showModal={showModal} setShowModal={setShowModal} background="mobile">
				<ChildWrapper>
					{(isSource ? sourceNetworksList : destinationNetworksList)?.length > 0 ? (
						<>
							<SelectList
								value={isSource ? 'SOURCE_NETWORK' : 'NETWORK'}
								data={isSource ? sourceNetworksList : destinationNetworksList}
								placeholder="Network Name"
							/>
							<SelectList
								value={isSource ? 'SOURCE_TOKEN' : 'TOKEN'}
								data={isSource ? sourceTokensList : destinationTokensList}
								placeholder="Token Name"
							/>
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
					{(isSource ? sourceNetworksList : destinationNetworksList)?.length > 0 ? (
						<>
							{isShowList && (
								<SelectList
									value="NETWORK"
									data={isSource ? sourceNetworksList : destinationNetworksList}
									placeholder="Network Name"
								/>
							)}
							{!isShowList && (
								<SelectList
									value="TOKEN"
									data={isSource ? sourceTokensList : destinationTokensList}
									placeholder="Token Name"
								/>
							)}
						</>
					) : (
						<div>No available networks...</div>
					)}
					{isShowList && (
						<NextBtnContainer>
							<Button
								onClick={() => setIsShowList(false)}
								color={
									isNetworkSelected(isSource ? sourceNetwork : destinationNetwork)
										? 'transparent'
										: 'transparent'
								}
								disabled={!isNetworkSelected(isSource ? sourceNetwork : destinationNetwork)}>
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
