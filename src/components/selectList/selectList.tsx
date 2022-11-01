import { useCallback, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { DestinationEnum, SourceEnum, useStore } from '../../helpers';
import {
	fontSize,
	pxToRem,
	spacing,
	DEFAULT_BORDER_RADIUS,
	HORIZONTAL_PADDING,
	SELECT_LIST_HEIGHT,
	MAIN_MAX_WIDTH
} from '../../styles';
import { IconButton } from '../iconButton/iconButton';
import { TextField } from '../textField/textField';

const Wrapper = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		flex-direction: column;
		flex: 0 1 ${MAIN_MAX_WIDTH} / 2 - ${pxToRem(36)};
		border: 1px solid ${theme.font.default};
		height: ${SELECT_LIST_HEIGHT};
		padding: 0 ${spacing[HORIZONTAL_PADDING]};
		background: ${theme.background.default};
		border-radius: ${DEFAULT_BORDER_RADIUS};
	`;
});

const Title = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		font-size: ${fontSize[16]};
		line-height: ${fontSize[22]};
		color: ${theme.font.pure};
		margin: ${spacing[20]} ${spacing[12]} ${spacing[12]};
	`;
});

const List = styled.ul`
	overflow-y: auto;
	padding: 0;
	height: ${SELECT_LIST_HEIGHT};

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
		color: ${theme.font.pure};
		line-height: ${fontSize[22]};
		margin: ${spacing[10]} 0;
		border-radius: ${DEFAULT_BORDER_RADIUS};
		padding: ${spacing[12]} ${spacing[HORIZONTAL_PADDING]};
		border: 1px solid ${props.activeBorder ? theme.button.default : theme.button.transparent};
	`;
});

type Value = 'SOURCE_NETWORK' | 'SOURCE_TOKEN' | 'NETWORK' | 'TOKEN';

type Props = {
	data: any;
	placeholder: string;
	value: Value | 'WALLET';
};

export const SelectList = ({ data, placeholder, value }: Props) => {
	const [search, setSearch] = useState('');
	const dataList =
		data &&
		data.filter((coin: unknown) => (coin as string).toLowerCase().includes(search.toLowerCase()));
	const {
		dispatch,
		state: { destinationToken, destinationNetwork, sourceNetwork, sourceToken }
	} = useStore();

	const handleClick = useCallback(
		(e: any) => {
			if (value === 'WALLET') {
				dispatch({
					type: DestinationEnum.WALLET,
					payload: e.target.textContent ? e.target.textContent : e.target.alt
				});
			} else if (value === 'NETWORK') {
				dispatch({ type: DestinationEnum.TOKEN, payload: 'Select Token' });
			} else if (value === 'SOURCE_NETWORK') {
				dispatch({ type: SourceEnum.TOKEN, payload: 'Select Token' });
			}
			dispatch({
				type: value.includes('SOURCE')
					? // @ts-ignore
					  SourceEnum[value.slice(7, value.length)]
					: // @ts-ignore
					  DestinationEnum[value],
				payload: e.target.textContent ? e.target.textContent : e.target.alt
			});
		},
		[destinationToken, destinationNetwork, sourceNetwork, sourceToken] // TODO: add destinationWallet later
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
		<Wrapper data-testid="custom">
			<Title>Select {listTitle[value as Value]}</Title>
			<TextField
				align="left"
				value={search}
				placeholder={placeholder}
				onChange={(event) => setSearch(event.target.value)}
			/>
			{data.length > 0 ? (
				<List>
					{dataList.map((el: string) => (
						<Item
							value={value}
							// @ts-ignore
							activeBorder={valueToWatch[value as Value] === el}
							onClick={(e) => handleClick(e)}
							key={el}>
							<IconButton
								// @ts-ignore
								icon={el}
								iconOnly
							/>
							{el}
						</Item>
					))}
				</List>
			) : (
				<Title>Select network first</Title>
			)}
		</Wrapper>
	);
};
