import { useState } from 'react';
import { makeId, useStore } from '../../helpers';
import styled, { css } from 'styled-components';
import { DEFAULT_BORDER_RADIUS, spacing } from '../../styles';
import { TabContent } from './tabContent';

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
		color: ${theme.font.secondary};
		padding: ${spacing[6]} ${spacing[6]};
		text-align: center;
		margin-right: ${spacing[4]};
		background: ${theme.background.secondary};
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

type Props = {
	data?: any;
	active?: any;
};

export const Tabs = ({ data }: Props) => {
	const [toggleIndex, setToggleIndex] = useState(0);
	const handleToggle = (index: number) => setToggleIndex(index);

	return (
		<Wrapper data-testid="tabs-container">
			<>
				<TabsContainer>
					{data?.length &&
						data.map((item: any) => {
							const index = data.indexOf(item);

							return (
								<Tab key={makeId(32)} onClick={() => handleToggle(index)} active={toggleIndex}>
									{item.pair}
								</Tab>
							);
						})}
				</TabsContainer>
				<TabContent data={data} toggleIndex={toggleIndex} />
			</>
		</Wrapper>
	);
};
