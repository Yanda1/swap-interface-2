import styled, { css } from 'styled-components';
import { useStore } from '../../helpers';
import { DEFAULT_BORDER_RADIUS, spacing } from '../../styles';
import { useState } from 'react';
import { TabContentNew } from './tabContentNew';

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
		cursor: pointer;
		color: ${theme.font.secondary};
		padding: ${spacing[6]} ${spacing[6]};
		text-align: center;
		margin-right: ${spacing[4]};
		background: ${theme.background.secondary};
		border-radius: ${DEFAULT_BORDER_RADIUS} ${DEFAULT_BORDER_RADIUS} 0 0;
		border: 1px solid ${theme.border.default};
		border-bottom: ${active ? `1px solid ${theme.button.default}` : 'none'};

		&:last-child {
			margin-right: 0;
		}
	`;
});

type Props = {
	active: boolean;
};

export const TabsNew = ({ swap }: any) => {
	const [active, setActive] = useState(false);
	console.log(swap);

	return (
		<Wrapper>
			<TabsContainer>
				<Tab active={active} onClick={() => setActive(true)}>
					{swap.pair}
				</Tab>
			</TabsContainer>
			<TabContentNew swap={swap} selectItem={active} />
		</Wrapper>
	);
};
