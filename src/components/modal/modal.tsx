import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '..';
import {mediaQuery, pxToRem } from '../../styles';
import {SelectList} from '../selectlist/selectlist';
const destinationNetworks = require('../../../src/destinationNetworks.json');

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
	padding: 0 ${pxToRem(53)} ${pxToRem(61)};
	text-align: center;
	border-radius:  ${pxToRem(5)};
	${mediaQuery('xs', 's')} {
		padding: ${pxToRem(49)} ${pxToRem(38)} ${pxToRem(53)};
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
		margin-right: ${pxToRem(9)};
		font-size: ${pxToRem(16)};
	}
`;

const ModalContainer = styled.div`
	display: flex;
	text-align: center;
	max-width: ${pxToRem(435)};
	margin: 0 auto;
	margin-bottom: ${pxToRem(29)};
`;

const CloseButtonContainer = styled.div`
	text-align: right;
	max-width: ${pxToRem(605)};
	background-color: #212426;
`;


export const Modal = ({showModal, setShowModal}: Props) => {
	const networks = Object.keys(destinationNetworks);
	const [network, setNetwork] = useState<string>('');
	const [token, setToken] = useState<string>('');

	const updateNetwork = (value: string) => {
		setNetwork(value);
	};

	const updateToken = (value: string) => {
		setToken(value);
	};
	const coins = network && destinationNetworks[`${network}`].tokens;

	return (
		<>
			{showModal ? (
					<ModalWrapper>
							<CloseButtonContainer>
						<CloseButton onClick={() => setShowModal(false)}>&#x2716;</CloseButton>
							</CloseButtonContainer>
						<Background>
							<ModalContainer>
								<SelectList data={networks} title='Select Network' placeholder='Token Name' updateNetwork={updateNetwork} />
								<SelectList data={coins} title='Select Token' placeholder='Token Name' updateToken={updateToken} />
							</ModalContainer>
							<Button onClick={() => setShowModal(false)}>Select</Button>
						</Background>
					</ModalWrapper>
			) : null}
		</>
	);
};
