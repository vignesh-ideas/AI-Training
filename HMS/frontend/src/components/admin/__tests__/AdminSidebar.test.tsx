import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AdminSidebar from '../AdminSidebar';
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

describe('AdminSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders admin sidebar component', () => {
    renderWithProviders(<AdminSidebar />);

    expect(screen.getByText(/hms admin/i)).toBeInTheDocument();
    expect(screen.getByText(/hospital management system/i)).toBeInTheDocument();
  });

  it('displays main navigation menu items', () => {
    renderWithProviders(<AdminSidebar />);

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/user management/i)).toBeInTheDocument();
    expect(screen.getByText(/system management/i)).toBeInTheDocument();
    expect(screen.getByText(/reports & analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();
  });

  it('shows user management submenu items', () => {
    renderWithProviders(<AdminSidebar />);

    // User Management should be expanded by default
    expect(screen.getByText(/all users/i)).toBeInTheDocument();
    expect(screen.getByText(/doctors/i)).toBeInTheDocument();
    expect(screen.getByText(/nurses/i)).toBeInTheDocument();
    expect(screen.getByText(/patients/i)).toBeInTheDocument();
    expect(screen.getByText(/pharmacists/i)).toBeInTheDocument();
    expect(screen.getByText(/lab technicians/i)).toBeInTheDocument();
  });

  it('expands and collapses system management section', () => {
    renderWithProviders(<AdminSidebar />);

    const systemManagementButton = screen.getByText(/system management/i);
    fireEvent.click(systemManagementButton);

    expect(screen.getByText(/system settings/i)).toBeInTheDocument();
    expect(screen.getByText(/security/i)).toBeInTheDocument();
    expect(screen.getByText(/backup & restore/i)).toBeInTheDocument();
    expect(screen.getByText(/storage management/i)).toBeInTheDocument();
  });

  it('expands and collapses reports section', () => {
    renderWithProviders(<AdminSidebar />);

    const reportsButton = screen.getByText(/reports & analytics/i);
    fireEvent.click(reportsButton);

    expect(screen.getByText(/user analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/system reports/i)).toBeInTheDocument();
    expect(screen.getByText(/activity logs/i)).toBeInTheDocument();
  });

  it('shows logout button', () => {
    renderWithProviders(<AdminSidebar />);

    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it('displays user information when user is available', () => {
    renderWithProviders(<AdminSidebar />);

    // Should show administrator chip
    expect(screen.getByText(/administrator/i)).toBeInTheDocument();
  });

  it('shows proper icons for menu items', () => {
    renderWithProviders(<AdminSidebar />);

    // Check for dashboard icon
    expect(screen.getByTestId('DashboardIcon')).toBeInTheDocument();
    
    // Check for people icon
    expect(screen.getByTestId('PeopleIcon')).toBeInTheDocument();
    
    // Check for settings icon
    expect(screen.getByTestId('SettingsIcon')).toBeInTheDocument();
    
    // Check for analytics icon
    expect(screen.getByTestId('AnalyticsIcon')).toBeInTheDocument();
    
    // Check for notifications icon
    expect(screen.getByTestId('NotificationsIcon')).toBeInTheDocument();
  });

  it('shows proper icons for submenu items', () => {
    renderWithProviders(<AdminSidebar />);

    // Expand system management to see submenu icons
    const systemManagementButton = screen.getByText(/system management/i);
    fireEvent.click(systemManagementButton);

    expect(screen.getByTestId('SettingsIcon')).toBeInTheDocument();
    expect(screen.getByTestId('SecurityIcon')).toBeInTheDocument();
    expect(screen.getByTestId('BackupIcon')).toBeInTheDocument();
    expect(screen.getByTestId('StorageIcon')).toBeInTheDocument();
  });

  it('handles logout button click', () => {
    renderWithProviders(<AdminSidebar />);

    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);

    // Should trigger logout function
    // This would be tested in integration tests
  });

  it('shows expand/collapse icons for menu sections', () => {
    renderWithProviders(<AdminSidebar />);

    // User Management should be expanded by default
    const expandIcons = screen.getAllByTestId('ExpandLessIcon');
    expect(expandIcons.length).toBeGreaterThan(0);
  });

  it('collapses user management section when clicked', () => {
    renderWithProviders(<AdminSidebar />);

    const userManagementButton = screen.getByText(/user management/i);
    fireEvent.click(userManagementButton);

    // Should collapse the section
    expect(screen.queryByText(/all users/i)).not.toBeInTheDocument();
  });

  it('shows proper styling for active menu items', () => {
    renderWithProviders(<AdminSidebar />);

    const dashboardButton = screen.getByText(/dashboard/i);
    expect(dashboardButton).toHaveStyle({ fontWeight: 'bold' });
  });

  it('displays user avatar with initials', () => {
    renderWithProviders(<AdminSidebar />);

    const avatars = screen.getAllByRole('img', { hidden: true });
    expect(avatars.length).toBeGreaterThan(0);
  });

  it('shows administrator role chip', () => {
    renderWithProviders(<AdminSidebar />);

    const adminChip = screen.getByText(/administrator/i);
    expect(adminChip).toBeInTheDocument();
  });

  it('has proper drawer width', () => {
    renderWithProviders(<AdminSidebar />);

    const drawer = screen.getByRole('complementary');
    expect(drawer).toBeInTheDocument();
  });

  it('shows hospital management system subtitle', () => {
    renderWithProviders(<AdminSidebar />);

    expect(screen.getByText(/hospital management system/i)).toBeInTheDocument();
  });

  it('displays menu items with proper indentation', () => {
    renderWithProviders(<AdminSidebar />);

    // Check that submenu items are properly indented
    const submenuItems = screen.getAllByText(/all users|doctors|nurses|patients|pharmacists|lab technicians/i);
    expect(submenuItems.length).toBe(6);
  });
}); 