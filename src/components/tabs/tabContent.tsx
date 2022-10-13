import { BLOCKS_AMOUNT, useStore } from '../../helpers';
import { format } from 'date-fns';
import styled from 'styled-components';
import { pxToRem, spacing, fontSize, fontWeight, theme, mediaQuery } from '../../styles';
import type { Theme } from '../../styles';
import { useBlockNumber } from '@usedapp/core';

type Props = {
	data?: any;
	color?: string;
	toggle?: number;
	type?: 'history' | 'swap';
};

type StyleProps = Props & { theme: Theme };

const Content = styled.div`
	color: ${(props: StyleProps) => props.theme.font.pure};
	padding: ${spacing[20]};

	display: block;
	background: ${(props: StyleProps) => props.theme.background.mobile};
	border: 1px solid
		${(props: StyleProps) => (props.type === 'history' ? 'transparent' : props.theme.button.wallet)};
`;

export const ContentList = styled.ul`
	list-style: none;
	padding: 0;
`;

export const ContentItem = styled.li`
	list-style: none;
	padding: 0;
	padding: 0 0 ${spacing[26]} ${spacing[20]};
	border-left: 1px solid ${(props: StyleProps) => props.theme.font.default};
	position: relative;
	margin-left: ${spacing[10]};
	font-size: ${fontSize[16]};

	&:last-child {
		border: 0;
		padding-bottom: 0;
	}

	&:before {
		content: '';
		width: ${pxToRem(16)};
		height: ${pxToRem(16)};
		background: ${(props: StyleProps) => props.theme.font.default};
		border-radius: 50%;
		position: absolute;
		left: ${pxToRem(-8)};
		top: 0;

		${mediaQuery('s')} {
			width: ${pxToRem(14)};
			height: ${pxToRem(14)};
			left: ${pxToRem(-7)};
		}
	}

	&:last-child:before {
		background-color: ${(props: StyleProps) => props.color};
	}

	&:last-of-type > div {
		line-height: ${fontSize[16]};
	}
`;

export const ContentItemTitle = styled.div`
	line-height: ${fontSize[16]};
	font-weight: ${fontWeight.bold};
	margin-bottom: ${spacing[4]};
`;

export const ContentItemText = styled.div`
	color: ${(props: StyleProps) => props.color};
	line-height: ${fontSize[22]};
`;

export const ContentItemLink = styled.div`
	color: ${(props: StyleProps) => props.theme.font.default};
	line-height: ${fontSize[16]};
	text-decoration: underline;
	cursor: pointer;
`;

export const TabContent = ({ data, toggle = 0, type = 'swap' }: Props) => {
	const currentBlockNumber = useBlockNumber();
	const {
		state: { theme }
	} = useStore();
	const orders = data && data?.[toggle].action[1];
	const withdrawal = data && data?.[toggle]?.action[0];

	return (
		// @ts-ignore
		<Content theme={theme} type={type}>
			<ContentList>
				{data?.[toggle].costRequestCounter ? (
					<ContentItem theme={theme} color={data.color}>
						<ContentItemTitle>
							Swap Request Validation ({data?.[toggle].costRequestCounter}/2)
						</ContentItemTitle>
						<ContentItemText>
							{data?.[toggle].costRequestCounter === 1
								? 'Your Swap request is under validation. Please wait until full confirmation.'
								: 'Your Swap request successfully validated.'}
						</ContentItemText>
					</ContentItem>
				) : null}
				{currentBlockNumber && data?.[toggle]?.depositBlock ? (
					<ContentItem theme={theme}>
						<ContentItemTitle>
							{!data?.[toggle]?.action.length
								? `Deposit confirmation (${
										currentBlockNumber - data?.[toggle]?.depositBlock
								  }/${BLOCKS_AMOUNT})`
								: 'Deposit confirmed'}
						</ContentItemTitle>
						<ContentItemText>
							{data?.[toggle]?.depositBlock < BLOCKS_AMOUNT
								? 'Your deposit is waiting for the particular numbers of the blocks to pass. Please wait for 30 blocks to pass.'
								: !data?.[toggle]?.action
								? 'Your deposit is received and should be confirmed soon.'
								: null}
						</ContentItemText>
					</ContentItem>
				) : null}
				{orders ? (
					<>
						<ContentItem theme={theme}>
							<ContentItemTitle>Conversion GLMR {orders?.s?.slice(4)}</ContentItemTitle>
							<ContentItemText>Type: {orders.a === 1 ? 'SELL' : 'BUY'}</ContentItemText>
							<ContentItemText>Pair: {orders.s}</ContentItemText>
							<ContentItemText>Quantity: {orders.q}</ContentItemText>
							<ContentItemText>Price: {orders.p}</ContentItemText>
							<ContentItemText>
								Time: {format(new Date(orders.ts * 1000), 'dd/MM/yyyy kk:mm:ss')}
							</ContentItemText>
						</ContentItem>
						<ContentItem theme={theme}>
							{withdrawal.t === 0 ? (
								<ContentItemLink theme={theme}>Withdrawal confirmed</ContentItemLink>
							) : (
								<ContentItemText>Withdrawal confirmed</ContentItemText>
							)}
							<ContentItemText>You can check transaction by link</ContentItemText>
						</ContentItem>
					</>
				) : null}
				{data?.[toggle].complete === true ? (
					<ContentItem theme={theme} color={theme.button.default}>
						<ContentItemText color={theme.button.default}>Successful swap!</ContentItemText>
					</ContentItem>
				) : null}
				{data?.[toggle].complete === null ? (
					<ContentItem theme={theme} color={theme.font.pure}>
						<ContentItemText color={theme.font.pure}>No valid operations spotted!</ContentItemText>
					</ContentItem>
				) : null}
			</ContentList>
		</Content>
	);
};
