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

export const TabModal = () => {
	return (
		<Wrapper>
			<Paragraph>Pending Swaps ()</Paragraph>
			<Tabs
				data={[
					{
						id: 0,
						costRequestCounter: 1,
						depositBlock: 10,
						action: [
							{
								t: 0,
								id: '39ff037641ab4658b4f1d2831e9132ce'
							},
							{
								t: 0,
								a: 1,
								s: 'GLMRBUSD',
								q: 24.0,
								p: 0.8503,
								ts: 1654846854
							}
						],
						withdraw: true,
						complete: true
					},
					{
						id: 0,
						costRequestCounter: 1,
						depositBlock: 10,
						action: [
							{
								t: 0,
								id: '39ff037641ab4658b4f1d2831e9132ce'
							},
							{
								t: 0,
								a: 0,
								s: 'GLMRBTC',
								q: 95.0,
								p: 0.7907,
								ts: 1654006400
							}
						],
						withdraw: true,
						complete: null
					}
				]}
			/>
		</Wrapper>
	);
};
