import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import styled, { css } from 'styled-components';
import {
	ContentItem,
	ContentItemTitle,
	ContentList,
	ContentItemText,
	ContentItemLink,
	Spinner
} from '../../components';
import { beautifyNumbers, useBreakpoint, useStore, WEI_TO_GLMR } from '../../helpers';
import type { TransactionData } from '../../helpers';
import {
	DEFAULT_BORDER_RADIUS,
	DEFAULT_TRANSIITON,
	fontSize,
	mediaQuery,
	pxToRem,
	spacing
} from '../../styles';
import type { Theme } from '../../styles';
import { Notifications } from '../../pages';

type StyleProps = {
	theme: Theme;
	open?: boolean;
	color?: string;
	height?: 'large' | 'small';
};

export const Wrapper = styled.div`
	background-color: ${(props: StyleProps) => props.theme.background.mobile};
	margin-top: ${spacing[12]};
	font-size: ${fontSize[16]};
	line-height: ${fontSize[22]};
	border: 1px solid ${(props: StyleProps) => props.theme.background.history};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	overflow: hidden;
`;

const Card = styled.div`
	border-bottom: 1px solid ${(props: StyleProps) => props.theme.background.history};

	&:last-child {
		border-bottom: none;
	}
`;

const TitleWrapper = styled.div`
	cursor: pointer;
	padding: ${spacing[12]} ${spacing[48]} ${spacing[12]} ${spacing[20]};
	background-color: ${(props: StyleProps) => props.theme.background.mobile};
	transition: ${DEFAULT_TRANSIITON};
	position: relative;
	z-index: 10;
	display: flex;
	gap: ${spacing[8]};
	justify-content: space-between;
`;

const TitleTab = styled.div(
	({ flex = 2, mobile = false }: { flex?: number; mobile?: boolean }) =>
		css`
			display: flex;
			gap: ${spacing[8]};
			flex: ${flex};
			${!mobile && `${mediaQuery('s')} {display: none}`}
		`
);

const TitleText = styled.div`
	color: ${(props: StyleProps) => props.color};
`;

const MobileHeaderInfo = styled.div`
	color: ${(props: StyleProps) => props.color};
`;

const MobileHeaderSection = styled.div`
	display: flex;
	gap: ${spacing[8]};
`;

const ArrowWrapper = styled.div`
	width: ${spacing[10]};
	height: ${spacing[10]};
	background-color: ${(props: StyleProps) => props.theme.font.pure};
	position: absolute;
	top: 50%;
	right: ${spacing[20]};
	transition: ${DEFAULT_TRANSIITON};
	transform: translate(-50%, -50%) rotate(${(props: StyleProps) => (props.open ? '45' : '-135')}deg);
`;
const Arrow = styled.div`
	width: 100%;
	height: 100%;
	background-color: ${(props: StyleProps) => props.theme.background.mobile};
	position: absolute;
	left: 15%;
	top: 15%;
`;

const Content = styled.div`
	height: ${(props: StyleProps) =>
		props.open ? (props.height === 'small' ? pxToRem(128) : pxToRem(350)) : pxToRem(30)};
	color: ${(props: StyleProps) => props.theme.font.pure};
	text-align: center;
	position: relative;
	margin-top: ${(props: StyleProps) => (props.open ? '0px' : `-${spacing[30]}`)};
	text-align: left;
	transition: ${(props: StyleProps) =>
		props.open
			? 'all .55s cubic-bezier(0.080, 1.09, 0.320, 1.275)'
			: 'all .2s cubic-bezier(0.6, -0.28, 0.735, 0.045)'};

	${mediaQuery('s')} {
		height: ${(props: StyleProps) =>
			props.open ? (props.height === 'small' ? pxToRem(175) : pxToRem(425)) : pxToRem(30)};
	}
`;

const EmptyColumn = styled.div`
	flex: 1;
`;

const ContentColumn = styled.div`
	flex: 6;
`;

const SpinnerWrapper = styled.div`
	display: flex;
	justify-content: center;

	${mediaQuery('s')} {
		margin-top: ${spacing[16]};
	}
`;

const ContentText = styled.div(
	({ open }: { open: boolean }) => css`
		display: flex;
		gap: ${spacing[8]};
		visibility: ${open ? 'visible' : 'hidden'};
		opacity: ${open ? '1' : '0'};
		overflow: auto;
		padding: ${spacing[12]} ${spacing[48]} ${spacing[12]} ${spacing[20]};
		overflow-y: scroll;
		transition: ${open ? 'all 0.4s ease-in' : 'all 0.2s ease-in'};

		${mediaQuery('s')} {
			display: inline-block;
		}
	`
);

type DataProps = TransactionData & { open: boolean };

type Props = { data: Omit<DataProps, 'open'>[]; contentLoading: boolean };

