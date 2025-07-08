import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';
import AppointmentCancellation from '../AppointmentCancellation';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('AppointmentCancellation', () => {
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

  const mockOnCancel = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the cancellation dialog', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Cancel Appointment')).toBeInTheDocument();
  });

  it('displays warning alert', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Cancellation Warning')).toBeInTheDocument();
    expect(screen.getByText(/Cancelling this appointment will free up the time slot/)).toBeInTheDocument();
  });

  it('displays appointment details', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Appointment Details')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
  });

  it('displays cancellation reason options', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    const reasonSelect = screen.getByLabelText('Reason for Cancellation');
    fireEvent.mouseDown(reasonSelect);

    waitFor(() => {
      expect(screen.getByText('Patient Request')).toBeInTheDocument();
      expect(screen.getByText('Doctor Unavailable')).toBeInTheDocument();
      expect(screen.getByText('Emergency')).toBeInTheDocument();
      expect(screen.getByText('Weather Conditions')).toBeInTheDocument();
      expect(screen.getByText('Technical Issue')).toBeInTheDocument();
      expect(screen.getByText('Rescheduled')).toBeInTheDocument();
      expect(screen.getByText('No Show')).toBeInTheDocument();
      expect(screen.getByText('Other (Custom)')).toBeInTheDocument();
    });
  });

  it('handles reason selection', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    const reasonSelect = screen.getByLabelText('Reason for Cancellation');
    fireEvent.mouseDown(reasonSelect);

    waitFor(() => {
      const patientRequestOption = screen.getByText('Patient Request');
      fireEvent.click(patientRequestOption);
    });
  });

  it('shows custom reason input when custom is selected', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    const reasonSelect = screen.getByLabelText('Reason for Cancellation');
    fireEvent.mouseDown(reasonSelect);

    waitFor(() => {
      const customOption = screen.getByText('Other (Custom)');
      fireEvent.click(customOption);
    });

    expect(screen.getByLabelText('Custom Reason')).toBeInTheDocument();
  });

  it('displays notes field', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Additional Notes (Optional)')).toBeInTheDocument();
  });

  it('handles notes input', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    const notesInput = screen.getByLabelText('Additional Notes (Optional)');
    fireEvent.change(notesInput, { target: { value: 'Patient requested cancellation' } });
  });

  it('displays cancellation impact information', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Cancellation Impact')).toBeInTheDocument();
    expect(screen.getByText('Time Slot')).toBeInTheDocument();
    expect(screen.getByText('Patient Notification')).toBeInTheDocument();
    expect(screen.getByText('Rescheduling')).toBeInTheDocument();
  });

  it('handles form submission with predefined reason', async () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    // Select a reason
    const reasonSelect = screen.getByLabelText('Reason for Cancellation');
    fireEvent.mouseDown(reasonSelect);

    waitFor(() => {
      const patientRequestOption = screen.getByText('Patient Request');
      fireEvent.click(patientRequestOption);
    });

    // Add notes
    const notesInput = screen.getByLabelText('Additional Notes (Optional)');
    fireEvent.change(notesInput, { target: { value: 'Patient requested' } });

    // Submit
    const confirmButton = screen.getByText('Confirm Cancellation');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnCancel).toHaveBeenCalledWith('1', 'patient_request', 'Patient requested');
    });
  });

  it('handles form submission with custom reason', async () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    // Select custom reason
    const reasonSelect = screen.getByLabelText('Reason for Cancellation');
    fireEvent.mouseDown(reasonSelect);

    waitFor(() => {
      const customOption = screen.getByText('Other (Custom)');
      fireEvent.click(customOption);
    });

    // Enter custom reason
    const customReasonInput = screen.getByLabelText('Custom Reason');
    fireEvent.change(customReasonInput, { target: { value: 'Personal emergency' } });

    // Add notes
    const notesInput = screen.getByLabelText('Additional Notes (Optional)');
    fireEvent.change(notesInput, { target: { value: 'Emergency situation' } });

    // Submit
    const confirmButton = screen.getByText('Confirm Cancellation');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnCancel).toHaveBeenCalledWith('1', 'Personal emergency', 'Emergency situation');
    });
  });

  it('disables confirm button when no reason is selected', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByText('Confirm Cancellation');
    expect(confirmButton).toBeDisabled();
  });

  it('disables confirm button when custom reason is empty', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    // Select custom reason
    const reasonSelect = screen.getByLabelText('Reason for Cancellation');
    fireEvent.mouseDown(reasonSelect);

    waitFor(() => {
      const customOption = screen.getByText('Other (Custom)');
      fireEvent.click(customOption);
    });

    const confirmButton = screen.getByText('Confirm Cancellation');
    expect(confirmButton).toBeDisabled();
  });

  it('handles keep appointment button', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    const keepButton = screen.getByText('Keep Appointment');
    fireEvent.click(keepButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
        loading={true}
      />
    );

    expect(screen.getByText('Cancelling...')).toBeInTheDocument();
  });

  it('disables buttons when loading', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
        loading={true}
      />
    );

    const confirmButton = screen.getByText('Cancelling...');
    expect(confirmButton).toBeDisabled();
  });

  it('shows confirmation alert', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Confirmation Required')).toBeInTheDocument();
    expect(screen.getByText(/By confirming this cancellation/)).toBeInTheDocument();
  });

  it('handles error state', async () => {
    const mockOnCancelWithError = jest.fn().mockRejectedValue(new Error('Cancellation failed'));

    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancelWithError}
      />
    );

    // Select a reason
    const reasonSelect = screen.getByLabelText('Reason for Cancellation');
    fireEvent.mouseDown(reasonSelect);

    waitFor(() => {
      const patientRequestOption = screen.getByText('Patient Request');
      fireEvent.click(patientRequestOption);
    });

    // Submit
    const confirmButton = screen.getByText('Confirm Cancellation');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to cancel appointment')).toBeInTheDocument();
    });
  });

  it('displays appointment date and time', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Date & Time')).toBeInTheDocument();
  });

  it('displays time until appointment', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Time Until Appointment')).toBeInTheDocument();
  });

  it('displays cancellation policy', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Cancellation Policy')).toBeInTheDocument();
  });

  it('handles null appointment', () => {
    renderWithProviders(
      <AppointmentCancellation
        appointment={null}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Cancel Appointment')).toBeInTheDocument();
  });

  it('resets form when dialog closes', () => {
    const { rerender } = renderWithProviders(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    // Select a reason
    const reasonSelect = screen.getByLabelText('Reason for Cancellation');
    fireEvent.mouseDown(reasonSelect);

    waitFor(() => {
      const patientRequestOption = screen.getByText('Patient Request');
      fireEvent.click(patientRequestOption);
    });

    // Close dialog
    rerender(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={false}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    // Reopen dialog
    rerender(
      <AppointmentCancellation
        appointment={mockAppointment}
        open={true}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    // Form should be reset
    const reasonSelectAfterReset = screen.getByLabelText('Reason for Cancellation');
    expect(reasonSelectAfterReset).toHaveValue('');
  });
}); 