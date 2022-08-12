import { useState } from 'react';
import styled, { css } from 'styled-components';
import { useStore, DestinationNetworkEnum } from '../../helpers';
import { fontSize, pxToRem, spacing } from '../../styles';
import { IconButton } from '../iconButton/iconButton';

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
			border: 1px solid ${theme.default};
			height: 478px;
			padding-bottom: 0;
			background: ${theme.background.default};
			border-radius: ${pxToRem(6)};
			max-width: ${pxToRem(200)};
		`;
	}
);

const Title = styled.div(
	() => {
		const { state: {theme} } = useStore(); // TODO: refactor theme export

		return css`
			font-size: ${fontSize[16]};
			line-height: ${fontSize[22]};
			color: ${theme.font.pure};
			margin: ${spacing[20]} ${spacing[22]};
	`;
}
);

const Input = styled.input(
() => {
	const { state: {theme} } = useStore();

	return css`
		border: 1px solid ${theme.font.default};
		border-radius: 5px;
		color: ${theme.font.pure};
		padding: ${spacing[10]} ${spacing[12]};
		margin: 0 ${spacing[22]} ${spacing[12]};
		line-height: ${fontSize[20]};
		background: transparent;
	`;
}
);

const List = styled.ul`
	overflow-y: auto;
	padding: 0;
	margin: 0 ${spacing[12]};
	&::-webkit-scrollbar {
		display: none;
	}
	/* Track */
	&::-webkit-scrollbar-track {
		display: none;
	}
	/* Handle */
	&::-webkit-scrollbar-thumb {
		display: none;
	}
`;

const Item = styled.li(
	() => {
		const { state: { theme } } = useStore();

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
			&:first-child {
				margin-right: ${spacing[10]};
			}
		`;
	}
);

export const SelectList = ({ data, title, placeholder, value }: Props) => {
	const [search, setSearch] = useState('');
	const [activeIndex, setActiveIndex] = useState(0);
	const dataList = data && data.filter((coin: unknown) => (coin as string).toLowerCase().includes(search.toLowerCase()));
	const { dispatch } = useStore();
	const handleClick = (index: number, e: any): void => {
		setActiveIndex(index);
		dispatch({ type: DestinationNetworkEnum[value], payload: e.target.textContent });
	};

	return (
		<>
			<Wrapper>
				<Title>{title}</Title>
				<Input placeholder={placeholder} onChange={event => setSearch(event.target.value)} />
				<List>
				{data.length > 0 && dataList.map((el: HTMLLIElement, index: number) => {
						// @ts-ignore
						// eslint-disable-next-line
					return (<Item
								style={{border: index === activeIndex ? '1px solid #00bcd4' : '1px solid transparent'}}
								onClick={(e) => handleClick(index, e)}
								key={el}><IconButton icon={el} />{el}</Item>
					);})
				}
				</List>
			</Wrapper>
		</>
	);
};
