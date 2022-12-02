import 'jest-styled-components';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../helpers';
import { Portal } from '../../components';
import type { PortalSizeProps } from '../../components';

describe('Switch', () => {
	it.each<[PortalSizeProps]>([['small'], ['large']])(
		'should match snapshort for a %s sized portal',
		(size) => {
			const { getByText } = render(
				<AuthProvider>
					<Portal size={size} isOpen={true} handleClose={() => console.log('close portal')}>
						portal
					</Portal>
				</AuthProvider>
			);

			expect(getByText('portal')).toMatchSnapshot();
		}
	);
});
