import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PasswordChangeForm from '../PasswordChangeForm';
import { AuthProvider } from '@/hooks/useAuth';

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('PasswordChangeForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders password change form', () => {
    renderWithProviders(<PasswordChangeForm />);

    expect(screen.getByText(/change password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    expect(screen.getByText(/change password/i)).toBeInTheDocument();
    expect(screen.getByText(/reset/i)).toBeInTheDocument();
  });

  it('shows password requirements', () => {
    renderWithProviders(<PasswordChangeForm />);

    expect(screen.getByText(/password requirements/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 8 characters long/i)).toBeInTheDocument();
    expect(screen.getByText(/contains at least one uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/contains at least one lowercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/contains at least one number/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    renderWithProviders(<PasswordChangeForm />);

    const submitButton = screen.getByText(/change password/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/current password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your new password/i)).toBeInTheDocument();
    });
  });

  it('validates new password strength', async () => {
    renderWithProviders(<PasswordChangeForm />);

    const newPasswordInput = screen.getByLabelText(/new password/i);
    
    // Test weak password
    fireEvent.change(newPasswordInput, { target: { value: 'weak' } });
    await waitFor(() => {
      expect(screen.getByText(/password strength: weak/i)).toBeInTheDocument();
    });

    // Test strong password
    fireEvent.change(newPasswordInput, { target: { value: 'StrongPass123' } });
    await waitFor(() => {
      expect(screen.getByText(/password strength: strong/i)).toBeInTheDocument();
    });
  });

  it('validates password confirmation', async () => {
    renderWithProviders(<PasswordChangeForm />);

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    fireEvent.change(newPasswordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123' } });
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    });
  });

  it('validates new password requirements', async () => {
    renderWithProviders(<PasswordChangeForm />);

    const newPasswordInput = screen.getByLabelText(/new password/i);
    
    // Test password without uppercase
    fireEvent.change(newPasswordInput, { target: { value: 'password123' } });
    fireEvent.blur(newPasswordInput);

    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
    });

    // Test password without lowercase
    fireEvent.change(newPasswordInput, { target: { value: 'PASSWORD123' } });
    fireEvent.blur(newPasswordInput);

    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one lowercase letter/i)).toBeInTheDocument();
    });

    // Test password without number
    fireEvent.change(newPasswordInput, { target: { value: 'PasswordABC' } });
    fireEvent.blur(newPasswordInput);

    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one number/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility', () => {
    renderWithProviders(<PasswordChangeForm />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    expect(currentPasswordInput).toHaveAttribute('type', 'password');
    expect(newPasswordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    const visibilityButtons = screen.getAllByTestId('VisibilityIcon');
    
    // Toggle current password visibility
    fireEvent.click(visibilityButtons[0]);
    expect(currentPasswordInput).toHaveAttribute('type', 'text');
    fireEvent.click(visibilityButtons[0]);
    expect(currentPasswordInput).toHaveAttribute('type', 'password');

    // Toggle new password visibility
    fireEvent.click(visibilityButtons[1]);
    expect(newPasswordInput).toHaveAttribute('type', 'text');
    fireEvent.click(visibilityButtons[1]);
    expect(newPasswordInput).toHaveAttribute('type', 'password');

    // Toggle confirm password visibility
    fireEvent.click(visibilityButtons[2]);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    fireEvent.click(visibilityButtons[2]);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('resets form when reset button is clicked', () => {
    renderWithProviders(<PasswordChangeForm />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    fireEvent.change(currentPasswordInput, { target: { value: 'oldpass' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpass' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass' } });

    const resetButton = screen.getByText(/reset/i);
    fireEvent.click(resetButton);

    expect(currentPasswordInput).toHaveValue('');
    expect(newPasswordInput).toHaveValue('');
    expect(confirmPasswordInput).toHaveValue('');
  });

  it('shows password strength progress bar', () => {
    renderWithProviders(<PasswordChangeForm />);

    const newPasswordInput = screen.getByLabelText(/new password/i);
    fireEvent.change(newPasswordInput, { target: { value: 'Password123' } });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('disables submit button when form is invalid', () => {
    renderWithProviders(<PasswordChangeForm />);

    const submitButton = screen.getByText(/change password/i);
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when form is valid', () => {
    renderWithProviders(<PasswordChangeForm />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    fireEvent.change(currentPasswordInput, { target: { value: 'OldPass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'NewPass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'NewPass123' } });

    const submitButton = screen.getByText(/change password/i);
    expect(submitButton).not.toBeDisabled();
  });
}); 