export const Accordion = ({ data, contentLoading }: Props) => {
	const [accordionItems, setAccordionItems] = useState<DataProps[]>([]);
	const {
		state: { theme }
	} = useStore();
	const { isBreakpointWidth: mobile } = useBreakpoint('s');

	useEffect(() => {
		const accordion: any[] = [];
		data?.forEach((dataset) => {
			accordion.push({ ...dataset, open: false });
		});
		setAccordionItems(accordion);
	}, [data]);

	const handleClick = (index: number) => {
		if (accordionItems.length > 0) {
			const updateAccordion = accordionItems.map((data: DataProps, i: number) => {
				if (i === index) {
					data.open = !data.open;
				}

				return data;
			});
			setAccordionItems(updateAccordion);
		}
	};

	const formatDate = (ts: number | undefined): string =>
		ts ? format(new Date(ts * 1000), 'dd/MM/yyyy hh:mm') : 'n/a'; // TODO: helper?

	return accordionItems?.length > 0 ? (
		<Wrapper theme={theme} data-testid="accordion">
			{accordionItems.map((item: DataProps, index: number) => (
				<Card theme={theme} key={index}>
					<TitleWrapper theme={theme} onClick={() => handleClick(index)}>
						<TitleTab flex={1} mobile={true}>
							<TitleText color={theme.font.pure}>{item.header?.symbol}</TitleText>
						</TitleTab>
						<TitleTab>
							Deposit Time:{' '}
							<TitleText color={theme.font.pure}>
								{/* TODO: timezone? */}
								{formatDate(item.header?.timestamp)}
							</TitleText>
						</TitleTab>
						<TitleTab>
							Sent:{' '}
							<TitleText color={theme.font.pure}>
								{beautifyNumbers({ n: +item.header?.samt * WEI_TO_GLMR ?? '0' })}{' '}
								{item.header?.scoin} (Moonbeam)
							</TitleText>
						</TitleTab>
						<TitleTab>
							Received:{' '}
							<TitleText color={theme.font.pure}>
								{beautifyNumbers({ n: item.withdrawl?.amount ?? '' })}{' '}
								{item.withdrawl?.amount
									? `${item.header?.fcoin} (
								${item.header?.net})`
									: ''}
							</TitleText>
						</TitleTab>
						{/* @ts-ignore */}
						<ArrowWrapper open={item.open} theme={theme}>
							<Arrow theme={theme}></Arrow>
						</ArrowWrapper>
						{/* @ts-ignore */}
					</TitleWrapper>
					<Content
						theme={theme}
						// @ts-ignore
						open={item.open}
						height={item.content === 'none' || !item?.content ? 'small' : 'large'}>
						<ContentText open={item.open}>
							<EmptyColumn />
							<ContentColumn>
								{mobile && (
									<MobileHeaderInfo color={theme.font.select}>
										<MobileHeaderSection>
											Deposit Time:{' '}
											<TitleText color={theme.font.pure}>
												{/* TODO: timezone? */}
												{formatDate(item.header?.timestamp)}
											</TitleText>
										</MobileHeaderSection>
										<MobileHeaderSection>
											Sent:{' '}
											<TitleText color={theme.font.pure}>
												{beautifyNumbers({ n: +item.header?.samt * WEI_TO_GLMR ?? '0' })}{' '}
												{item.header?.scoin} (Moonbeam)
											</TitleText>
										</MobileHeaderSection>
										<MobileHeaderSection>
											Received:{' '}
											<TitleText color={theme.font.pure}>
												{beautifyNumbers({ n: item.withdrawl?.amount ?? '' })}{' '}
												{item.withdrawl?.amount
													? `${item.header?.fcoin} (${item.header?.net})`
													: ''}
											</TitleText>
										</MobileHeaderSection>
									</MobileHeaderInfo>
								)}
								{contentLoading ? (
									<SpinnerWrapper>
										<Spinner size="medium" color={theme.background.history} />
									</SpinnerWrapper>
								) : (
									<ContentList>
										{item.content === 'none' ? (
											<>
												<ContentItemText>This swap has not been completed.</ContentItemText>{' '}
												<ContentItemText color={theme.button.error}>
													Unsuccessful swap!
												</ContentItemText>
											</>
										) : !item.content ? (
											<ContentItemText>
												Data currently not available - please try again later
											</ContentItemText>
										) : (
											<>
												<ContentItem theme={theme}>
													<ContentItemTitle>Successfull Deposit</ContentItemTitle>
													<ContentItemText>Gas fee: {item.gasFee}</ContentItemText>
												</ContentItem>
												<ContentItem theme={theme}>
													<ContentItemTitle>Buy Order {item.header?.symbol}</ContentItemTitle>
													<ContentItemText>
														Quantity: {beautifyNumbers({ n: item.content?.qty })}{' '}
														{item.header?.scoin}
													</ContentItemText>
													<ContentItemText>Exchange Rate: {item.content?.price}</ContentItemText>
													<ContentItemText>
														Date: {formatDate(item.content?.timestamp)}
													</ContentItemText>
													<ContentItemText>
														CEX Fee: {beautifyNumbers({ n: item.content?.cexFee })}{' '}
														{item.header?.fcoin}
													</ContentItemText>
												</ContentItem>
												<ContentItem theme={theme}>
													<ContentItemLink
														theme={theme}
														onClick={() => window.open(item.withdrawl?.url)}>
														Withdraw Transaction Link
													</ContentItemLink>
													<ContentItemText>
														Withdrawal Fee:{' '}
														{beautifyNumbers({ n: item.withdrawl?.withdrawFee ?? '' })}{' '}
														{item.header?.fcoin}
													</ContentItemText>
												</ContentItem>
												<ContentItem theme={theme}>
													<ContentItemText
														color={
															item.content?.success ? theme.button.default : theme.button.error
														}>
														{item.content?.success ? 'Successful swap!' : 'Unsuccessful swap!'}
													</ContentItemText>
												</ContentItem>
											</>
										)}
									</ContentList>
								)}
							</ContentColumn>
						</ContentText>
					</Content>
				</Card>
			))}
		</Wrapper>
	) : (
		<Notifications>You do not have any transactions yet</Notifications>
	);
};
