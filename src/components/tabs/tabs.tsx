import styled, { css } from 'styled-components';
import { useStore } from '../../helpers';
import { useState } from 'react';
import { DEFAULT_BORDER_RADIUS, pxToRem, spacing } from '../../styles';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	max-width: ${pxToRem(426)}px;
`;

const TabsContainer = styled.div`
	display: flex;
`;

const Tab = styled.div(({ active }: any) => {
	const {
		state: { theme }
	} = useStore();

	return css`
		z-index: 10;
		cursor: pointer;
		color: ${theme.font.pure};
		padding: ${spacing[6]} ${spacing[26]};
		text-align: center;
		max-width: ${pxToRem(115)};
		margin-right: ${spacing[4]};
		background: ${theme.background.mobile};
		border-radius: ${DEFAULT_BORDER_RADIUS} ${DEFAULT_BORDER_RADIUS} 0 0;
		border: 1px solid ${theme.button.wallet};
		border-bottom: none;

		&:nth-child(${++active}) {
			border-bottom: 2px solid ${theme.button.default};
		}
	`;
});

const TabContent = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		color: ${theme.font.pure};
		padding: 20px;
		display: block;
		background: ${theme.background.mobile};
		border: 1px solid ${theme.button.wallet};
	`;
});

type Props = {
	data?: any;
	color?: number;
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
		padding: 0 0 26px 20px;
		border-left: 1px solid ${theme.font.default};
		position: relative;
		margin-left: 10px;

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
			width: 13px;
			height: 13px;
			background: ${theme.font.default};
			border-radius: 50%;
			position: absolute;
			left: -7px;
			top: 0;
		}

		&:last-child:before {
			left: -6px;
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
									// @ts-ignore
									<Tab key={Math.random()} onClick={() => handleToggle(index)} active={toggle}>
										GLMR {destinationToken !== 'Select Token' && destinationToken}
									</Tab>
								);
							})}
					</TabsContainer>
					<TabContent>
						{newData?.length &&
							newData.map((item: any) => {
								return (
									<ContentList>
										<ContentItem key={Math.random()}>
											<ContentItemTitle>
												Swap Request Validation ({data[toggle].costRequestCounter}/2)
											</ContentItemTitle>
											<ContentItemText>Your Swap request successfully validated.</ContentItemText>
										</ContentItem>
										<ContentItem key={Math.random()}>
											<ContentItemTitle>
												Deposit confirmation ({data[toggle].depositBlock}/30)
											</ContentItemTitle>
											<ContentItemText>Your Swap request successfully validated.</ContentItemText>
										</ContentItem>
										<ContentItem key={Math.random()}>
											<ContentItemTitle>Conversion GLMR {destinationToken}</ContentItemTitle>
											<ContentItemText>Type: {item.t === 1 ? 'Sell' : 'Buy'}</ContentItemText>
											<ContentItemText>Pair: GLMR{destinationToken}</ContentItemText>
											<ContentItemText>Quantity: {item.q}</ContentItemText>
											<ContentItemText>Price: {item.p}</ContentItemText>
											<ContentItemText>Time: 10.05.2022 10:54:33 UTC</ContentItemText>
										</ContentItem>
										<ContentItem key={Math.random()}>
											<ContentItemLink>Withdrawal confirmed!</ContentItemLink>
											<ContentItemText>You can check transaction by link</ContentItemText>
										</ContentItem>
										<ContentItem key={Math.random()} color={data[toggle].action}>
											<ContentItemText color={data[toggle].action}>
												{data[toggle].action === 1 ? 'Successful' : 'Unsuccessful'} swap!
											</ContentItemText>
										</ContentItem>
									</ContentList>
								);
							})}
					</TabContent>
				</>
			)}
		</Wrapper>
	);
};
