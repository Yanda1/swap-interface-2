import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '..';
import {mediaQuery, pxToRem } from '../../styles';
import {SelectList} from '../selectlist/selectlist';
const availableCoins = require('../../../src/availableCoins.json');
type Props = {
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
};

const ModalWrapper = styled.div`
	position: fixed;
	top: 50%;
	left: 50%;
	right: 50%;
	transform: translate(-50%, -50%);
	max-width: ${pxToRem(605)} ;
	width: calc(100% - ${pxToRem(28)});
	margin: 0 auto;
	border: 1px solid #505050;
	border-radius: ${pxToRem(5)};
	${mediaQuery('xxs')} {
		max-width: ${pxToRem(347)};
		width: calc(100% - ${pxToRem(10)});
		border-radius: ${pxToRem(28)};
		border: none;
		margin: 0 auto;
		margin-top: 50px;
	}
`;

const Background = styled.div`
	width: 100%;
	height: 100%;
	background-color: #212426;
	opacity: 0.95;
	padding-bottom: ${pxToRem(61)};
	text-align: center;
	border-radius:  ${pxToRem(5)};
	${mediaQuery('xxs')} {
		padding-bottom: ${pxToRem(53)};
		border-radius: ${pxToRem(28)};
	}
`;

const CloseButton = styled.button`
	cursor: pointer;
	background-color: transparent;
	margin: ${pxToRem(5)} ${pxToRem(12)} ${pxToRem(27)};
	border: none;
	padding: 0;
	font-size: ${pxToRem(20)};
	color: #FFFFFF;
	${mediaQuery('xxs')} {
		margin: 0;
		padding: 0px;
	}
`;

const ModalContainer = styled.div`
	display: flex;
	text-align: center;
	max-width: ${pxToRem(435)};
	margin: 0 auto;
	margin-bottom: ${pxToRem(29)};
	${mediaQuery('xxs')} {
	padding: 0 ${pxToRem(38)};
	}
`;

export const Modal = ({showModal, setShowModal}: Props) => {
	const coins = Object.keys(availableCoins);
	const [coin, setCoin] = useState('');
	const [result, setResult] = useState(['']);
	const updateData = (value: string) => {
		console.log('%c !!! HERE !!!!', 'color: red; font-size: 10px;', value);
		setCoin(value);
	};

	const networks = coin && availableCoins[`${coin}`].map((coin: any) => coin.name)

	return (
		<>
			{showModal ? (
					<ModalWrapper>
						<Background>
						<CloseButton onClick={() => setShowModal(false)}>&#x2716;</CloseButton>
							<ModalContainer>
								<SelectList data={coins} title='Select Token' placeholder='Token Name' updateData={updateData} />
								<SelectList data={networks} title='Select Network' placeholder='Network Name' updateData={updateData} />
							</ModalContainer>
							<Button onClick={() => setShowModal(false)}>Select</Button>
						</Background>
					</ModalWrapper>
			) : null}
		</>
	);
};
