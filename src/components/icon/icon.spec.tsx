import { CSSProperties } from 'react';
import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Icon } from '../../components';
import type { IconType, SizeType } from '../../components';

describe('Icon', () => {
	it.each<[IconType | undefined, SizeType, CSSProperties]>([
		['moon', 'medium', { padding: 12 }],
		['eth', 'large', { marginLeft: 20, border: '1px solid red' }],
		['glmr', 20, { padding: 12 }]
	])('should match snapshot for values icon: %s, size: %s and style: %s', (icon, size, style) => {
		const { getByTestId } = render(
			<AuthProvider>
				<Icon icon={icon} size={size} style={style} />
			</AuthProvider>
		);

		expect(getByTestId('icon')).toMatchSnapshot();
	});

	it('should return null if icon is not defined', () => {
		const { container } = render(
			<AuthProvider>
				<Icon icon={undefined} />
			</AuthProvider>
		);

		expect(container).toBeEmptyDOMElement();
	});
});
