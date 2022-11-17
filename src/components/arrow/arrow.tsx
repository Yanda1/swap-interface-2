import styled from 'styled-components';
import { DEFAULT_OUTLINE, DEFAULT_OUTLINE_OFFSET, DEFAULT_TRANSIITON, spacing } from '../../styles';
import type { Theme } from '../../styles';
import arrowDark from '../../assets/arrow-light.png';
import arrowLight from '../../assets/arrow-dark.png';
import { isLightTheme, useStore } from '../../helpers';

type StyleProps = {
	open: boolean;
	theme: Theme;
};

export const ArrowWrapper = styled.button`
	all: unset;
	cursor: pointer;
	padding-left: ${spacing[14]};

	&:hover {
		opacity: 0.8;
	}

	&:focus-visible {
		outline-offset: ${DEFAULT_OUTLINE_OFFSET};
		outline: ${(props: StyleProps) => DEFAULT_OUTLINE(props.theme)};
	}

	&:active {
		outline: none;
	}
`;

export const Icon = styled.img`
	transition: ${DEFAULT_TRANSIITON};
	transform: translate(-50%, -50%) rotate(${(props: StyleProps) => (props.open ? '180' : '0')}deg);
`;

type Props = {
	open: boolean;
	onClick?: () => void;
};

export const Arrow = ({ open, onClick }: Props) => {
	const {
		state: { theme }
	} = useStore();

	return (
		// @ts-ignore
		<ArrowWrapper onClick={onClick} theme={theme}>
			<Icon src={isLightTheme(theme) ? arrowLight : arrowDark} open={open} />
		</ArrowWrapper>
	);
};
