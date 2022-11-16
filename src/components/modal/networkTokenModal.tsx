import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import DESTINATION_NETWORKS from '../../data/destinationNetworks.json';
import SOURCE_NETWORKS from '../../data/sourceNetworks.json';
import { mediaQuery, spacing } from '../../styles';
import { SelectList, Portal, Button } from '../../components';
import {
	DestinationEnum,
	CHAINS,
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
	const { isBreakpointWidth: isMobile } = useBreakpoint(480);
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
			(id) => CHAINS[id]?.name
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

	const destinationNetworksList = useMemo(() => {
		if (isNetworkSelected(sourceNetwork) && isTokenSelected(sourceToken)) {
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
	}, [sourceToken, sourceNetwork]);

	const destinationTokensList = useMemo(() => {
		const tokensFromJson =
			// @ts-ignore
			DESTINATION_NETWORKS[NETWORK_TO_ID[sourceNetwork]]?.[sourceToken]?.[
				destinationNetwork as DestinationNetworks
			]?.['tokens'];

		const filteredTokens = (tokensFromJson ? Object.keys(tokensFromJson) : []).filter(
			(token) => token !== sourceToken
		);

		return _.orderBy(filteredTokens);
	}, [sourceToken, destinationNetwork, sourceNetwork]);

	const handleSubmit = () => {
		setShowModal(!showModal);
	};

	const handleBack = () => {
		setShowsNetworkList(true);
		dispatch({
			type: isSource ? SourceEnum.TOKEN : DestinationEnum.TOKEN,
			payload: isSource ? 'Select Token' : 'Select Token'
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
		}
	}, [chainId]);

	return !isMobile ? (
		<Portal handleClose={() => setShowModal(false)} isOpen={showModal}>
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
						{isDisabled ? 'Please select Network and Token' : 'Select'}
					</Button>
				</Wrapper>
			)}
		</Portal>
	) : (
		<Portal
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
						NEXT
					</Button>
				)}
				{!showsNetworkList && (
					<Button color="transparent" onClick={handleSubmit} disabled={isDisabled}>
						{isDisabled ? 'Please select Token' : 'Select'}
					</Button>
				)}
			</Wrapper>
		</Portal>
	);
};
