import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Tabs } from './tabs';
import { darkTheme, DEFAULT_BORDER_RADIUS, spacing } from '../../styles';
import { format } from 'date-fns';

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

		const { getByText, getByRole, getByTestId, getAllByRole } = render(
			<AuthProvider>
				<Tabs data={eventsData} />
			</AuthProvider>
		);

		const wrapper = getByTestId('tabs-container');
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toMatchSnapshot();
		expect(wrapper).toHaveStyle(`
			display: flex;
			flex-direction: column;
			max-width: 100%;
			`);

		const Tab = getByText('GLMR Select Token');
		expect(Tab).toBeInTheDocument();
		expect(Tab).toHaveStyle(
			`
		z-index: 10;
		cursor: pointer;
		color: ${darkTheme.font.secondary};
		padding: ${spacing[6]} ${spacing[6]};
		text-align: center;
		margin-right: 0;
		background: ${darkTheme.background.secondary};
		border-radius: ${DEFAULT_BORDER_RADIUS} ${DEFAULT_BORDER_RADIUS} 0 0;
		border: 1px solid ${darkTheme.button.wallet};
		border-bottom: 1px solid ${darkTheme.button.default};
			`
		);

		const contentList = getByRole('list');
		expect(contentList).toBeInTheDocument();
		expect(contentList).toHaveStyle(`
		list-style: none;
		padding: 0;
		`);

		const contentListItems = getAllByRole('listitem');
		expect(contentListItems.length).toBe(4);

		const contentItemTitleCostRequest = getByText(
			`Swap Request Validation (${eventsData[0].costRequestCounter}/2)`
		);
		expect(contentItemTitleCostRequest).toBeInTheDocument();
		expect(contentItemTitleCostRequest).toHaveStyle('margin: 0');

		const contentItemTitleDeposit = getByText(
			`Conversion GLMR ${eventsData[0].action[0].s.slice(4)}`
		);
		expect(contentItemTitleDeposit).toBeInTheDocument();

		const itemTextCostRequest = getByText(
			'Your Swap request is under validation. Please wait until full confirmation.'
		);
		expect(itemTextCostRequest).toBeInTheDocument();

		const itemTextType = getByText('Type: BUY');
		expect(itemTextType).toBeInTheDocument();

		const itemTextPair = getByText(`Pair: ${eventsData[0].action[0].s}`);
		expect(itemTextPair).toBeInTheDocument();

		const itemTextQuantity = getByText(`Quantity: ${eventsData[0].action[0].q}`);
		expect(itemTextQuantity).toBeInTheDocument();

		const itemTextPrice = getByText(`Price: ${eventsData[0].action[0].p}`);
		expect(itemTextPrice).toBeInTheDocument();

		const itemTextTime = getByText(
			`Time: ${format(new Date(eventsData[0].action[0].ts * 1000), 'dd/MM/yyyy kk:mm:ss')}`
		);
		expect(itemTextTime).toBeInTheDocument();

		const itemTextStatus = getByText('Successful swap!');
		expect(itemTextStatus).toBeInTheDocument();
		expect(itemTextStatus).toHaveStyle(`color: ${darkTheme.button.default}`);
	});

	it.only('Render tab component with correct length, data and styles', function () {
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
		expect(wrapper).toHaveStyle(`
			display: flex;
			flex-direction: column;
			max-width: 100%;
			`);

		const TabsContainer = getByTestId('tabs');
		expect(TabsContainer).toBeInTheDocument();
	});
});
