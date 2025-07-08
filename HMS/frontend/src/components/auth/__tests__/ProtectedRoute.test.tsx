import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProvider } from '@/hooks/useAuth';

// Mock the auth service
jest.mock('@/services/authService', () => ({
  authService: {
    getStoredAuthData: jest.fn(),
    validateToken: jest.fn(),
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

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when authenticated', () => {
    // Mock authenticated state
    const mockAuthService = require('@/services/authService').authService;
    mockAuthService.getStoredAuthData.mockReturnValue({
      token: 'mock-token',
      user: { userId: 1, username: 'test', role: 'DOCTOR' }
    });
    mockAuthService.validateToken.mockResolvedValue(true);

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows loading spinner while checking authentication', () => {
    // Mock loading state
    const mockAuthService = require('@/services/authService').authService;
    mockAuthService.getStoredAuthData.mockReturnValue({
      token: 'mock-token',
      user: { userId: 1, username: 'test', role: 'DOCTOR' }
    });
    mockAuthService.validateToken.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    // Mock unauthenticated state
    const mockAuthService = require('@/services/authService').authService;
    mockAuthService.getStoredAuthData.mockReturnValue({
      token: null,
      user: null
    });

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    // Should redirect to login, so protected content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows access denied for insufficient permissions', () => {
    // Mock authenticated but insufficient permissions
    const mockAuthService = require('@/services/authService').authService;
    mockAuthService.getStoredAuthData.mockReturnValue({
      token: 'mock-token',
      user: { userId: 1, username: 'test', role: 'PATIENT' }
    });
    mockAuthService.validateToken.mockResolvedValue(true);

    renderWithProviders(
      <ProtectedRoute requiredRoles={['ADMIN']}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText(/You don't have permission to access this page/)).toBeInTheDocument();
  });
}); 