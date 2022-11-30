import { useState } from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as ArrowFullDark } from '../../assets/arrow-full-dark.svg';
import { ReactComponent as ArrowFullLight } from '../../assets/arrow-full-light.svg';
import {
	DEFAULT_BORDER_RADIUS,
	DEFAULT_TRANSIITON,
	fontSize,
	mediaQuery,
	pxToRem,
	spacing,
	DEFAULT_OUTLINE,
	DEFAULT_OUTLINE_OFFSET
} from '../../styles';
import type { Theme } from '../../styles';
import { isLightTheme, TransactionHeaderSortValue, useStore } from '../../helpers';
import type { SelectProps } from '../../helpers';

type StyleProps = {
	theme: Theme;
	open?: boolean;
};

const SelectWrapper = styled.div`
	position: relative;
	font-size: ${fontSize[16]};
	color: ${(props: StyleProps) => props.theme.font.select};
	line-height: ${fontSize[20]};
`;

const SelectButton = styled.button`
	all: unset;
	border: 1px solid ${(props: StyleProps) => props.theme.border.default};
	max-height: ${pxToRem(50)};
	box-sizing: border-box;
	display: inline-flex;
	min-width: ${pxToRem(175)};
	cursor: pointer;
	gap: ${spacing[12]};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	padding: ${spacing[14]} ${spacing[20]};
	justify-content: space-between;
	align-items: center;
	transition: ${DEFAULT_TRANSIITON};

	${mediaQuery('s')} {
		width: 100%;
	}

	&:hover,
	&:active {
		border-color: ${(props: StyleProps) => props.theme.font.secondary};
	}

	&:focus-visible {
		outline-offset: ${DEFAULT_OUTLINE_OFFSET};
		outline: ${(props: StyleProps) => DEFAULT_OUTLINE(props.theme)};
	}
`;

const SelectedItem = styled.div(
	({ checked }: { checked: boolean }) => css`
		display: ${checked ? 'flex' : 'none'};

		input[type='checkbox'] {
			display: none;
		}
	`
);

const RadioButton = styled.input`
	margin: 0;
`;

const Label = styled.p`
	margin: 0;
`;

const List = styled.ul`
	position: absolute;
	z-index: 100;
	top: ${pxToRem(42)};
	right: 0;
	border: ${(props: StyleProps) => (props.open ? '1' : '0')}px solid
		${(props: StyleProps) => props.theme.background.tertiary};
	min-width: calc(${pxToRem(175)} - 0.125rem);
	border-radius: ${DEFAULT_BORDER_RADIUS};
	padding: 0;
	text-align: right;
	width: calc(100% - 0.125rem);
	background: ${(props: StyleProps) => props.theme.background.default};
	list-style: none;
	overflow: hidden;
	max-height: ${(props: StyleProps) => (props.open ? pxToRem(500) : '0')};
	transition: ${(props: StyleProps) =>
		props.open
			? 'max-height 0.25s ease-in, border 0.25s ease-in'
			: 'max-height 0.15s ease-out, border 0.2s ease-out, margin 0.2s eas-out 0.3s'};
`;

const ListItem = styled.li`
	padding: ${spacing[8]} ${spacing[20]};
	cursor: pointer;
	transition: ${DEFAULT_TRANSIITON};

	&:hover,
	&:focus {
		background: ${(props: StyleProps) => props.theme.background.tertiary};
		outline: none;
	}
`;

type Props = {
	data: SelectProps[];
	checkedValue: any;
};

export const Select = ({ data, checkedValue }: Props) => {
	const [items, setItems] = useState<SelectProps[]>(data);
	const [isOpen, setIsOpen] = useState(false);
	const {
		state: { theme }
	} = useStore();
	const lightTheme = isLightTheme(theme);
	const handleClick = (value: TransactionHeaderSortValue, index: number) => {
		if (items.length > 0) {
			const updatedItems = items.map((item: SelectProps, i: number): SelectProps => {
				if (i === index) {
					item.checked = true;
				} else {
					item.checked = false;
				}

				return item;
			});
			setItems(updatedItems);
		}
		setIsOpen(!isOpen);
		checkedValue(value as string);
	};

	const handleKeyDown = (e: any, item: TransactionHeaderSortValue, ind: number) => {
		if (e.key === 'Enter') {
			handleClick(item, ind);
		}
	};

	return (
		<SelectWrapper theme={theme} data-testid="select">
			<SelectButton theme={theme} onClick={() => setIsOpen(!isOpen)}>
				{items.map((item: SelectProps, i: number) => (
					<SelectedItem checked={item.checked} key={i}>
						<RadioButton
							type="checkbox"
							value={item.name}
							checked={item.checked}
							onChange={() => console.log('change')}
						/>
						<Label>{item.name}</Label>
					</SelectedItem>
				))}
				{lightTheme ? (
					<ArrowFullDark
						style={{ transform: `rotate(${isOpen ? 180 : 0}deg)`, transition: DEFAULT_TRANSIITON }}
					/>
				) : (
					<ArrowFullLight
						style={{ transform: `rotate(${isOpen ? 180 : 0}deg)`, transition: DEFAULT_TRANSIITON }}
					/>
				)}
			</SelectButton>
			{/* @ts-ignore */}
			<List theme={theme} open={isOpen}>
				{items.map((item: SelectProps, i: number) => (
					// @ts-ignore
					<ListItem
						theme={theme}
						key={i}
						onClick={() => handleClick(item.value, i)}
						onKeyDown={(e) => handleKeyDown(e, item.value, i)}
						// @ts-ignore
						tabIndex="1">
						{item.name}
					</ListItem>
				))}
			</List>
		</SelectWrapper>
	);
};
