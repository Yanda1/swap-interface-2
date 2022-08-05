import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '..';
import { pxToRem, mediaQuery, spacing } from '../../styles';

type Props = {
	data: any;
	title: string;
	placeholder: string;
	updateToken?: (data: any) => void;
	updateNetwork?: (data: any) => void;
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
	max-width: ${pxToRem(206)};
	border: 2px solid grey;
	height: 478px;
	padding: 0;
	padding-top: ${spacing[16]};
	background: #161B20;
	border-radius: 5px;
	&:first-child {
		margin: 0px 23px 0px 0px;
		${mediaQuery('s', 'xxs')} {
			margin: 0 auto;
		}
	}
	&:last-child {
		${mediaQuery('s', 'xxs')} {
			display: none;
		}
	}
	${mediaQuery('s', 'xxs')} {
		max-width: ${pxToRem(270)};
		margin: 0 auto;
	}
`;

const Title = styled.div`
	text-align: center;
	margin-bottom: ${pxToRem(12)};
`;

export const SelectList = ({ data, title, placeholder, updateNetwork, updateToken }: Props) => {
	const [search, setSearch] = useState('');
	return (
		<>
			<StyledList>
				<Title>{title}</Title>
				<StyledInput placeholder={placeholder} onChange={event => setSearch(event.target.value)}/>
				<div style={{	overflowY:'auto', height: '100%'}}>
				{data.length > 0 && data.filter((coin: any) => coin.toLowerCase().includes(search.toLowerCase())).map((val: any) => {
					return <Button key={val} onClick={(e) => updateNetwork ? updateNetwork(e.target.textContent) : updateToken ? updateToken(e.target.textContent) : null} variant='secondary' color='selected' >{val}</Button>
				})}
				</div>
			</StyledList>
		</>
	);
};
