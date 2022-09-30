import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useStore } from '../../helpers';

const Accordion = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		box-shadow: 0px 13px 23px -13px rgba(0, 0, 0, 0.5);
		width: 420px;
		background-color: ${theme.background.history};
		margin: auto;
		margin-top: 50px;
	`;
});

const Title = styled.div`
	height: 30px;
	width: 400px;
	background-color: rgba(255, 255, 255, 0.4);
	color: #ffddcc;
	text-transform: uppercase;
	letter-spacing: 1px;
	text-align: left;
	line-height: 2;
	font-weight: lighter;
	position: relative;
	padding: 10px;
	z-index: 2000;
	border-radius: 4px;
	margin-top: 2px;
	transition: all 0.2s ease-in;

	&:hover {
		cursor: pointer;
		background-color: rgba(0, 0, 0, 0.5);
	}

	&:active {
		background-color: rgba(0, 0, 0, 0.55);
	}
`;

const TitleText = styled.div`
	margin-left: 10px;
`;

const ArrowWrapper = styled.div`
	position: absolute;
	margin-left: 375px;
`;

const Angle = styled.i(
	({ open }: { open: boolean }) => css`
		font-size: 20px;
		color: ${open ? 'rgba(255, 255, 255, 1)' : ' color: rgba(255,255,255, 0.5)'};
		transition: all 0.4s cubic-bezier(0.08, 1.09, 0.32, 1.275);
	`
);

const Content = styled.div(({ open }: { open: boolean }) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		height: ${open ? '200px' : '30px'};
		width: 420px;
		background-color: ${open ? 'rgba(0,0,0, .1)' : 'transparent'};
		border-radius: 4px;
		color: ${theme.font.pure};
		font-size: 14px;
		text-align: center;
		position: relative;
		z-index: 1000;
		margin-top: ${open ? '0px' : '-30px'};
		text-align: left;
		transition: ${open
			? 'all 550ms cubic-bezier(0.080, 1.090, 0.320, 1.275)'
			: 'all 200ms cubic-bezier(0.6, -0.28, 0.735, 0.045)'};
	`;
});

const ContentText = styled.i(
	({ open }: { open: boolean }) => css`
		padding: 15px;
		visibility: ${open ? 'visible' : 'hidden'};
		opacity: ${open ? '1' : '0'};
		overflow: auto;
		transition: ${open ? 'all 0.4s ease-in' : 'all 0.2s ease-in'};
	`
);

type DataProps = {
	title: string;
	content: string;
	open: boolean;
};

type Props = { data: Omit<DataProps, 'open'>[] };

export const TransactionHistory = ({ data }: Props) => {
	const [accordionItems, setAccordionItems] = useState<DataProps[]>([]);
	const [accordionIndex, setAccordionIndex] = useState(-1);

	useEffect(() => {
		const accordion: any[] = [];
		data.forEach((dataset) => {
			accordion.push({ ...dataset, open: false });
		});
		setAccordionItems(accordion);
	}, []);

	useEffect(() => {
		if (accordionItems.length > 0) {
			const updateAccordion = accordionItems.map((data: DataProps, i: number) => {
				if (i === accordionIndex) {
					data.open = !data.open;
				}

				return data;
			});
			setAccordionItems(updateAccordion);
		}
	}, [accordionIndex]);

	const handleClick = (i: number) => setAccordionIndex(i);

	return (
		<Accordion>
			{accordionItems?.map((item: DataProps, index: number) => (
				<div key={index}>
					<Title onClick={() => handleClick(index)}>
						<ArrowWrapper>
							<Angle open={item.open}></Angle>
						</ArrowWrapper>
						<TitleText>{item.title}</TitleText>
					</Title>
					<Content open={item.open}>
						<ContentText open={item.open}>{item.content}</ContentText>
					</Content>
				</div>
			))}
		</Accordion>
	);
};
