import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import EmailVerification from '../EmailVerification';

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('EmailVerification', () => {
  const mockOnVerificationComplete = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email verification form', () => {
    renderWithProviders(
      <EmailVerification
        email="test@example.com"
        onVerificationComplete={mockOnVerificationComplete}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText(/verify your email/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/verification code/i)).toBeInTheDocument();
    expect(screen.getByText(/verify email/i)).toBeInTheDocument();
  });

  it('shows stepper with correct steps', () => {
    renderWithProviders(
      <EmailVerification
        email="test@example.com"
        onVerificationComplete={mockOnVerificationComplete}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByText(/verify email/i)).toBeInTheDocument();
    expect(screen.getByText(/complete/i)).toBeInTheDocument();
  });

  it('shows error for empty verification code', async () => {
    renderWithProviders(
      <EmailVerification
        email="test@example.com"
        onVerificationComplete={mockOnVerificationComplete}
        onBack={mockOnBack}
      />
    );

    const verifyButton = screen.getByText(/verify email/i);
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter the verification code/i)).toBeInTheDocument();
    });
  });

  it('handles verification code submission', async () => {
    renderWithProviders(
      <EmailVerification
        email="test@example.com"
        onVerificationComplete={mockOnVerificationComplete}
        onBack={mockOnBack}
      />
    );

    const codeInput = screen.getByLabelText(/verification code/i);
    const verifyButton = screen.getByText(/verify email/i);

    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(mockOnVerificationComplete).toHaveBeenCalled();
    });
  });

  it('handles back button click', () => {
    renderWithProviders(
      <EmailVerification
        email="test@example.com"
        onVerificationComplete={mockOnVerificationComplete}
        onBack={mockOnBack}
      />
    );

    const backButton = screen.getByText(/back to registration/i);
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('shows countdown timer for resend', async () => {
    renderWithProviders(
      <EmailVerification
        email="test@example.com"
        onVerificationComplete={mockOnVerificationComplete}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText(/resend available in 60s/i)).toBeInTheDocument();

    // Wait for timer to countdown
    await waitFor(() => {
      expect(screen.getByText(/resend code/i)).toBeInTheDocument();
    }, { timeout: 70000 });
  });

  it('handles resend code functionality', async () => {
    renderWithProviders(
      <EmailVerification
        email="test@example.com"
        onVerificationComplete={mockOnVerificationComplete}
        onBack={mockOnBack}
      />
    );

    // Wait for resend to be available
    await waitFor(() => {
      expect(screen.getByText(/resend code/i)).toBeInTheDocument();
    }, { timeout: 70000 });

    const resendButton = screen.getByText(/resend code/i);
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(screen.getByText(/resend available in 60s/i)).toBeInTheDocument();
    });
  });

  it('limits verification code input to 6 characters', () => {
    renderWithProviders(
      <EmailVerification
        email="test@example.com"
        onVerificationComplete={mockOnVerificationComplete}
        onBack={mockOnBack}
      />
    );

    const codeInput = screen.getByLabelText(/verification code/i);
    fireEvent.change(codeInput, { target: { value: '123456789' } });

    expect(codeInput).toHaveValue('123456');
  });

  it('shows loading state during verification', async () => {
    renderWithProviders(
      <EmailVerification
        email="test@example.com"
        onVerificationComplete={mockOnVerificationComplete}
        onBack={mockOnBack}
      />
    );

    const codeInput = screen.getByLabelText(/verification code/i);
    const verifyButton = screen.getByText(/verify email/i);

    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);

    // Button should show loading state
    expect(verifyButton).toBeDisabled();
  });

  it('shows loading state during resend', async () => {
    renderWithProviders(
      <EmailVerification
        email="test@example.com"
        onVerificationComplete={mockOnVerificationComplete}
        onBack={mockOnBack}
      />
    );

    // Wait for resend to be available
    await waitFor(() => {
      expect(screen.getByText(/resend code/i)).toBeInTheDocument();
    }, { timeout: 70000 });

    const resendButton = screen.getByText(/resend code/i);
    fireEvent.click(resendButton);

    // Button should be disabled during resend
    expect(resendButton).toBeDisabled();
  });
}); 