import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import DESTINATION_NETWORKS from '../../data/destinationNetworks.json';
import SOURCE_NETWORKS from '../../data/sourceNetworks.json';
import { mediaQuery, spacing } from '../../styles';
import { SelectList, Modal, Button, NETWORK_PARAMS } from '../../components';
import {
	DestinationEnum,
	ID_TO_NETWORK,
	isNetworkSelected,
	isTokenSelected,
	NETWORK_TO_ID,
	SourceEnum,
	useBreakpoint,
	useStore
} from '../../helpers';
import type { DestinationNetworks } from '../../helpers';
import _ from 'lodash';
import { useEthers } from '@usedapp/core';

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
	const { chainId } = useEthers();

	const [isShowList, setIsShowList] = useState(true);
	const { isBreakpointWidth: isMobile } = useBreakpoint(516);
	const {
		dispatch,
		state: { destinationNetwork, destinationToken, sourceNetwork, sourceToken }
	} = useStore();

	const isSource = type === 'SOURCE';

	const isDisabled = useMemo(
		() =>
			isSource
				? !isNetworkSelected(sourceNetwork) || !isTokenSelected(sourceToken)
				: !isNetworkSelected(destinationNetwork) || !isTokenSelected(destinationToken),
		[destinationNetwork, destinationToken, sourceNetwork, sourceToken]
	);

	const sourceNetworksList = _.orderBy(
		Object.keys(SOURCE_NETWORKS).map(
			// @ts-ignore
			// eslint-disable-next-line
			(id) => ID_TO_NETWORK[id]
		)
	);

	const sourceTokensList = useMemo(
		() =>
			isNetworkSelected(sourceNetwork)
				? // @ts-ignore
				  _.orderBy(Object.keys(SOURCE_NETWORKS[NETWORK_TO_ID[sourceNetwork]]?.['tokens']))
				: [],
		[sourceNetwork]
	);

	const destinationNetworksList = useMemo(
		() =>
			isNetworkSelected(sourceNetwork) && isTokenSelected(sourceToken)
				? // @ts-ignore
				  _.orderBy(Object.keys(DESTINATION_NETWORKS[NETWORK_TO_ID[sourceNetwork]]?.[sourceToken]))
				: [],
		[sourceToken, sourceNetwork]
	);

	const destinationTokensList = useMemo(() => {
		if (isNetworkSelected(destinationNetwork)) {
			const tokens = Object.keys(
				// @ts-ignore
				DESTINATION_NETWORKS[NETWORK_TO_ID[sourceNetwork]]?.[sourceToken]?.[
					destinationNetwork as DestinationNetworks
				]?.['tokens']
			);

			const filteredTokens = tokens.filter((token) => token !== sourceToken);

			return _.orderBy(filteredTokens);
		} else {
			return [];
		}
	}, [destinationNetwork]);

	const handleSubmit = () => {
		setShowModal(!showModal);
	};

	const handleBack = () => {
		setIsShowList(true);
		dispatch({
			type: isSource ? SourceEnum.TOKEN : DestinationEnum.TOKEN,
			payload: isSource ? 'Select Token' : 'Select Token'
		});
	};

	useEffect(() => {
		setIsShowList(true);
	}, [showModal]);

	useEffect(() => {
		if (chainId && Object.keys(NETWORK_PARAMS).includes(chainId.toString())) {
			dispatch({
				type: SourceEnum.NETWORK,
				// @ts-ignore
				payload: ID_TO_NETWORK[chainId?.toString()]
			});
			dispatch({
				type: SourceEnum.TOKEN,
				// @ts-ignore
				payload: chainId === 1 ? 'ETH' : 'GLMR'
			});
		}
	}, [chainId]);

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
									value={isSource ? 'SOURCE_NETWORK' : 'NETWORK'}
									data={isSource ? sourceNetworksList : destinationNetworksList}
									placeholder="Network Name"
								/>
							)}
							{!isShowList && (
								<SelectList
									value={isSource ? 'SOURCE_TOKEN' : 'TOKEN'}
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
