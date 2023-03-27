import { useCallback, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import {
	AmountEnum,
	DefaultSelectEnum,
	DestinationEnum,
	SourceEnum,
	useStore
} from '../../helpers';
import { Mainnet, Moonbeam, useEthers } from '@usedapp/core';
import { fontSize, spacing, DEFAULT_BORDER_RADIUS } from '../../styles';
import { Icon, NETWORK_PARAMS, TextField, useToasts } from '../../components';
import type { IconType } from '../../components';
import { ethers } from 'ethers';

const Wrapper = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		flex-direction: column;
		width: 100%;
		background: ${theme.background.default};
		border-radius: ${DEFAULT_BORDER_RADIUS};
		overflow: auto;
		flex-grow: 1;
	`;
});

const Title = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		font-size: ${fontSize[16]};
		line-height: ${fontSize[22]};
		color: ${theme.font.secondary};
		padding: ${spacing[12]};
	`;
});

const TextFieldWrapper = styled.div`
	margin: 0 ${spacing[12]} ${spacing[8]};
`;

const List = styled.ul`
	overflow-y: auto;
	margin: 0;
	padding: 0;

	&::-webkit-scrollbar,
	&::-webkit-scrollbar-track,
	&::-webkit-scrollbar-thumb {
		display: none;
	}
`;

const Item = styled.li((props: any) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		align-items: center;
		cursor: pointer;
		font-size: ${fontSize[16]};
		color: ${theme.font.secondary};
		line-height: ${fontSize[22]};
		padding: ${spacing[12]};
		background-color: ${props.activeBorder ? theme.list.active : theme.button.transparent};

		&:hover {
			background-color: ${theme.list.hover};
		}
	`;
});

const Name = styled.p`
	margin: 0;
	padding-left: ${spacing[10]};
`;

type Value = 'SOURCE_NETWORK' | 'SOURCE_TOKEN' | 'NETWORK' | 'TOKEN';

type Props = {
	data: any;
	placeholder: string;
	value: Value | 'WALLET';
};

export const SelectList = ({ data, placeholder, value }: Props) => {
	const { chainId } = useEthers();
	// @ts-ignore
	const { addToast } = useToasts();

	const [search, setSearch] = useState('');
	const dataList =
		data &&
		data.filter((coin: unknown) => (coin as string).toLowerCase().includes(search.toLowerCase()));
	const {
		dispatch,
		state: { destinationToken, destinationNetwork, sourceNetwork, sourceToken, isUserVerified }
	} = useStore();

	const handleClick = useCallback(
		async (name: string) => {
			if (value === 'WALLET') {
				dispatch({
					type: DestinationEnum.WALLET,
					payload: name
				});
			} else if (value === 'NETWORK') {
				dispatch({ type: DestinationEnum.TOKEN, payload: DefaultSelectEnum.TOKEN });
				dispatch({
					type: DestinationEnum.NETWORK,
					payload: name
				});
			} else if (value === 'TOKEN') {
				dispatch({
					type: DestinationEnum.TOKEN,
					payload: name
				});
			} else if (value === 'SOURCE_NETWORK' && name !== sourceNetwork) {
				if(isUserVerified) {
					try {
						// @ts-ignore
						await ethereum.request({
							method: 'wallet_switchEthereumChain',
							params: [
								{
									chainId: ethers.utils.hexValue(chainId === 1 ? Moonbeam.chainId : Mainnet.chainId)
								}
							]
						});
					} catch (error: any) {
						if (error.code === 4902 || (error.code === -32603 && name === 'GLMR')) {
							try {
								// @ts-ignore
								await ethereum.request({
									method: 'wallet_addEthereumChain',
									params: NETWORK_PARAMS['1284']
								});
								dispatch({
									type: SourceEnum.NETWORK,
									payload: name
								});
								dispatch({
									type: SourceEnum.TOKEN,
									payload: name
								});
							} catch (e) {
								dispatch({
									type: SourceEnum.NETWORK,
									payload: name === 'GLMR' ? 'ETH' : 'GLMR'
								});
								dispatch({ type: SourceEnum.TOKEN, payload: name === 'GLMR' ? 'ETH' : 'GLMR' });
							}
						} else if (error.code === 4001) {
							return;
						} else {
							addToast('Something went wrong - please try again');
						}
					}
				} else {
					dispatch({
						type: SourceEnum.NETWORK,
						payload: name
					});
					dispatch({
						type: SourceEnum.TOKEN,
						payload: name
					});
				}
				dispatch({ type: DestinationEnum.NETWORK, payload: DefaultSelectEnum.NETWORK });
				dispatch({ type: DestinationEnum.TOKEN, payload: DefaultSelectEnum.TOKEN });
				dispatch({ type: AmountEnum.AMOUNT, payload: '' });
				dispatch({ type: DestinationEnum.AMOUNT, payload: '' });
			} else if (value === 'SOURCE_TOKEN') {
				dispatch({
					type: SourceEnum.TOKEN,
					payload: name
				});
				dispatch({ type: DestinationEnum.NETWORK, payload: DefaultSelectEnum.NETWORK });
				dispatch({ type: DestinationEnum.TOKEN, payload: DefaultSelectEnum.TOKEN });
				dispatch({ type: AmountEnum.AMOUNT, payload: '' });
				dispatch({ type: DestinationEnum.AMOUNT, payload: '' });
			}
		},
		[destinationToken, destinationNetwork, sourceNetwork, sourceToken, value] // TODO: add destinationWallet later
	);

	const listTitle: { [key in Value]: string } = {
		NETWORK: 'Network',
		TOKEN: 'Token',
		SOURCE_NETWORK: 'Network',
		SOURCE_TOKEN: 'Token'
	};

	const valueToWatch = useMemo(() => {
		return {
			NETWORK: destinationNetwork,
			TOKEN: destinationToken,
			SOURCE_NETWORK: sourceNetwork,
			SOURCE_TOKEN: sourceToken
		};
	}, [destinationToken, destinationNetwork, sourceNetwork, sourceToken]); // TODO: add destinationWallet later

	return (
		<Wrapper data-testid="select-list">
			<Title>Select {listTitle[value as Value]}</Title>
			<TextFieldWrapper>
				<TextField
					type="search"
					size="small"
					value={search}
					placeholder={placeholder}
					onChange={(event) => setSearch(event.target.value)}
				/>
			</TextFieldWrapper>
			{data.length > 0 ? (
				<List>
					{dataList.map((el: string) => (
						<Item
							value={value}
							// @ts-ignore
							activeBorder={valueToWatch[value as Value] === el}
							onClick={() => handleClick(el)}
							key={el}>
							<Icon icon={el.toLowerCase() as IconType} size="small" />
							<Name>{el}</Name>
						</Item>
					))}
				</List>
			) : (
				<Title>Select network first</Title>
			)}
		</Wrapper>
	);
};
