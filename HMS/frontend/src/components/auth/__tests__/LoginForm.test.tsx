import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginForm from '../LoginForm';
import { AuthProvider } from '@/hooks/useAuth';

// Mock the auth service
jest.mock('@/services/authService', () => ({
  authService: {
    login: jest.fn(),
    getProfile: jest.fn(),
  },
}));

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          {component}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByText('HMS Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('toggles password visibility', () => {
    renderWithProviders(<LoginForm />);
    
    const passwordField = screen.getByLabelText(/password/i);
    const visibilityButton = screen.getByRole('button', { name: /toggle password visibility/i });
    
    expect(passwordField).toHaveAttribute('type', 'password');
    
    fireEvent.click(visibilityButton);
    expect(passwordField).toHaveAttribute('type', 'text');
    
    fireEvent.click(visibilityButton);
    expect(passwordField).toHaveAttribute('type', 'password');
  });

  it('handles remember me checkbox', () => {
    renderWithProviders(<LoginForm />);
    
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
    expect(rememberMeCheckbox).not.toBeChecked();
    
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).toBeChecked();
  });

  it('calls onSwitchToRegister when sign up link is clicked', () => {
    const mockOnSwitchToRegister = jest.fn();
    renderWithProviders(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);
    
    const signUpLink = screen.getByText(/sign up/i);
    fireEvent.click(signUpLink);
    
    expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1);
  });
}); 