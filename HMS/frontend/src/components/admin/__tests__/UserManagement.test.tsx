import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserManagement from '../UserManagement';
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

describe('UserManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user management component', () => {
    renderWithProviders(<UserManagement />);

    expect(screen.getByText(/user management/i)).toBeInTheDocument();
    expect(screen.getByText(/add user/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search users/i)).toBeInTheDocument();
  });

  it('displays user table with headers', () => {
    renderWithProviders(<UserManagement />);

    expect(screen.getByText(/user/i)).toBeInTheDocument();
    expect(screen.getByText(/role/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/created/i)).toBeInTheDocument();
    expect(screen.getByText(/last login/i)).toBeInTheDocument();
    expect(screen.getByText(/actions/i)).toBeInTheDocument();
  });

  it('displays mock users in the table', () => {
    renderWithProviders(<UserManagement />);

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    expect(screen.getByText(/mike wilson/i)).toBeInTheDocument();
    expect(screen.getByText(/sarah johnson/i)).toBeInTheDocument();
    expect(screen.getByText(/david brown/i)).toBeInTheDocument();
  });

  it('filters users by search term', () => {
    renderWithProviders(<UserManagement />);

    const searchInput = screen.getByPlaceholderText(/search users/i);
    fireEvent.change(searchInput, { target: { value: 'john' } });

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/jane smith/i)).not.toBeInTheDocument();
  });

  it('filters users by role', () => {
    renderWithProviders(<UserManagement />);

    const roleSelect = screen.getByDisplayValue(/all roles/i);
    fireEvent.mouseDown(roleSelect);

    const doctorOption = screen.getByText(/doctor/i);
    fireEvent.click(doctorOption);

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/jane smith/i)).not.toBeInTheDocument();
  });

  it('filters users by status', () => {
    renderWithProviders(<UserManagement />);

    const statusSelect = screen.getByDisplayValue(/all status/i);
    fireEvent.mouseDown(statusSelect);

    const activeOption = screen.getByText(/active/i);
    fireEvent.click(activeOption);

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    expect(screen.queryByText(/mike wilson/i)).not.toBeInTheDocument();
  });

  it('allows selecting individual users', () => {
    renderWithProviders(<UserManagement />);

    const checkboxes = screen.getAllByRole('checkbox');
    const firstUserCheckbox = checkboxes[1]; // First user checkbox (skip select all)

    fireEvent.click(firstUserCheckbox);
    expect(firstUserCheckbox).toBeChecked();
  });

  it('allows selecting all users on current page', () => {
    renderWithProviders(<UserManagement />);

    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);

    const userCheckboxes = screen.getAllByRole('checkbox').slice(1);
    userCheckboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });
  });

  it('shows bulk actions when users are selected', () => {
    renderWithProviders(<UserManagement />);

    const firstUserCheckbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(firstUserCheckbox);

    expect(screen.getByText(/1 user\(s\) selected/i)).toBeInTheDocument();
    expect(screen.getByText(/activate/i)).toBeInTheDocument();
    expect(screen.getByText(/deactivate/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });

  it('shows user actions menu when action button is clicked', () => {
    renderWithProviders(<UserManagement />);

    const actionButtons = screen.getAllByTestId('MoreVertIcon');
    fireEvent.click(actionButtons[0]);

    expect(screen.getByText(/view details/i)).toBeInTheDocument();
    expect(screen.getByText(/edit user/i)).toBeInTheDocument();
    expect(screen.getByText(/activate/i)).toBeInTheDocument();
    expect(screen.getByText(/deactivate/i)).toBeInTheDocument();
    expect(screen.getByText(/suspend/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });

  it('shows delete confirmation dialog', () => {
    renderWithProviders(<UserManagement />);

    const actionButtons = screen.getAllByTestId('MoreVertIcon');
    fireEvent.click(actionButtons[0]);

    const deleteOption = screen.getByText(/delete/i);
    fireEvent.click(deleteOption);

    expect(screen.getByText(/delete user/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
  });

  it('displays user avatars with initials', () => {
    renderWithProviders(<UserManagement />);

    const avatars = screen.getAllByRole('img', { hidden: true });
    expect(avatars.length).toBeGreaterThan(0);
  });

  it('displays user roles as chips', () => {
    renderWithProviders(<UserManagement />);

    expect(screen.getByText(/doctor/i)).toBeInTheDocument();
    expect(screen.getByText(/nurse/i)).toBeInTheDocument();
    expect(screen.getByText(/patient/i)).toBeInTheDocument();
    expect(screen.getByText(/pharmacist/i)).toBeInTheDocument();
    expect(screen.getByText(/lab technician/i)).toBeInTheDocument();
  });

  it('displays user status as chips', () => {
    renderWithProviders(<UserManagement />);

    expect(screen.getByText(/active/i)).toBeInTheDocument();
    expect(screen.getByText(/inactive/i)).toBeInTheDocument();
    expect(screen.getByText(/suspended/i)).toBeInTheDocument();
  });

  it('shows pagination controls', () => {
    renderWithProviders(<UserManagement />);

    expect(screen.getByText(/rows per page/i)).toBeInTheDocument();
  });

  it('resets filters when reset button is clicked', () => {
    renderWithProviders(<UserManagement />);

    const searchInput = screen.getByPlaceholderText(/search users/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const resetButton = screen.getByText(/reset/i);
    fireEvent.click(resetButton);

    expect(searchInput).toHaveValue('');
  });

  it('shows export button', () => {
    renderWithProviders(<UserManagement />);

    expect(screen.getByText(/export/i)).toBeInTheDocument();
  });

  it('handles bulk activate action', () => {
    renderWithProviders(<UserManagement />);

    const firstUserCheckbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(firstUserCheckbox);

    const activateButton = screen.getByText(/activate/i);
    fireEvent.click(activateButton);

    // Should show success message
    expect(screen.getByText(/user status updated to active/i)).toBeInTheDocument();
  });

  it('handles bulk deactivate action', () => {
    renderWithProviders(<UserManagement />);

    const firstUserCheckbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(firstUserCheckbox);

    const deactivateButton = screen.getByText(/deactivate/i);
    fireEvent.click(deactivateButton);

    // Should show success message
    expect(screen.getByText(/user status updated to inactive/i)).toBeInTheDocument();
  });

  it('handles bulk delete action', () => {
    renderWithProviders(<UserManagement />);

    const firstUserCheckbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(firstUserCheckbox);

    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);

    // Should show success message
    expect(screen.getByText(/user deleted successfully/i)).toBeInTheDocument();
  });
}); 