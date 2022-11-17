import 'jest-styled-components';
import { render } from '@testing-library/react';
import { Arrow } from '../../components';

describe('Arrow', () => {
	it('should render a default button', () => {
		const { getByText } = render(<Arrow open={true} />);

		expect(getByText(/Arrow/)).toMatchSnapshot();
	});
});
