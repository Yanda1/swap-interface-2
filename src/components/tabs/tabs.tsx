import styled, { css } from 'styled-components';
import { BLOCKS_AMOUNT, useStore } from '../../helpers';
import { useState } from 'react';
import { DEFAULT_BORDER_RADIUS, pxToRem, spacing } from '../../styles';
import { useBlockNumber } from '@usedapp/core';
import { format } from 'date-fns';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 100%;
`;

const TabsContainer = styled.div`
	display: flex;
	overflow-x: auto;
`;

const Tab = styled.div(({ active }: Props) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		z-index: 10;
		cursor: pointer;
		color: ${theme.font.pure};
		padding: ${spacing[6]} ${spacing[6]};
		text-align: center;
		margin-right: ${spacing[4]};
		background: ${theme.background.mobile};
		border-radius: ${DEFAULT_BORDER_RADIUS} ${DEFAULT_BORDER_RADIUS} 0 0;
		border: 1px solid ${theme.button.wallet};
		border-bottom: none;

		&:nth-child(${++active}) {
			border-bottom: 1px solid ${theme.button.default};
		}

		&:last-child {
			margin-right: 0;
		}
	`;
});

const Content = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		color: ${theme.font.pure};
		padding: ${spacing[20]};
		display: block;
		background: ${theme.background.mobile};
		border: 1px solid ${theme.button.wallet};
	`;
});

const ContentList = styled.ul`
	list-style: none;
	padding: 0;
`;

const ContentItem = styled.li(({ color }: Props) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		list-style: none;
		padding: 0 0 ${spacing[26]} ${spacing[20]};
		border-left: 1px solid ${theme.font.default};
		position: relative;
		margin-left: ${spacing[10]};

		&:last-child {
			border: 0;
			padding-bottom: 0;
			vertical-align: baseline;
		}

		&:last-child > p {
			margin: 0;
		}

		&:before {
			content: '';
			width: ${pxToRem(16)};
			height: ${pxToRem(16)};
			background: ${theme.font.default};
			border-radius: 50%;
			position: absolute;
			left: ${pxToRem(-8)};
			top: 0;
		}

		&:last-child:before {
			left: ${pxToRem(-8)};
			background-color: ${color};
		}
	`;
});

const ContentItemTitle = styled.h3`
	margin: 0;
`;

const ContentItemText = styled.p((props) => {
	return css`
		color: ${props.color};
	`;
});

const ContentItemLink = styled.a`
	text-decoration: underline;
	cursor: pointer;
`;

type Props = {
	data?: any;
	color?: string;
	active?: any;
};

export const Tabs = ({ data }: Props) => {
	const currentBlockNumber = useBlockNumber();
	const {
		state: { destinationToken, theme }
	} = useStore();
	const [toggle, setToggle] = useState(0);
	const handleToggle = (index: number) => setToggle(index);
	const orders = data && data[toggle].action[1];
	const withdrawal = data && data[toggle].action[0];

	return (
		<Wrapper data-testid="tabs-container">
			{data?.length > 0 && (
				<>
					<TabsContainer>
						{data?.length &&
							data.map((item: any) => {
								const index = data.indexOf(item);

								return (
									<Tab key={Math.random()} onClick={() => handleToggle(index)} active={toggle}>
										GLMR {destinationToken}
									</Tab>
								);
							})}
					</TabsContainer>
					<Content>
						<ContentList>
							{data[toggle].costRequestCounter ? (
								<ContentItem key={Math.random()}>
									<ContentItemTitle>
										Swap Request Validation ({data[toggle].costRequestCounter}/2)
									</ContentItemTitle>
									<ContentItemText>
										{data[toggle].costRequestCounter === 1
											? 'Your Swap request is under validation. Please wait until full confirmation.'
											: 'Your Swap request successfully validated.'}
									</ContentItemText>
								</ContentItem>
							) : null}
							{currentBlockNumber && data[toggle].depositBlock ? (
								<ContentItem key={Math.random()}>
									<ContentItemTitle>
										{!data[toggle].action.length
											? `Deposit confirmation (${
													currentBlockNumber - data[toggle].depositBlock
											  }/${BLOCKS_AMOUNT})`
											: 'Deposit confirmed'}
									</ContentItemTitle>
									<ContentItemText>
										{data[toggle].depositBlock < BLOCKS_AMOUNT
											? 'Your deposit is waiting for the particular numbers of the blocks to pass. Please wait for 30 blocks to pass.'
											: !data[toggle].action
											? 'Your deposit is received and should be confirmed soon.'
											: null}
									</ContentItemText>
								</ContentItem>
							) : null}
							{orders ? (
								<>
									<ContentItem key={Math.random()}>
										<ContentItemTitle>Conversion GLMR {orders.s.slice(4)}</ContentItemTitle>
										<ContentItemText>Type: {orders.a === 1 ? 'SELL' : 'BUY'}</ContentItemText>
										<ContentItemText>Pair: {orders.s}</ContentItemText>
										<ContentItemText>Quantity: {orders.q}</ContentItemText>
										<ContentItemText>Price: {orders.p}</ContentItemText>
										<ContentItemText>
											Time: {format(new Date(orders.ts * 1000), 'dd/MM/yyyy kk:mm:ss')}
										</ContentItemText>
									</ContentItem>
									<ContentItem key={Math.random()}>
										{withdrawal.t === 0 ? (
											<ContentItemLink>Withdrawal confirmed</ContentItemLink>
										) : (
											<ContentItemText>Withdrawal confirmed</ContentItemText>
										)}
										<ContentItemText>You can check transaction by link</ContentItemText>
									</ContentItem>
								</>
							) : null}
							{data[toggle].complete === true ? (
								<ContentItem key={Math.random()} color={theme.button.default}>
									<ContentItemText color={theme.button.default}>Successful swap!</ContentItemText>
								</ContentItem>
							) : null}
							{data[toggle].complete === null ? (
								<ContentItem key={Math.random()} color={theme.font.pure}>
									<ContentItemText color={theme.font.pure}>
										Not valid operations spotted!
									</ContentItemText>
								</ContentItem>
							) : null}
						</ContentList>
					</Content>
				</>
			)}
		</Wrapper>
	);
};