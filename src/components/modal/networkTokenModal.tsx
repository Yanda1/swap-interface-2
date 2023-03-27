import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { mediaQuery, spacing } from '../../styles';
import { SelectList, Portal, Button } from '../../components';
import { useMedia } from '../../hooks';
import {
	CHAINS,
	DefaultSelectEnum,
	DestinationEnum,
	isNetworkSelected,
	isTokenSelected,
	NETWORK_TO_ID,
	SourceEnum,
	AmountEnum,
	useStore
} from '../../helpers';
import type { DestinationNetworks } from '../../helpers';
import _ from 'lodash';
import { useEthers } from '@usedapp/core';

const Wrapper = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	row-gap: ${spacing[22]};

	${mediaQuery('xs')} {
		flex-direction: column;
		flex-wrap: nowrap;
	}
`;

const SelectWrapper = styled.div`
	display: flex;
	flex-grow: 1;
	align-self: stretch;
	overflow: hidden;
	width: 100%;
	gap: ${spacing[18]};
`;

type Props = {
	showModal: boolean;
	setShowModal: (prev: boolean) => void;
	type: 'SOURCE' | 'DESTINATION';
};

export const NetworkTokenModal = ({ showModal, setShowModal, type }: Props) => {
	const { chainId } = useEthers();

	const [showsNetworkList, setShowsNetworkList] = useState(true);
	const { mobileWidth: isMobile } = useMedia('xs');
	const {
		dispatch,
		state: { 
			destinationNetwork,
			destinationToken,
			sourceNetwork,
			sourceToken,
			availableSourceNetworks: SOURCE_NETWORKS,
			availableDestinationNetworks: DESTINATION_NETWORKS
		}
	} = useStore();

	const isSource = type === 'SOURCE';

	const isDisabled = useMemo(
		() =>
			isSource
				? !isNetworkSelected(sourceNetwork) || !isTokenSelected(sourceToken)
				: !isNetworkSelected(destinationNetwork) || !isTokenSelected(destinationToken),
		[destinationNetwork, destinationToken, sourceNetwork, sourceToken]
	);

	const sourceNetworksList = SOURCE_NETWORKS ? _.orderBy(
		Object.keys(SOURCE_NETWORKS).map(
			// @ts-ignore
			// eslint-disable-next-line
			(id) => CHAINS[id]?.name
		)
	) : [];

	const sourceTokensList = useMemo(
		() =>
			SOURCE_NETWORKS && isNetworkSelected(sourceNetwork)
				? // @ts-ignore
				  _.orderBy(Object.keys(SOURCE_NETWORKS[NETWORK_TO_ID[sourceNetwork]]?.['tokens']))
				: [],
		[SOURCE_NETWORKS, sourceNetwork]
	);

	const destinationNetworksList = useMemo(() => {
		if (DESTINATION_NETWORKS && isNetworkSelected(sourceNetwork) && isTokenSelected(sourceToken)) {
			const allDestinationNetworks = Object.keys(
				// @ts-ignore
				DESTINATION_NETWORKS[NETWORK_TO_ID[sourceNetwork]]?.[sourceToken]
			);
			const filteredDestinationNetworks = allDestinationNetworks.filter((network) => {
				const tokens = Object.keys(
					// @ts-ignores
					DESTINATION_NETWORKS[NETWORK_TO_ID[sourceNetwork]]?.[sourceToken]?.[network]?.['tokens']
				);

				return tokens.join('') !== sourceToken;
			});

			return _.orderBy(filteredDestinationNetworks);
		} else {
			return [];
		}
	}, [DESTINATION_NETWORKS, sourceToken, sourceNetwork]);

	const destinationTokensList = useMemo(() => {
		if (DESTINATION_NETWORKS) {
			const tokensFromJson =
				// @ts-ignore
				DESTINATION_NETWORKS[NETWORK_TO_ID[sourceNetwork]]?.[sourceToken]?.[
					destinationNetwork as DestinationNetworks
				]?.['tokens'];

			const filteredTokens = (tokensFromJson ? Object.keys(tokensFromJson) : []).filter(
				(token) => token !== sourceToken
			);
			
			return _.orderBy(filteredTokens);
		} else {
			return [];
		}
	}, [DESTINATION_NETWORKS, sourceToken, destinationNetwork, sourceNetwork]);

	const handleSubmit = () => {
		setShowModal(!showModal);
	};

	const handleBack = () => {
		setShowsNetworkList(true);
		dispatch({
			type: isSource ? SourceEnum.TOKEN : DestinationEnum.TOKEN,
			payload: DefaultSelectEnum.TOKEN
		});
	};

	useEffect(() => {
		setShowsNetworkList(true);
	}, [showModal]);

	useEffect(() => {
		if (chainId && Object.keys(CHAINS).includes(chainId.toString())) {
			dispatch({
				type: SourceEnum.NETWORK,
				// @ts-ignore
				payload: CHAINS[chainId.toString()]?.name
			});
			dispatch({
				type: SourceEnum.TOKEN,
				// @ts-ignore
				payload: CHAINS[chainId.toString()].name
			});
			dispatch({ type: AmountEnum.AMOUNT, payload: '' });
			dispatch({ type: DestinationEnum.AMOUNT, payload: '' });
		}
	}, [chainId]);

	return !isMobile ? (
		<Portal handleClose={() => setShowModal(false)} isOpen={showModal} size="large">
			{(isSource ? sourceNetworksList : destinationNetworksList)?.length > 0 && (
				<Wrapper>
					<SelectWrapper>
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
					</SelectWrapper>
					<Button disabled={isDisabled} onClick={handleSubmit} color="transparent">
						{isDisabled ? 'Select Network and Token' : 'Select'}
					</Button>
				</Wrapper>
			)}
		</Portal>
	) : (
		<Portal
			size="large"
			handleClose={() => setShowModal(false)}
			isOpen={showModal}
			hasBackButton={!showsNetworkList}
			handleBack={handleBack}>
			<Wrapper>
				{/* @ts-ignore */}
				{(isSource ? sourceNetworksList : destinationNetworksList)?.length > 0 ? (
					<>
						{showsNetworkList && (
							<SelectList
								value={isSource ? 'SOURCE_NETWORK' : 'NETWORK'}
								data={isSource ? sourceNetworksList : destinationNetworksList}
								placeholder="Network Name"
							/>
						)}
						{!showsNetworkList && (
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
				{showsNetworkList && (
					<Button
						color="transparent"
						onClick={() => setShowsNetworkList(false)}
						disabled={!isNetworkSelected(isSource ? sourceNetwork : destinationNetwork)}>
						Next
					</Button>
				)}
				{!showsNetworkList && (
					<Button color="transparent" onClick={handleSubmit} disabled={isDisabled}>
						{isDisabled ? 'Select Token' : 'Select'}
					</Button>
				)}
			</Wrapper>
		</Portal>
	);
};
