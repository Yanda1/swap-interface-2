import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useStore } from '../../helpers';
import {
	DEFAULT_BORDER_RADIUS,
	DEFAULT_TRANSIITON,
	fontSize,
	mediaQuery,
	pxToRem
} from '../../styles';
import type { Theme } from '../../styles';
import { spacing } from '../../styles';

type StyleProps = {
	theme: Theme;
	open?: boolean;
	color?: string;
};

const Message = styled.div`
	margin-top: ${spacing[20]};
`;

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
		props.open ? pxToRem(300) : pxToRem(30)}; // TODO: adjust to content height: ;
	color: ${(props: StyleProps) => props.theme.font.pure};
	text-align: center;
	position: relative;
	margin-top: ${(props: StyleProps) => (props.open ? '0px' : `-${spacing[30]}`)};
	text-align: left;
	transition: ${(props: StyleProps) =>
		props.open
			? 'all .55s cubic-bezier(0.080, 1.09, 0.320, 1.275)'
			: 'all .2s cubic-bezier(0.6, -0.28, 0.735, 0.045)'};
`;

const ContentText = styled.div(
	({ open }: { open: boolean }) => css`
		visibility: ${open ? 'visible' : 'hidden'};
		opacity: ${open ? '1' : '0'};
		overflow: auto;
		padding: ${spacing[12]} ${spacing[20]};
		overflow-y: scroll;
		transition: ${open ? 'all 0.4s ease-in' : 'all 0.2s ease-in'};
	`
);

type DataProps = {
	title: any;
	content: string;
	open: boolean;
};

type Props = { data: Omit<DataProps, 'open'>[] };

export const Accordion = ({ data }: Props) => {
	const [accordionItems, setAccordionItems] = useState<DataProps[]>([]);
	const {
		state: { theme }
	} = useStore();

	useEffect(() => {
		const accordion: any[] = [];
		data.forEach((dataset) => {
			accordion.push({ ...dataset, open: false });
		});
		setAccordionItems(accordion);
	}, []);

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

	return accordionItems?.length > 0 ? (
		<Wrapper theme={theme} data-testid="accordion">
			{accordionItems.map((item: DataProps, index: number) => (
				<Card theme={theme} key={index}>
					<TitleWrapper theme={theme} onClick={() => handleClick(index)}>
						<TitleTab flex={1} mobile={true}>
							<TitleText color={theme.font.pure}>{item.title?.symbol}</TitleText>
						</TitleTab>
						<TitleTab>
							Deposit Time: <TitleText color={theme.font.pure}>{item.title?.date}</TitleText>
						</TitleTab>
						<TitleTab>
							Sent: <TitleText color={theme.font.pure}>{item.title?.withdrawn}</TitleText>
						</TitleTab>
						<TitleTab>
							Reiceved: <TitleText color={theme.font.pure}>{item.title?.received}</TitleText>
						</TitleTab>
						{/* @ts-ignore */}
						<ArrowWrapper open={item.open} theme={theme}>
							<Arrow theme={theme}></Arrow>
						</ArrowWrapper>
						{/* @ts-ignore */}
					</TitleWrapper>
					{/* @ts-ignore */}
					<Content theme={theme} open={item.open}>
						<ContentText open={item.open}>{item.content}</ContentText>
					</Content>
				</Card>
			))}
		</Wrapper>
	) : (
		<Message>You do not have any transactions yet</Message>
	);
};
