import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';
import AppointmentStatusUpdate from '../AppointmentStatusUpdate';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('AppointmentStatusUpdate', () => {
  const mockAppointment = {
    id: '1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    department: 'Cardiology',
    date: '2024-02-15',
    time: '10:00 AM',
    type: 'CONSULTATION',
    status: 'SCHEDULED',
    reason: 'Annual physical examination',
  };

  const mockOnUpdate = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the status update dialog', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Update Appointment Status')).toBeInTheDocument();
  });

  it('displays appointment details', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Appointment Details')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
  });

  it('displays current status', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Current Status')).toBeInTheDocument();
    expect(screen.getByText('SCHEDULED')).toBeInTheDocument();
  });

  it('displays status options', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const statusSelect = screen.getByLabelText('New Status');
    fireEvent.mouseDown(statusSelect);

    waitFor(() => {
      expect(screen.getByText('Scheduled')).toBeInTheDocument();
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Cancelled')).toBeInTheDocument();
      expect(screen.getByText('No Show')).toBeInTheDocument();
    });
  });

  it('handles status selection', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const statusSelect = screen.getByLabelText('New Status');
    fireEvent.mouseDown(statusSelect);

    waitFor(() => {
      const confirmedOption = screen.getByText('Confirmed');
      fireEvent.click(confirmedOption);
    });
  });

  it('displays notes field', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByLabelText('Notes (Optional)')).toBeInTheDocument();
  });

  it('handles notes input', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const notesInput = screen.getByLabelText('Notes (Optional)');
    fireEvent.change(notesInput, { target: { value: 'Patient confirmed attendance' } });
  });

  it('displays status guidelines', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Status Guidelines')).toBeInTheDocument();
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getByText('No Show')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Select a new status
    const statusSelect = screen.getByLabelText('New Status');
    fireEvent.mouseDown(statusSelect);

    waitFor(() => {
      const confirmedOption = screen.getByText('Confirmed');
      fireEvent.click(confirmedOption);
    });

    // Add notes
    const notesInput = screen.getByLabelText('Notes (Optional)');
    fireEvent.change(notesInput, { target: { value: 'Patient confirmed' } });

    // Submit
    const updateButton = screen.getByText('Update Status');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith('1', 'CONFIRMED', 'Patient confirmed');
    });
  });

  it('disables update button when no status is selected', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const updateButton = screen.getByText('Update Status');
    expect(updateButton).toBeDisabled();
  });

  it('disables update button when same status is selected', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const statusSelect = screen.getByLabelText('New Status');
    fireEvent.mouseDown(statusSelect);

    waitFor(() => {
      const scheduledOption = screen.getByText('Scheduled');
      fireEvent.click(scheduledOption);
    });

    const updateButton = screen.getByText('Update Status');
    expect(updateButton).toBeDisabled();
  });

  it('handles close button', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        loading={true}
      />
    );

    expect(screen.getByText('Updating...')).toBeInTheDocument();
  });

  it('disables buttons when loading', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        loading={true}
      />
    );

    const updateButton = screen.getByText('Updating...');
    expect(updateButton).toBeDisabled();
  });

  it('shows confirmation alert when status changes', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const statusSelect = screen.getByLabelText('New Status');
    fireEvent.mouseDown(statusSelect);

    waitFor(() => {
      const confirmedOption = screen.getByText('Confirmed');
      fireEvent.click(confirmedOption);
    });

    expect(screen.getByText(/You are about to change the status/)).toBeInTheDocument();
  });

  it('handles error state', async () => {
    const mockOnUpdateWithError = jest.fn().mockRejectedValue(new Error('Update failed'));

    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdateWithError}
      />
    );

    // Select a new status
    const statusSelect = screen.getByLabelText('New Status');
    fireEvent.mouseDown(statusSelect);

    waitFor(() => {
      const confirmedOption = screen.getByText('Confirmed');
      fireEvent.click(confirmedOption);
    });

    // Submit
    const updateButton = screen.getByText('Update Status');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to update appointment status')).toBeInTheDocument();
    });
  });

  it('displays appointment date and time', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
  });

  it('displays appointment reason', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Reason')).toBeInTheDocument();
    expect(screen.getByText('Annual physical examination')).toBeInTheDocument();
  });

  it('handles null appointment', () => {
    renderWithProviders(
      <AppointmentStatusUpdate
        appointment={null}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Update Appointment Status')).toBeInTheDocument();
  });

  it('resets form when dialog closes', () => {
    const { rerender } = renderWithProviders(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Select a status
    const statusSelect = screen.getByLabelText('New Status');
    fireEvent.mouseDown(statusSelect);

    waitFor(() => {
      const confirmedOption = screen.getByText('Confirmed');
      fireEvent.click(confirmedOption);
    });

    // Close dialog
    rerender(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={false}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Reopen dialog
    rerender(
      <AppointmentStatusUpdate
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    // Form should be reset
    const statusSelectAfterReset = screen.getByLabelText('New Status');
    expect(statusSelectAfterReset).toHaveValue('');
  });
}); 