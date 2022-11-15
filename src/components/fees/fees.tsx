import styled, { css } from 'styled-components';
import { useFees } from '../../hooks';
import {
	DEFAULT_BORDER_RADIUS,
	spacing,
	DEFAULT_OUTLINE,
	DEFAULT_OUTLINE_OFFSET
} from '../../styles';
import type { ThemeProps } from '../../styles';
import { beautifyNumbers, isArrayType, useStore } from '../../helpers';
import type { Fee } from '../../helpers';

const Summary = styled.summary(
	({ theme }: ThemeProps) => css`
		color: ${theme.font.secondary};
		margin-top: ${spacing[28]};
		cursor: pointer;

		&:focus-visible {
			outline-offset: ${DEFAULT_OUTLINE_OFFSET};
			outline: ${DEFAULT_OUTLINE(theme)};
		}

		&:active {
			outline: none;
		}
	`
);

const Details = styled.div(
	({ color }: { color: string }) => css`
		flex-direction: column;
		padding: ${spacing[10]} ${spacing[16]};
		margin: ${spacing[28]} 0 ${spacing[56]};
		border-radius: ${DEFAULT_BORDER_RADIUS};
		border: 1px solid ${color};

		& > * {
			display: flex;
			justify-content: space-between;
		}
	`
);

const DetailWrapper = styled.div`
	& > * {
		padding: ${spacing[4]} 0;
	}
`;

type Props = {
	value: Fee | Fee[];
};

const Detail = ({ value }: Props) => {
	const data = isArrayType(value) ? (value as Fee[]) : ([value] as Fee[]);

	return !data[0].name ? (
		<>{data[0].amount} USDT</>
	) : (
		<DetailWrapper>
			<div>{data[0]?.name} Fee</div>
			<div>
				{data.map((fee: Fee) => (
					<div style={{ textAlign: 'right' }}>
						{fee.amount > 0 ? `${beautifyNumbers({ n: fee.amount })} ${fee.currency}` : '-'}
					</div>
				))}
			</div>
		</DetailWrapper>
	);
};

export const Fees = () => {
	const {
		state: { theme }
	} = useStore();
	const { withdrawFee, protocolFee, networkFee, cexFee, allFees } = useFees();

	return (
		<details>
			<Summary color={theme.font.default} theme={theme}>
				<Detail value={allFees} />
			</Summary>
			<Details color={theme.border.default}>
				<Detail value={networkFee} />
				<Detail value={protocolFee} />
				<Detail value={cexFee} />
				<Detail value={withdrawFee} />
			</Details>
		</details>
	);
};
