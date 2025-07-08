import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProfileForm from '../ProfileForm';
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

describe('ProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile form with user information', () => {
    renderWithProviders(<ProfileForm />);

    expect(screen.getByText(/profile management/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/blood type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/emergency contact/i)).toBeInTheDocument();
  });

  it('shows edit button when not in editing mode', () => {
    renderWithProviders(<ProfileForm />);

    expect(screen.getByText(/edit profile/i)).toBeInTheDocument();
    expect(screen.queryByText(/save changes/i)).not.toBeInTheDocument();
  });

  it('enables editing mode when edit button is clicked', () => {
    renderWithProviders(<ProfileForm />);

    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);

    expect(screen.getByText(/save changes/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    renderWithProviders(<ProfileForm />);

    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);

    const saveButton = screen.getByText(/save changes/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/date of birth is required/i)).toBeInTheDocument();
      expect(screen.getByText(/address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/emergency contact is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderWithProviders(<ProfileForm />);

    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('validates phone number format', async () => {
    renderWithProviders(<ProfileForm />);

    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);

    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: 'invalid-phone' } });
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
    });
  });

  it('validates date of birth is not in the future', async () => {
    renderWithProviders(<ProfileForm />);

    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);

    const dateInput = screen.getByLabelText(/date of birth/i);
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    fireEvent.change(dateInput, { target: { value: futureDate.toISOString().split('T')[0] } });
    fireEvent.blur(dateInput);

    await waitFor(() => {
      expect(screen.getByText(/date of birth cannot be in the future/i)).toBeInTheDocument();
    });
  });

  it('validates address minimum length', async () => {
    renderWithProviders(<ProfileForm />);

    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);

    const addressInput = screen.getByLabelText(/address/i);
    fireEvent.change(addressInput, { target: { value: 'Short' } });
    fireEvent.blur(addressInput);

    await waitFor(() => {
      expect(screen.getByText(/address must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('shows blood type options when editing', () => {
    renderWithProviders(<ProfileForm />);

    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);

    const bloodTypeSelect = screen.getByLabelText(/blood type/i);
    fireEvent.mouseDown(bloodTypeSelect);

    expect(screen.getByText(/A\+/i)).toBeInTheDocument();
    expect(screen.getByText(/B\+/i)).toBeInTheDocument();
    expect(screen.getByText(/AB\+/i)).toBeInTheDocument();
    expect(screen.getByText(/O\+/i)).toBeInTheDocument();
  });

  it('cancels editing and resets form', () => {
    renderWithProviders(<ProfileForm />);

    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);

    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'Test Name' } });

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(screen.getByText(/edit profile/i)).toBeInTheDocument();
    expect(screen.queryByText(/save changes/i)).not.toBeInTheDocument();
  });

  it('disables form fields when not in editing mode', () => {
    renderWithProviders(<ProfileForm />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const emailInput = screen.getByLabelText(/email/i);

    expect(firstNameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
  });

  it('enables form fields when in editing mode', () => {
    renderWithProviders(<ProfileForm />);

    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const emailInput = screen.getByLabelText(/email/i);

    expect(firstNameInput).not.toBeDisabled();
    expect(emailInput).not.toBeDisabled();
  });

  it('shows user role chip', () => {
    renderWithProviders(<ProfileForm />);

    expect(screen.getByText(/patient/i)).toBeInTheDocument();
  });

  it('shows user avatar with initials', () => {
    renderWithProviders(<ProfileForm />);

    const avatar = screen.getByRole('img', { hidden: true });
    expect(avatar).toBeInTheDocument();
  });
}); 