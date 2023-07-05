import { renderWithTheme } from '@/testUtils';
import Home from '@/app/page';

describe('<Home />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<Home />);
    expect(container).toBeInTheDocument();
  });
});
