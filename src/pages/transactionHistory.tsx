import { useState } from 'react';
import styled, { css } from 'styled-components';
import { TextField, Select, Accordion, Spinner } from '../components';
import { useStore } from '../helpers';
import { useTransactions } from '../hooks';
import { mediaQuery, spacing, viewport } from '../styles';

const Wrapper = styled.main`
	max-width: ${viewport[1062]};
	margin: 0 auto;
`;

export const Notifications = styled.div(
	({ multiple = true }: { multiple?: boolean }) => css`
		margin-top: ${spacing[24]};
		padding-top: ${multiple ? '0' : spacing[32]};
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: ${spacing[8]};
	`
);

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
	const { data, loading } = useTransactions();
	const {
		state: { theme, isUserVerified }
	} = useStore();

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
			</Inputs>{' '}
			{!isUserVerified ? (
				<Notifications multiple={false}>
					Make sure that you are logged in to see your Transaction History
				</Notifications>
			) : loading ? (
				<Notifications>
					<Spinner size="medium" color={theme.background.history} />
					Fetching your Transaction History
				</Notifications>
			) : (
				<Accordion data={data} />
			)}
		</Wrapper>
	);
};
