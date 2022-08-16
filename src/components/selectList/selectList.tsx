import { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { DestinationNetworkEnum, useStore } from '../../helpers';
import { fontSize, pxToRem, spacing } from '../../styles';
import { IconButton } from '../iconButton/iconButton';
import { TextField } from '../textField/textField';

type Props = {
	data: any;
	title: string;
	placeholder: string;
	handleSelect?: (network: string, token: string) => void;
	value: 'NETWORK' | 'TOKEN';
};

const Wrapper = styled.div(
	() => {
		const { state: { theme } } = useStore();

		return css`

			display: flex;
			flex-direction: column;
			flex: 0 1 ${pxToRem(172)};
			border: 1px solid ${theme.default};
			height: ${pxToRem(478)};
			padding: 0 ${spacing[10]};
			background: ${theme.background.default};
			border-radius: ${pxToRem(6)};

		`;
	}
);

const Title = styled.div(
	() => {
		const { state: { theme } } = useStore(); // TODO: refactor theme export

		return css`
			font-size: ${fontSize[16]};
			line-height: ${fontSize[22]};
			color: ${theme.font.pure};
			margin: ${spacing[20]} ${spacing[12]} ${spacing[12]};
		`;
	}
);

const List = styled.ul`
	overflow-y: auto;
	padding: 0;

	&::-webkit-scrollbar
	&::-webkit-scrollbar-track
	&::-webkit-scrollbar-thumb {
		display: none;
	}
`;

const Item = styled.li(
	(props: any) => {
		const { state: { theme } } = useStore();
		const activeBorder = props.index === props.activeIndex;

		return css`
			display: flex;
			align-items: center;
			cursor: pointer;
			font-size: ${fontSize[16]};
			color: ${theme.font.pure};
			line-height: ${fontSize[22]};
			margin: ${spacing[10]} 0;
			border-radius: ${pxToRem(6)};
			padding: ${spacing[12]} ${spacing[10]};
			border: 1px solid ${activeBorder ? '#00bcd4' : 'transparent'};
		`;
	}
);

export const SelectList = ({ data, title, placeholder, value }: Props) => {

	const [search, setSearch] = useState('');
	const [activeIndex, setActiveIndex] = useState(-1);
	const dataList = data && data.filter((coin: unknown) => (coin as string).toLowerCase().includes(search.toLowerCase()));
	const { dispatch, state: { token, network } } = useStore();

	const handleClick = useCallback((index: number, e: any) => {
		if (value === 'TOKEN' && index !== activeIndex) {
			console.log('TOKEN index !== active', activeIndex, value);
			setActiveIndex(index);
			dispatch({ type: DestinationNetworkEnum[value], payload: e.target.textContent });
		}

		if (value === 'NETWORK' && index !== activeIndex) {
			console.log('TOKEN index !== active', activeIndex, value);
			setActiveIndex(index);
			dispatch({ type: DestinationNetworkEnum[value], payload: e.target.textContent });
			dispatch({ type: DestinationNetworkEnum.TOKEN, payload: 'Select Token' });
		}

		if (token === 'Select Token' && value === 'TOKEN') {
			console.log('FIRST TOKEN IN NEW NETWORK', value);
			setActiveIndex(-1);
		}
	}, [activeIndex, token, network]);

	return (
		<>
			<Wrapper>
				<Title>{title}</Title>
				<TextField value={search} placeholder={placeholder} onChange={event => setSearch(event.target.value)} />
				<List>
					{data.length > 0 && dataList.map((el: HTMLLIElement, index: number) => {
						// @ts-ignore
						// eslint-disable-next-line
						return (<Item
								value={value}
								index={index}
								activeIndex={activeIndex}
								onClick={(e) => handleClick(index, e)}
								key={el}><IconButton icon={el} iconOnly />{el}</Item>
						);
					})
					}
				</List>
			</Wrapper>
		</>
	);
};
