import styled, { css } from 'styled-components';
import { useFees } from '../../hooks';
import { defaultBorderRadius, spacing } from '../../styles';
import type { Theme } from '../../styles';
import { Fee, useStore } from '../../helpers';

const Summary = styled.summary(
	({ color, theme }: { color: string; theme: Theme }) => css`
		color: ${theme.font.pure};
		margin-top: ${spacing[28]};
		cursor: pointer;

		&:focus-visible {
			outline-offset: 2px;
			outline: 1px solid ${color};
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
		border-radius: ${defaultBorderRadius};
		border: 1px solid ${color};

		& > * {
			display: flex;
			justify-content: space-between;
		}
	`
);

export const Fees = () => {
	const {
		state: { theme }
	} = useStore();
	const { withdrawFee, protocolFee, networkFee, cexFee, allFees } = useFees();

	return (
		<details>
			<Summary color={theme.font.default} theme={theme}>
				Fee: {allFees.amount.toFixed(4)} {allFees.currency}
			</Summary>
			<Details color={theme.font.default}>
				<div>
					<p>Network fee:</p>
					<p>
						{networkFee.amount} {networkFee.currency}
					</p>
				</div>
				<div>
					<p>Protocol fee:</p>
					<p>
						{protocolFee.amount} {protocolFee.currency}
					</p>
				</div>
				<div>
					<p>CEX fee:</p>
					<div>
						{cexFee.map((fee: Fee) => (
							<p style={{ textAlign: 'right' }} key={fee.currency}>
								{fee.amount} {fee.currency}
							</p>
						))}
					</div>
				</div>
				<div>
					<p>Withdrawal fee:</p>
					<p>
						{withdrawFee.amount} {withdrawFee.currency}
					</p>
				</div>
			</Details>
		</details>
	);
};
