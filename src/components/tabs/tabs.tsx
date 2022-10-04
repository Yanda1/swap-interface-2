import { format } from 'date-fns';
import styled, { css } from 'styled-components';
import { BLOCKS_AMOUNT, useStore } from '../../helpers';
import { useState } from 'react';
import { DEFAULT_BORDER_RADIUS, pxToRem, spacing } from '../../styles';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 100%;
`;

const TabsContainer = styled.div`
	display: flex;
`;

const Tab = styled.div(({ active }: Props) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		flex-basis: ${pxToRem(120)};
		flex-shrink: 2;
		z-index: 10;
		cursor: pointer;
		color: ${theme.font.pure};
		padding: ${spacing[6]} 0;
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

const TabContent = styled.div(() => {
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

type Props = {
	data?: any;
	color?: number;
	active?: any;
};

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
			width: ${pxToRem(13)};
			height: ${pxToRem(13)};
			background: ${theme.font.default};
			border-radius: 50%;
			position: absolute;
			left: ${pxToRem(-7)};
			top: 0;
		}

		&:last-child:before {
			left: ${pxToRem(-6)};
			background-color: ${color ? theme.button.default : theme.font.default};
		}
	`;
});

const ContentItemTitle = styled.h3`
	margin: 0;
`;

const ContentItemText = styled.p(({ color }: any) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		color: ${color ? theme.button.default : theme.font.pure};
	`;
});

const ContentItemLink = styled.a`
	text-decoration: underline;
`;

export const Tabs = ({ data }: Props) => {
	const {
		state: { destinationToken }
	} = useStore();
	const [toggle, setToggle] = useState(0);
	const handleToggle = (index: number) => setToggle(index);
	const newData = data && data[toggle].orders;

	return (
		<Wrapper>
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
					<TabContent>
						<ContentList>
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
							<ContentItem key={Math.random()}>
								<ContentItemTitle>
									{!data[toggle].orders
										? `Deposit confirmation (${data[toggle].depositBlock}/${BLOCKS_AMOUNT})`
										: 'Deposit confirmed'}
								</ContentItemTitle>
								<ContentItemText>
									{data[toggle].depositBlock < BLOCKS_AMOUNT
										? 'Your deposit is waiting for the particular numbers of the blocks to pass. Please wait for 30 blocks to pass.'
										: !data[toggle].orders
										? 'Your deposit is received and should be confirmed soon.'
										: null}
								</ContentItemText>
							</ContentItem>
							{newData?.length &&
								newData.map((item: any) => {
									return (
										<ContentItem key={Math.random()}>
											<ContentItemTitle>Conversion GLMR {destinationToken}</ContentItemTitle>
											<ContentItemText>Type: {item.t === 1 ? 'SELL' : 'BUY'}</ContentItemText>
											<ContentItemText>Pair: GLMR{destinationToken}</ContentItemText>
											<ContentItemText>Quantity: {item.q}</ContentItemText>
											<ContentItemText>Price: {item.p}</ContentItemText>
											<ContentItemText>
												Time: {format(new Date(item.ts * 1000), 'dd/MM/yyyy kk:mm:ss')}
											</ContentItemText>
										</ContentItem>
									);
								})}
							<ContentItem key={Math.random()}>
								<ContentItemLink>Withdrawal confirmed!</ContentItemLink>
								<ContentItemText>You can check transaction by link</ContentItemText>
							</ContentItem>
							<ContentItem key={Math.random()} color={data[toggle].action}>
								<ContentItemText color={data[toggle].complete}>
									{data[toggle].complete ? 'Successful swap!' : 'Not valid operations spotted!'}
								</ContentItemText>
							</ContentItem>
						</ContentList>
					</TabContent>
				</>
			)}
		</Wrapper>
	);
};
