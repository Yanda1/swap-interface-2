import { Tabs } from './tabs';
import styled from 'styled-components';
import { pxToRem } from '../../styles';

const Wrapper = styled.div`
	max-width: 100%;
	margin: ${pxToRem(76)} auto;
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
