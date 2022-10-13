import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Accordion } from '../../components';

describe('Accordion', () => {
	// it('should match snapshot', () => {
	// 	const data = [
	// 		{
	// 			title: {
	// 				symbol: 'GLMRBTC',
	// 				date: '23/11/21 12:34',
	// 				withdrawn: '123CELO (celo)',
	// 				received: '456USDT (BTC)'
	// 			},
	// 			content: 'Lorem ipsum dolor sit amet'
	// 		},
	// 		{
	// 			title: {
	// 				symbol: 'ETHBTC',
	// 				date: '03/04/22 9:12',
	// 				withdrawn: '245.93EtH (ETH)',
	// 				received: '123235445BTC (BTC)'
	// 			},
	// 			content: 'Lorem ipsum dolor sit amet'
	// 		},
	// 		{
	// 			title: {
	// 				symbol: 'BUSDUSDT',
	// 				date: '01/05/18 12:34',
	// 				withdrawn: '12BUSD (ETH)',
	// 				received: '234.123USDT (ETH)'
	// 			},
	// 			content: 'Lorem ipsum dolor sit amet'
	// 		}
	// 	];

	// 	const { getByTestId } = render(
	// 		<AuthProvider>
	// 			<Accordion data={data} />
	// 		</AuthProvider>
	// 	);
	// 	expect(getByTestId('accordion')).toMatchSnapshot();
	// });

	it('Should return message if no data available', () => {
		const { getByText } = render(
			<AuthProvider>
				<Accordion data={[]} />
			</AuthProvider>
		);
		expect(getByText(/You do not have any transactions yet/)).toBeInTheDocument();
	});
});
