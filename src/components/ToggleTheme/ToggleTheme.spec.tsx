import { fireEvent, screen } from '@testing-library/react';
import { ToggleTheme } from '@/components/ToggleTheme/index';
import { renderWithTheme } from '@/testUtils';

describe('ToggleTheme', () => {
  it('should render toggle theme and changing the theme', () => {
    renderWithTheme(<ToggleTheme />);

    const buttonIconLight = screen.getByTestId('icon-light');
    expect(buttonIconLight).toBeInTheDocument();

    fireEvent.click(buttonIconLight);

    const buttonIconDark = screen.getByTestId('icon-dark');
    expect(buttonIconDark).toBeInTheDocument();
  });
});
