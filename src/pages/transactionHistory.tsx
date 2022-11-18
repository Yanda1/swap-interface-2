import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { TextField, Select, Accordion, Spinner } from '../components';
import { TransactionHeaderSortValue, useStore } from '../helpers';
import _ from 'lodash';
import type { TransactionData, SelectProps } from '../helpers';
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

const selectData: SelectProps[] = [
	{ name: 'Sort by', value: undefined, checked: true },
	{ name: 'Symbol', value: 'symbol', checked: false },
	{ name: 'Date', value: 'timestamp', checked: false },
	{ name: 'Base Asset', value: 'scoin', checked: false },
	{ name: 'Quote Asset', value: 'fcoin', checked: false }
];

export const TransactionHistory = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortValue, setSortValue] = useState('');
	const [dataCopy, setDataCopy] = useState<TransactionData[]>([]);
	const { data, loading, contentLoading } = useTransactions();
	const {
		state: { theme, isUserVerified }
	} = useStore();

	useEffect(() => {
		setDataCopy(
			data.filter((transaction: TransactionData) =>
				transaction.header.symbol.includes(searchTerm.toUpperCase())
			)
		);
	}, [searchTerm]);

	useEffect(() => {
		setDataCopy(data);
	}, [data]);

	useEffect(() => {
		if (sortValue) {
			const sortedData: TransactionData[] = _.orderBy(
				data,
				// @ts-ignore
				(item: TransactionData) => item?.['header']?.[sortValue] as TransactionHeaderSortValue
			);
			setDataCopy(sortedData);
		}
	}, [sortValue]);

	return (
		<Wrapper>
			<Inputs>
				<TextField
					value={searchTerm}
					type="search"
					placeholder="Search"
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Select data={selectData} checkedValue={setSortValue} />
			</Inputs>{' '}
			{!isUserVerified ? (
				<Notifications multiple={false}>
					Make sure that you are logged in to see your Transaction History
				</Notifications>
			) : loading ? (
				<Notifications>
					<Spinner size="medium" color={theme.background.tertiary} />
					Fetching your Transaction History
				</Notifications>
			) : (
				<Accordion data={dataCopy} contentLoading={contentLoading} />
			)}
		</Wrapper>
	);
};
