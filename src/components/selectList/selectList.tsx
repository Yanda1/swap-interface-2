import { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { DestinationNetworkEnum, useStore } from '../../helpers';
import { fontSize, pxToRem, spacing, defaultBorderRadius, horizontalPadding } from '../../styles';
import { IconButton } from '../iconButton/iconButton';
import { TextField } from '../textField/textField';

const Wrapper = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		flex-direction: column;
		flex: 0 1 ${pxToRem(450 / 2 - 36)}; // TODO: refactor so that the 450 / first value comes from mainMaxWidth
		border: 1px solid ${theme.font.default};
		height: ${pxToRem(478)};
		padding: 0 ${spacing[horizontalPadding]};
		background: ${theme.background.default};
		border-radius: ${defaultBorderRadius};
	`;
});

type Props = {
	data: any;
	placeholder: string;
	handleSelect?: (network: string, token: string) => void;
	value: 'NETWORK' | 'TOKEN' | 'WALLET';
};

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
	height: ${pxToRem(478)}; // TODO: refactor to one const

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
		border-radius: ${defaultBorderRadius};
		padding: ${spacing[12]} ${spacing[horizontalPadding]};
		border: 1px solid ${props.activeBorder ? theme.button.default : theme.button.transparent};
	`;
});

export const SelectList = ({ data, placeholder, value }: Props) => {
	const [search, setSearch] = useState('');
	const dataList =
		data &&
		data.filter((coin: unknown) => (coin as string).toLowerCase().includes(search.toLowerCase()));
	const {
		dispatch,
		state: { destinationToken, destinationNetwork, destinationWallet }
	} = useStore();

	const handleClick = useCallback(
		(e: any) => {
			if (value === 'WALLET') {
				dispatch({
					type: DestinationNetworkEnum.WALLET,
					payload: e.target.textContent ? e.target.textContent : e.target.alt
				});
			}
			dispatch({
				type: DestinationNetworkEnum[value],
				payload: e.target.textContent ? e.target.textContent : e.target.alt
			});
			if (value === 'NETWORK') {
				dispatch({ type: DestinationNetworkEnum.TOKEN, payload: 'Select Token' });
			}
		},
		[destinationToken, destinationNetwork, destinationWallet]
	);

	return (
		<Wrapper data-testid="custom">
			<Title>SELECT {value}</Title>
			<TextField
				align="left"
				value={search}
				placeholder={placeholder}
				onChange={(event) => setSearch(event.target.value)}
			/>
			{data.length > 0 ? (
				<List>
					{dataList.map((el: string) => {
						const hasActiveBorder =
							value === 'NETWORK'
								? destinationNetwork === el
								: value === 'TOKEN'
								? destinationToken === el
								: destinationWallet === el;

						return (
							<Item
								value={value}
								// @ts-ignore
								activeBorder={hasActiveBorder}
								onClick={(e) => handleClick(e)}
								key={el}>
								<IconButton
									// @ts-ignore
									icon={el}
									iconOnly
								/>
								{el}
							</Item>
						);
					})}
				</List>
			) : (
				<Title>Please choose network.</Title>
			)}
		</Wrapper>
	);
};
