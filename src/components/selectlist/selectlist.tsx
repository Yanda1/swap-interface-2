import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '..';

import { pxToRem, mediaQuery, spacing } from '../../styles';

type Props = {
	data: any;
	title: string;
	placeholder: string;
	updateData: (data: any) => void;
};

const StyledInput = styled.input`
	width: calc(100% - ${pxToRem(32)});
	height: 44px;
	background: #161B20;
	border: 1px solid #505050;
	border-radius: 5px;
	color: #FFFFFF;
	padding-left: 10px;
	margin: 0 17px 13px 18px;
`;

const StyledList = styled.ul`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 206px;
	border: 2px solid grey;
	height: 478px;
	//overflow-y: scroll;
	&:first-child {
		margin-right: 23px;
	}

	padding: 0;
	padding-top: ${spacing[16]};
	background: #161B20;
	border-radius: 5px;

	&:last-child {
		${mediaQuery('xxs')} {
			display: none;
		}
	}

	${mediaQuery('xxs')} {
		max-width: ${pxToRem(270)};
		margin: 0 auto;
	}
`;

const Title = styled.div`
	text-align: center;
	margin-bottom: ${pxToRem(12)};
`;

export const SelectList = ({ data, title, placeholder, updateData }: Props) => {
	const [search, setSearch] = useState('');

	return (
		<>
			<StyledList>
				<Title>{title}</Title>
				<StyledInput placeholder={placeholder} onChange={event => setSearch(event.target.value)}/>
				<div style={{	overflowY:'auto', height: '100%'}}>
				{data.length > 0 && data.filter((coin: any) => coin.toLowerCase().includes(search.toLowerCase())).map((val: any) => {
					return <Button key={val} onClick={(e) => updateData(e.target.textContent)} variant='secondary' color='selected' >{val}</Button>
				})}
				</div>
			</StyledList>
		</>
	);
};
