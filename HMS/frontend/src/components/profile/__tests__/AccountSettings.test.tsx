import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AccountSettings from '../AccountSettings';
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

describe('AccountSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders account settings component', () => {
    renderWithProviders(<AccountSettings />);

    expect(screen.getByText(/notification preferences/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy & security/i)).toBeInTheDocument();
    expect(screen.getByText(/language & timezone/i)).toBeInTheDocument();
    expect(screen.getByText(/account management/i)).toBeInTheDocument();
  });

  it('shows notification settings', () => {
    renderWithProviders(<AccountSettings />);

    expect(screen.getByText(/email notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/sms notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/push notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/appointment reminders/i)).toBeInTheDocument();
    expect(screen.getByText(/medical alerts/i)).toBeInTheDocument();
    expect(screen.getByText(/news & updates/i)).toBeInTheDocument();
  });

  it('shows privacy settings', () => {
    renderWithProviders(<AccountSettings />);

    expect(screen.getByText(/profile visibility/i)).toBeInTheDocument();
    expect(screen.getByText(/data sharing/i)).toBeInTheDocument();
    expect(screen.getByText(/analytics tracking/i)).toBeInTheDocument();
  });

  it('shows language and timezone settings', () => {
    renderWithProviders(<AccountSettings />);

    expect(screen.getByText(/language/i)).toBeInTheDocument();
    expect(screen.getByText(/timezone/i)).toBeInTheDocument();
  });

  it('toggles notification switches', () => {
    renderWithProviders(<AccountSettings />);

    const emailSwitch = screen.getByRole('checkbox', { name: /email notifications/i });
    const smsSwitch = screen.getByRole('checkbox', { name: /sms notifications/i });

    expect(emailSwitch).toBeChecked();
    expect(smsSwitch).not.toBeChecked();

    fireEvent.click(smsSwitch);
    expect(smsSwitch).toBeChecked();
  });

  it('changes profile visibility', () => {
    renderWithProviders(<AccountSettings />);

    const visibilitySelect = screen.getByDisplayValue(/public/i);
    fireEvent.mouseDown(visibilitySelect);

    const privateOption = screen.getByText(/private/i);
    fireEvent.click(privateOption);

    expect(screen.getByDisplayValue(/private/i)).toBeInTheDocument();
  });

  it('changes language setting', () => {
    renderWithProviders(<AccountSettings />);

    const languageSelect = screen.getByDisplayValue(/english/i);
    fireEvent.mouseDown(languageSelect);

    const spanishOption = screen.getByText(/spanish/i);
    fireEvent.click(spanishOption);

    expect(screen.getByDisplayValue(/spanish/i)).toBeInTheDocument();
  });

  it('changes timezone setting', () => {
    renderWithProviders(<AccountSettings />);

    const timezoneSelect = screen.getByDisplayValue(/utc/i);
    fireEvent.mouseDown(timezoneSelect);

    const estOption = screen.getByText(/eastern time/i);
    fireEvent.click(estOption);

    expect(screen.getByDisplayValue(/eastern time/i)).toBeInTheDocument();
  });

  it('shows account status information', () => {
    renderWithProviders(<AccountSettings />);

    expect(screen.getByText(/account status/i)).toBeInTheDocument();
    expect(screen.getByText(/active/i)).toBeInTheDocument();
    expect(screen.getByText(/member since/i)).toBeInTheDocument();
  });

  it('shows delete account button', () => {
    renderWithProviders(<AccountSettings />);

    expect(screen.getByText(/delete account/i)).toBeInTheDocument();
  });

  it('opens delete account dialog when delete button is clicked', () => {
    renderWithProviders(<AccountSettings />);

    const deleteButton = screen.getByText(/delete account/i);
    fireEvent.click(deleteButton);

    expect(screen.getByText(/delete account/i)).toBeInTheDocument();
    expect(screen.getByText(/warning/i)).toBeInTheDocument();
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
  });

  it('requires reason for account deletion', () => {
    renderWithProviders(<AccountSettings />);

    const deleteButton = screen.getByText(/delete account/i);
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getByText(/delete account/i);
    fireEvent.click(confirmDeleteButton);

    expect(screen.getByText(/please provide a reason for account deletion/i)).toBeInTheDocument();
  });

  it('enables delete button when reason is provided', () => {
    renderWithProviders(<AccountSettings />);

    const deleteButton = screen.getByText(/delete account/i);
    fireEvent.click(deleteButton);

    const reasonInput = screen.getByPlaceholderText(/please explain why you want to delete your account/i);
    fireEvent.change(reasonInput, { target: { value: 'Test reason' } });

    const confirmDeleteButton = screen.getByText(/delete account/i);
    expect(confirmDeleteButton).not.toBeDisabled();
  });

  it('closes delete dialog when cancel is clicked', () => {
    renderWithProviders(<AccountSettings />);

    const deleteButton = screen.getByText(/delete account/i);
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(screen.queryByText(/warning/i)).not.toBeInTheDocument();
  });

  it('saves settings when save button is clicked', async () => {
    renderWithProviders(<AccountSettings />);

    const saveButton = screen.getByText(/save settings/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/settings saved successfully/i)).toBeInTheDocument();
    });
  });

  it('shows save button loading state', async () => {
    renderWithProviders(<AccountSettings />);

    const saveButton = screen.getByText(/save settings/i);
    fireEvent.click(saveButton);

    expect(screen.getByText(/saving/i)).toBeInTheDocument();
  });

  it('toggles privacy switches', () => {
    renderWithProviders(<AccountSettings />);

    const dataSharingSwitch = screen.getByRole('checkbox', { name: /data sharing/i });
    const analyticsSwitch = screen.getByRole('checkbox', { name: /analytics tracking/i });

    expect(dataSharingSwitch).toBeChecked();
    expect(analyticsSwitch).toBeChecked();

    fireEvent.click(dataSharingSwitch);
    expect(dataSharingSwitch).not.toBeChecked();
  });

  it('shows notification descriptions', () => {
    renderWithProviders(<AccountSettings />);

    expect(screen.getByText(/receive important updates via email/i)).toBeInTheDocument();
    expect(screen.getByText(/receive urgent alerts via sms/i)).toBeInTheDocument();
    expect(screen.getByText(/receive real-time notifications/i)).toBeInTheDocument();
  });

  it('shows privacy descriptions', () => {
    renderWithProviders(<AccountSettings />);

    expect(screen.getByText(/control who can see your profile information/i)).toBeInTheDocument();
    expect(screen.getByText(/allow data to be used for improving services/i)).toBeInTheDocument();
    expect(screen.getByText(/help improve the system with usage analytics/i)).toBeInTheDocument();
  });
}); 