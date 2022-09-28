import styled, { css } from 'styled-components';
import { useStore } from '../../helpers';
import { useState } from 'react';
import { DEFAULT_BORDER_RADIUS, pxToRem, spacing } from '../../styles';

const Wrapper = styled.div(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		display: flex;
		flex-direction: column;
		max-width: ${pxToRem(426)}px;
	`;
});

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
		padding: ${spacing[6]} ${spacing[30]};
		text-align: center;
		max-width: ${pxToRem(115)};
		margin-right: ${spacing[4]};
		background: ${theme.background.mobile};
		border: 1px solid ${theme.button.wallet};

		&:nth-child(${++active}) {
			border-bottom: 1px solid ${theme.background.default};
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
		outline: 1px solid ${theme.button.wallet};
	`;
});

const ContentContainer = styled.div`
	//border-left: 1px solid #d9d9d980;
	padding-left: 12px;
	position: relative;

	&::before {
		content: '';
		position: absolute;
		top: 3%;
		left: 0;
		display: block;
		width: 1px;
		height: 100%;
		background-color: #d9d9d980;
	}
`;

const ContentTitle = styled.h3.attrs((props: { action: number }) => props)`
	text-align: left;
	position: relative;
	color: ${(props) => props.action && 'tomato'};

	&::before {
		content: '';
		position: absolute;
		top: 50%;
		left: -4%;
		display: block;
		width: 6px;
		height: 6px;
		background-color: #7c7c7c;
		border-radius: ${DEFAULT_BORDER_RADIUS};
	}
`;

const ContentLink = styled.a(() => {
	const {
		state: { theme }
	} = useStore();

	return css`
		color: ${theme.font.pure};
		text-decoration: underline;
	`;
});

type Props = {
	data: any;
};

export const Tabs = ({ data }: Props) => {
	const {
		state: { destinationToken }
	} = useStore();
	const [toggle, setToggle] = useState(0);
	const handleToggle = (index: number) => setToggle(index);
	console.log(data);
	const newData = data[toggle].orders;
	console.log(newData);

	return (
		<>
			<span>Pending Swaps ({data.length})</span>
			<Wrapper>
				{data?.length > 0 && (
					<>
						<TabsContainer>
							{data?.length &&
								data.map((item: any) => {
									console.log(data.action);
									const index = data.indexOf(item);

									return (
										// @ts-ignore
										<Tab key={Math.random()} onClick={() => handleToggle(index)} active={toggle}>
											GLMR {destinationToken}
										</Tab>
									);
								})}
						</TabsContainer>
						<TabContent>
							{newData?.length && (
								<ContentContainer>
									<ContentTitle>Successful deposit</ContentTitle>
									<div style={{ paddingLeft: '94px' }}>
										<p>Gas fee: 82912</p>
									</div>
									<ContentTitle>
										{newData.t === 1 ? 'Sell' : 'Buy'} Order {newData.s}
									</ContentTitle>
									<div style={{ paddingLeft: '94px' }}>
										<p>Ex Rate: 0.{Math.random()}</p>
										<p>Quantity: {newData.q}</p>
										<p>Price: {newData.p}</p>
										<p>{newData.s}</p>
									</div>
									<ContentTitle>
										<ContentLink href="https://developer.mozilla.org" target="_blank">
											Withdraw transaction link
										</ContentLink>
									</ContentTitle>
									<div style={{ paddingLeft: '94px' }}>
										<p>Withdrawal fee: 82912</p>
									</div>
									<ContentTitle action={data[toggle].action}>
										{data[toggle].action === 1 ? 'Successful swap!' : 'Unsuccessful swap!'}
									</ContentTitle>
								</ContentContainer>
							)}
						</TabContent>
					</>
				)}
			</Wrapper>
		</>
	);
};
