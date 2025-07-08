import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RegisterForm from '../RegisterForm';
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

describe('RegisterForm', () => {
  beforeEach(() => {
    // Mock the auth service
    jest.clearAllMocks();
  });

  it('renders registration form with all fields', () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    renderWithProviders(<RegisterForm />);

    const submitButton = screen.getByText(/create account/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderWithProviders(<RegisterForm />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('validates password strength', async () => {
    renderWithProviders(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    
    // Test weak password
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    await waitFor(() => {
      expect(screen.getByText(/password strength: weak/i)).toBeInTheDocument();
    });

    // Test strong password
    fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });
    await waitFor(() => {
      expect(screen.getByText(/password strength: strong/i)).toBeInTheDocument();
    });
  });

  it('validates password confirmation', async () => {
    renderWithProviders(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    });
  });

  it('validates username format', async () => {
    renderWithProviders(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'user@name' } });
    fireEvent.blur(usernameInput);

    await waitFor(() => {
      expect(screen.getByText(/username can only contain letters, numbers, and underscores/i)).toBeInTheDocument();
    });
  });

  it('validates phone number format', async () => {
    renderWithProviders(<RegisterForm />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: 'invalid-phone' } });
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
    });
  });

  it('shows role descriptions when role is selected', async () => {
    renderWithProviders(<RegisterForm />);

    const roleSelect = screen.getByLabelText(/role/i);
    fireEvent.mouseDown(roleSelect);

    const doctorOption = screen.getByText(/doctor/i);
    fireEvent.click(doctorOption);

    await waitFor(() => {
      expect(screen.getByText(/medical professionals who diagnose and treat patients/i)).toBeInTheDocument();
    });
  });

  it('requires terms and conditions acceptance', async () => {
    renderWithProviders(<RegisterForm />);

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1234567890' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123' } });

    const submitButton = screen.getByText(/create account/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/you must accept the terms and conditions/i)).toBeInTheDocument();
    });
  });

  it('shows terms and conditions dialog when link is clicked', async () => {
    renderWithProviders(<RegisterForm />);

    const termsLink = screen.getByText(/terms and conditions/i);
    fireEvent.click(termsLink);

    await waitFor(() => {
      expect(screen.getByText(/terms and conditions/i)).toBeInTheDocument();
      expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility', () => {
    renderWithProviders(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const visibilityButton = screen.getByTestId('VisibilityIcon');

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(visibilityButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(visibilityButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('toggles confirm password visibility', () => {
    renderWithProviders(<RegisterForm />);

    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const visibilityButtons = screen.getAllByTestId('VisibilityIcon');

    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    fireEvent.click(visibilityButtons[1]); // Second visibility button
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    fireEvent.click(visibilityButtons[1]);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('shows stepper with registration steps', () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByText(/verify email/i)).toBeInTheDocument();
    expect(screen.getByText(/complete/i)).toBeInTheDocument();
  });

  it('shows switch to login link when onSwitchToLogin is provided', () => {
    const mockSwitchToLogin = jest.fn();
    renderWithProviders(<RegisterForm onSwitchToLogin={mockSwitchToLogin} />);

    const signInLink = screen.getByText(/sign in/i);
    expect(signInLink).toBeInTheDocument();

    fireEvent.click(signInLink);
    expect(mockSwitchToLogin).toHaveBeenCalled();
  });
}); 