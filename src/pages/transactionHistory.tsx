import { useState } from 'react';
import styled from 'styled-components';
import { TextField, Select, Accordion } from '../components';
import { mediaQuery, spacing, viewport } from '../styles';

const Wrapper = styled.main`
	max-width: ${viewport[1062]};
	margin: 0 auto;
`;

const Inputs = styled.div`
	display: flex;
	gap: ${spacing[12]};

	& > div:last-child {
		margin-left: auto;
	}

	${mediaQuery('s')} {
		flex-direction: column;

		& > div:last-child {
			margin-left: 0;
		}
	}
`;

const data = [
	{
		title: {
			symbol: 'GLMRBTC',
			date: '23/11/21 12:34',
			withdrawn: '123CELO (celo)',
			received: '456USDT (BTC)'
		},
		content: `Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit
                  in voluptate velit esse cillum dolore
                  eu fugiat nulla pariatur. Excepteur
                  sint occaecat cupidatat non proident,
                  sunt in culpa qui officia deserunt
                  mollit anim id est laborum.`
	},
	{
		title: {
			symbol: 'ETHBTC',
			date: '03/04/22 9:12',
			withdrawn: '245.93EtH (ETH)',
			received: '123235445BTC (BTC)'
		},
		content: `Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit
                  in voluptate velit esse cillum dolore
                  eu fugiat nulla pariatur. Excepteur
                  sint occaecat cupidatat non proident,
                  sunt in culpa qui officia deserunt
                  mollit anim id est laborum.`
	},
	{
		title: {
			symbol: 'BUSDUSDT',
			date: '01/05/18 12:34',
			withdrawn: '12BUSD (ETH)',
			received: '234.123USDT (ETH)'
		},
		content: `Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit
                  in voluptate velit esse cillum dolore
                  eu fugiat nulla pariatur. Excepteur
                  sint occaecat cupidatat non proident,
                  sunt in culpa qui officia deserunt
                  mollit anim id est laborum.`
	}
];

const selectData = [
	{ name: 'Sort by', checked: true },
	{ name: 'ETHGLMR', checked: false },
	{ name: 'BTCETH', checked: false },
	{ name: 'ETHKDJKF', checked: false }
];
const selectDates = [
	{ name: 'July 13, 2021 - June 20, 2022', checked: true },
	{ name: 'April 13, 2021 - May 20, 2022', checked: false },
	{ name: 'July 13, 2019 - June 20, 2020', checked: false },
	{ name: 'August 09, 2018 - December 30, 2020', checked: false },
	{ name: 'Juli 09, 2018 - November 30, 2020', checked: false }
];

export const TransactionHistory = () => {
	const [searchTerm, setSearchTerm] = useState('');

	return (
		<Wrapper>
			<Inputs>
				<TextField
					value={searchTerm}
					type="search"
					placeholder="Search"
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Select data={selectData} />
				<Select data={selectDates} />
			</Inputs>
			<Accordion data={data} />
		</Wrapper>
	);
};
