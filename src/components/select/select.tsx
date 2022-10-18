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
	spacing
} from '../../styles';
import type { Theme } from '../../styles';
import { isLightTheme, useStore } from '../../helpers';

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

const SelectBox = styled.div`
	border: 1px solid ${(props: StyleProps) => props.theme.background.history};
	// TODO: accessibility with outline
	max-height: 50px;
	display: inline-flex;
	min-width: ${pxToRem(155)};
	cursor: pointer;
	gap: ${spacing[12]};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	padding: ${spacing[14]} ${spacing[20]};
	justify-content: space-between;
	align-items: center;
	transition: ${DEFAULT_TRANSIITON};

	${mediaQuery('s')} {
		width: calc(100% - 42px);
	}

	&:hover,
	&:active {
		border-color: ${(props: StyleProps) => props.theme.font.pure};
		outline: none;
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
	top: ${pxToRem(42)};
	border: ${(props: StyleProps) => (props.open ? '1' : '0')}px solid
		${(props: StyleProps) => props.theme.background.history};
	min-width: ${pxToRem(155)};
	border-radius: ${DEFAULT_BORDER_RADIUS};
	padding: 0;
	z-index: 100;
	background: ${(props: StyleProps) => props.theme.background.default};
	list-style: none;
	overflow: hidden;
	max-height: ${(props: StyleProps) => (props.open ? pxToRem(500) : '0')};
	transition: ${(props: StyleProps) =>
		props.open
			? 'max-height 0.25s ease-in, border 0.25s ease-in'
			: 'max-height 0.15s ease-out, border 0.2s ease-out, margin 0.2s eas-out 0.3s'};

	${mediaQuery('s')} {
		width: calc(100% - 2px);
	}
`;

const ListItem = styled.li`
	padding: ${spacing[8]} ${spacing[20]};
	cursor: pointer;
	transition: ${DEFAULT_TRANSIITON};

	&:hover {
		background: ${(props: StyleProps) => props.theme.background.history};
	}
`;

type Data = {
	name: string;
	value?: string;
	checked?: boolean;
};

type Props = {
	data: Data[];
};

export const Select = ({ data }: Props) => {
	const [items, setItems] = useState(data);
	const [isOpen, setIsOpen] = useState(false);
	const {
		state: { theme }
	} = useStore();
	const lightTheme = isLightTheme(theme);

	const handleClick = (index: number) => {
		if (items.length > 0) {
			const updatedItems = items.map((item: Data, i: number) => {
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
	};

	return (
		<SelectWrapper theme={theme} data-testid="select">
			<SelectBox theme={theme} onClick={() => setIsOpen(!isOpen)}>
				{items.map((item: Data, i: number) => (
					// @ts-ignore
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
			</SelectBox>
			{/* @ts-ignore */}
			<List theme={theme} open={isOpen}>
				{items.map((item: Data, i: number) => (
					<ListItem theme={theme} key={i} onClick={() => handleClick(i)}>
						{item.name}
					</ListItem>
				))}
			</List>
		</SelectWrapper>
	);
};
