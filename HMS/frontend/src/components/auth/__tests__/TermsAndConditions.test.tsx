import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TermsAndConditions from '../TermsAndConditions';

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('TermsAndConditions', () => {
  const mockOnAccept = jest.fn();
  const mockOnDecline = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders terms and conditions dialog when open', () => {
    renderWithProviders(
      <TermsAndConditions
        open={true}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    expect(screen.getByText(/terms and conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
    expect(screen.getByText(/accept & continue/i)).toBeInTheDocument();
    expect(screen.getByText(/decline/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(
      <TermsAndConditions
        open={false}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    expect(screen.queryByText(/terms and conditions/i)).not.toBeInTheDocument();
  });

  it('shows all terms and conditions items', () => {
    renderWithProviders(
      <TermsAndConditions
        open={true}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    expect(screen.getByText(/you agree to provide accurate and complete information/i)).toBeInTheDocument();
    expect(screen.getByText(/you are responsible for maintaining the confidentiality/i)).toBeInTheDocument();
    expect(screen.getByText(/you agree to use the hms system only for legitimate healthcare purposes/i)).toBeInTheDocument();
    expect(screen.getByText(/you understand that your personal health information will be protected/i)).toBeInTheDocument();
    expect(screen.getByText(/you consent to receive important notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/you agree to comply with all applicable laws/i)).toBeInTheDocument();
    expect(screen.getByText(/you understand that the hospital may suspend/i)).toBeInTheDocument();
    expect(screen.getByText(/you consent to the collection and processing/i)).toBeInTheDocument();
  });

  it('shows privacy policy items', () => {
    renderWithProviders(
      <TermsAndConditions
        open={true}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    expect(screen.getByText(/secure storage of your personal and health information/i)).toBeInTheDocument();
    expect(screen.getByText(/hipaa-compliant data protection measures/i)).toBeInTheDocument();
    expect(screen.getByText(/limited access to authorized healthcare professionals only/i)).toBeInTheDocument();
    expect(screen.getByText(/regular security audits and updates/i)).toBeInTheDocument();
  });

  it('requires checkbox to be checked before accepting', () => {
    renderWithProviders(
      <TermsAndConditions
        open={true}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    const acceptButton = screen.getByText(/accept & continue/i);
    expect(acceptButton).toBeDisabled();

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(acceptButton).not.toBeDisabled();
  });

  it('calls onAccept when accept button is clicked with checkbox checked', () => {
    renderWithProviders(
      <TermsAndConditions
        open={true}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    const acceptButton = screen.getByText(/accept & continue/i);

    fireEvent.click(checkbox);
    fireEvent.click(acceptButton);

    expect(mockOnAccept).toHaveBeenCalled();
  });

  it('calls onDecline when decline button is clicked', () => {
    renderWithProviders(
      <TermsAndConditions
        open={true}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    const declineButton = screen.getByText(/decline/i);
    fireEvent.click(declineButton);

    expect(mockOnDecline).toHaveBeenCalled();
  });

  it('does not call onAccept when checkbox is unchecked', () => {
    renderWithProviders(
      <TermsAndConditions
        open={true}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    const acceptButton = screen.getByText(/accept & continue/i);
    fireEvent.click(acceptButton);

    expect(mockOnAccept).not.toHaveBeenCalled();
  });

  it('shows checkbox label with terms and conditions text', () => {
    renderWithProviders(
      <TermsAndConditions
        open={true}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    expect(screen.getByText(/i have read and agree to the terms and conditions and privacy policy/i)).toBeInTheDocument();
  });

  it('handles checkbox state changes correctly', () => {
    renderWithProviders(
      <TermsAndConditions
        open={true}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    const acceptButton = screen.getByText(/accept & continue/i);

    // Initially unchecked and button disabled
    expect(checkbox).not.toBeChecked();
    expect(acceptButton).toBeDisabled();

    // Check the checkbox
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(acceptButton).not.toBeDisabled();

    // Uncheck the checkbox
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(acceptButton).toBeDisabled();
  });
}); 