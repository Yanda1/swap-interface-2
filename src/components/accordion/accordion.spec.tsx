import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Accordion } from '../../components';

describe('Accordion', () => {
	it('should match snapshot', () => {
		const data = [
			{
				blockNumber: 1343324,
				header: {
					timestamp: undefined,
					symbol: 'GLMRBTC',
					scoin: 'BTC',
					fcoin: 'GLMR',
					samt: '32423',
					net: 'test'
				},
				content: {
					action: 1,
					qty: '100',
					price: '10',
					timestamp: 28304732,
					cexFee: '4',
					withdrawFee: '2',
					success: true
				},
				gasFee: '039328423342',
				withdrawl: {
					amount: '40',
					withdrawFee: '7',
					url: 'moonscan.io'
				}
			}
		];

		const { getByTestId } = render(
			<AuthProvider>
				<Accordion data={data} contentLoading={false} />
			</AuthProvider>
		);
		expect(getByTestId('accordion')).toMatchSnapshot();
	});

	it('Should return message if no data available', () => {
		const { getByText } = render(
			<AuthProvider>
				<Accordion data={[]} contentLoading={false} />
			</AuthProvider>
		);
		expect(getByText(/You do not have any transactions yet/)).toBeInTheDocument();
	});
});
