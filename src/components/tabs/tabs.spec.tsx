import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Tabs } from './tabs';

describe('SelectList', () => {
	it('Render tab component with one tab', function () {
		const eventsData = [
			{
				id: 0,
				costRequestCounter: 1,
				depositBlock: 10,
				action: [
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
			}
		];

		const { getByTestId } = render(
			<AuthProvider>
				<Tabs data={eventsData} />
			</AuthProvider>
		);

		const wrapper = getByTestId('tabs-container');
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toMatchSnapshot();
	});

	it('Render tab component with correct length, data and styles', function () {
		const eventsData = [
			{
				id: 0,
				costRequestCounter: 2,
				depositBlock: 10,
				action: [
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
				complete: false
			},
			{
				id: 0,
				costRequestCounter: 1,
				depositBlock: 30,
				action: [
					{
						t: 0,
						a: 1,
						s: 'GLMRBTC',
						q: 24.0,
						p: 0.8503,
						ts: 1654846854
					}
				],
				withdraw: true,
				complete: false
			}
		];

		const { getByTestId } = render(
			<AuthProvider>
				<Tabs data={eventsData} />
			</AuthProvider>
		);

		const wrapper = getByTestId('tabs-container');
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toMatchSnapshot();
	});
});
