import { Tabs } from './tabs';
import styled from 'styled-components';
import { spacing } from '../../styles';

const Wrapper = styled.div`
	margin-top: ${spacing[76]};
`;

const Paragraph = styled.p`
	color: #b4b4b4;
`;

type Props = {
	data: object[];
};

export const TabModal = ({ data }: Props) => {
	return (
		<Wrapper>
			<Paragraph>Pending Swaps ({data.length})</Paragraph>
			<Tabs data={data} />
		</Wrapper>
	);
};
