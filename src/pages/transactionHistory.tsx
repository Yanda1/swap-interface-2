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
	{ name: 'Symbol', checked: false },
	{ name: 'Date', checked: false },
	{ name: 'Base Asset', checked: false },
	{ name: 'Quote Asset', checked: false }
];

export const TransactionHistory = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const { data, loading, contentLoading } = useTransactions();
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
				<Accordion data={data} contentLoading={contentLoading} />
			)}
		</Wrapper>
	);
};
