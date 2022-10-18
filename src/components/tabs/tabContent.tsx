import { BLOCKS_AMOUNT, makeId, useStore } from '../../helpers';
import { format } from 'date-fns';
import styled, { css } from 'styled-components';
import {
	pxToRem,
	spacing,
	fontSize,
	fontWeight,
	theme,
	mediaQuery,
	DEFAULT_TRANSIITON
} from '../../styles';
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
	margin-bottom: ${spacing[4]};
`;

export const ContentItemText = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		color: ${(props: StyleProps) => (props.color ? props.color : theme.font.select)};
		line-height: ${fontSize[22]};
	`;
});

export const ContentItemLink = styled.div`
	color: ${(props: StyleProps) => props.theme.font.pure};
	line-height: ${fontSize[16]};
	text-decoration: underline;
	cursor: pointer;
	transition: ${DEFAULT_TRANSIITON};

	&:hover {
		color: ${(props: StyleProps) => props.theme.button.default};
	}
`;

export const TabContent = ({ data, toggle = 0, type = 'swap' }: Props) => {
	const currentBlockNumber = useBlockNumber();
	const {
		state: { theme }
	} = useStore();
	const orders = data?[toggle]?.action[0];
	const withdrawal = data?[toggle]?.withdraw[0];

	return (
		// @ts-ignore
		<Content theme={theme} type={type}>
			<ContentList>
				{data?.[toggle].costRequestCounter ? (
					<ContentItem theme={theme} color={data.color} key={makeId(32)}>
						<ContentItemTitle>
							Swap Request Validation ({data?.[toggle].costRequestCounter}/2)
						</ContentItemTitle>
						<ContentItemText>
							{data?[toggle].costRequestCounter < 2
								? 'Your Swap request is under validation. Please wait until full confirmation.'
								: 'Your Swap request successfully validated.'}
						</ContentItemText>
					</ContentItem>
				) : null}
				{currentBlockNumber && data?.[toggle]?.depositBlock ? (
					<ContentItem theme={theme} key={makeId(32)}>
						<ContentItemTitle>
							{!data?.[toggle]?.action.length
								? `Deposit confirmation (${
										currentBlockNumber - data?.[toggle]?.depositBlock
								  }/${BLOCKS_AMOUNT})`
								: 'Deposit confirmed'}
						</ContentItemTitle>
						<ContentItemText>
							{currentBlockNumber - data?[toggle].depositBlock < BLOCKS_AMOUNT
								? 'Your deposit is waiting for the particular numbers of the blocks to pass. Please wait for 30 blocks to pass.'
								: currentBlockNumber - data?[toggle].depositBlock >= BLOCKS_AMOUNT &&
								  !data?[toggle].action.length
								? 'Your deposit is received and should be confirmed soon.'
								: null}
						</ContentItemText>
					</ContentItem>
				) : null}
				{orders ? (
					<ContentItem key={makeId(32)} theme={theme}>
						<ContentItemTitle>Conversion GLMR {orders.s.slice(4)}</ContentItemTitle>
						<ContentItemText>Type: {orders.a === 0 ? 'SELL' : 'BUY'}</ContentItemText>
						<ContentItemText>Pair: {orders.s}</ContentItemText>
						<ContentItemText>Quantity: {orders.q}</ContentItemText>
						<ContentItemText>Price: {orders.p}</ContentItemText>
						<ContentItemText>
							Time: {format(new Date(orders.ts * 1000), 'dd/MM/yyyy kk:mm:ss')}
						</ContentItemText>
					</ContentItem>
				) : null}
				{withdrawal.t === 0 && !withdrawalLink ? (
					<ContentItem key={makeId(32)} theme={theme}>
						<ContentItemLink>Withdrawal confirmed</ContentItemLink>
						<ContentItemText>
							Your funds is almost there, we are waiting for their landing into your wallet.
						</ContentItemText>
					</ContentItem>
				) : withdrawalLink ? (
					<ContentItem key={makeId(32)} theme={theme}>
						<ContentItemLink>Withdrawal confirmed</ContentItemLink>
						<ContentItemText>You can check transaction by link</ContentItemText>
					</ContentItem>
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
