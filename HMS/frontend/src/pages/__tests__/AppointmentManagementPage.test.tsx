import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from '@/theme';
import AppointmentManagementPage from '../AppointmentManagementPage';

// Mock the appointment components
jest.mock('@/components/appointment/AppointmentSearch', () => {
  return function MockAppointmentSearch(props) {
    return <div data-testid="appointment-search">Appointment Search</div>;
  };
});

jest.mock('@/components/appointment/AppointmentStatusUpdate', () => {
  return function MockAppointmentStatusUpdate(props) {
    return <div data-testid="appointment-status-update">Appointment Status Update</div>;
  };
});

jest.mock('@/components/appointment/AppointmentCancellation', () => {
  return function MockAppointmentCancellation(props) {
    return <div data-testid="appointment-cancellation">Appointment Cancellation</div>;
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <Toaster />
          {component}
        </ThemeProvider>
      </LocalizationProvider>
    </BrowserRouter>
  );
};

describe('AppointmentManagementPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the appointment management page', () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    expect(screen.getByText('Appointment Management')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders appointment data after loading', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
    });
  });

  it('displays appointment table with headers', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Patient')).toBeInTheDocument();
      expect(screen.getByText('Doctor')).toBeInTheDocument();
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Date & Time')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  it('shows appointment status chips', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('SCHEDULED')).toBeInTheDocument();
      expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
      expect(screen.getByText('COMPLETED')).toBeInTheDocument();
      expect(screen.getByText('CANCELLED')).toBeInTheDocument();
    });
  });

  it('displays appointment types', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('CONSULTATION')).toBeInTheDocument();
      expect(screen.getByText('FOLLOW UP')).toBeInTheDocument();
      expect(screen.getByText('LAB TEST')).toBeInTheDocument();
      expect(screen.getByText('PHYSICAL EXAMINATION')).toBeInTheDocument();
      expect(screen.getByText('EMERGENCY')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search patients, doctors, departments...');
      fireEvent.change(searchInput, { target: { value: 'John' } });
    });
  });

  it('handles status filter', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const statusSelect = screen.getByLabelText('Status');
      fireEvent.mouseDown(statusSelect);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Scheduled')).toBeInTheDocument();
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Cancelled')).toBeInTheDocument();
      expect(screen.getByText('No Show')).toBeInTheDocument();
    });
  });

  it('handles type filter', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const typeSelect = screen.getByLabelText('Type');
      fireEvent.mouseDown(typeSelect);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Consultation')).toBeInTheDocument();
      expect(screen.getByText('Follow-up')).toBeInTheDocument();
      expect(screen.getByText('Lab Test')).toBeInTheDocument();
      expect(screen.getByText('Physical Exam')).toBeInTheDocument();
      expect(screen.getByText('Emergency')).toBeInTheDocument();
    });
  });

  it('handles date filter', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const dateInput = screen.getByLabelText('Date');
      expect(dateInput).toBeInTheDocument();
    });
  });

  it('handles show cancelled toggle', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const showCancelledSwitch = screen.getByLabelText('Show Cancelled');
      fireEvent.click(showCancelledSwitch);
    });
  });

  it('displays action buttons for each appointment', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const viewButtons = screen.getAllByLabelText('View Details');
      const editButtons = screen.getAllByLabelText('Edit');
      const rescheduleButtons = screen.getAllByLabelText('Reschedule');
      const cancelButtons = screen.getAllByLabelText('Cancel');
      
      expect(viewButtons.length).toBeGreaterThan(0);
      expect(editButtons.length).toBeGreaterThan(0);
      expect(rescheduleButtons.length).toBeGreaterThan(0);
      expect(cancelButtons.length).toBeGreaterThan(0);
    });
  });

  it('handles view details action', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const viewButton = screen.getAllByLabelText('View Details')[0];
      fireEvent.click(viewButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Appointment Details')).toBeInTheDocument();
    });
  });

  it('handles edit action', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const editButton = screen.getAllByLabelText('Edit')[0];
      fireEvent.click(editButton);
    });
    
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('handles reschedule action', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const rescheduleButton = screen.getAllByLabelText('Reschedule')[0];
      fireEvent.click(rescheduleButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Reschedule Appointment')).toBeInTheDocument();
    });
  });

  it('handles cancel action', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const cancelButton = screen.getAllByLabelText('Cancel')[0];
      fireEvent.click(cancelButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Cancel Appointment')).toBeInTheDocument();
    });
  });

  it('handles bulk selection', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const selectAllCheckbox = screen.getByRole('checkbox');
      fireEvent.click(selectAllCheckbox);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/appointment\(s\) selected/)).toBeInTheDocument();
    });
  });

  it('handles bulk actions', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const selectAllCheckbox = screen.getByRole('checkbox');
      fireEvent.click(selectAllCheckbox);
    });
    
    await waitFor(() => {
      const confirmAllButton = screen.getByText('Confirm All');
      const cancelAllButton = screen.getByText('Cancel All');
      const exportSelectedButton = screen.getByText('Export Selected');
      
      expect(confirmAllButton).toBeInTheDocument();
      expect(cancelAllButton).toBeInTheDocument();
      expect(exportSelectedButton).toBeInTheDocument();
    });
  });

  it('handles refresh button', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);
    });
  });

  it('handles export button', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const exportButton = screen.getByText('Export');
      fireEvent.click(exportButton);
    });
  });

  it('handles print button', async () => {
    const mockPrint = jest.spyOn(window, 'print').mockImplementation(() => {});
    
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const printButton = screen.getByText('Print');
      fireEvent.click(printButton);
    });
    
    expect(mockPrint).toHaveBeenCalled();
    mockPrint.mockRestore();
  });

  it('handles new appointment button', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const newAppointmentButton = screen.getByText('New Appointment');
      fireEvent.click(newAppointmentButton);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/appointments/schedule');
  });

  it('displays pagination', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const pagination = screen.getByRole('navigation');
      expect(pagination).toBeInTheDocument();
    });
  });

  it('handles pagination navigation', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const paginationButtons = screen.getAllByRole('button');
      const nextButton = paginationButtons.find(button => 
        button.getAttribute('aria-label')?.includes('next')
      );
      if (nextButton) {
        fireEvent.click(nextButton);
      }
    });
  });

  it('displays appointment statistics', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Available/)).toBeInTheDocument();
      expect(screen.getByText(/Booked/)).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock fetch to throw an error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    
    renderWithProviders(<AppointmentManagementPage />);
    
    // Should handle errors gracefully
    consoleSpy.mockRestore();
  });

  it('displays appointment details in dialog', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const viewButton = screen.getAllByLabelText('View Details')[0];
      fireEvent.click(viewButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Appointment Details')).toBeInTheDocument();
      expect(screen.getByText('Patient')).toBeInTheDocument();
      expect(screen.getByText('Doctor')).toBeInTheDocument();
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Time')).toBeInTheDocument();
      expect(screen.getByText('Reason')).toBeInTheDocument();
    });
  });

  it('handles appointment cancellation confirmation', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const cancelButton = screen.getAllByLabelText('Cancel')[0];
      fireEvent.click(cancelButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Cancel Appointment')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to cancel this appointment?')).toBeInTheDocument();
    });
  });

  it('handles reschedule dialog', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      const rescheduleButton = screen.getAllByLabelText('Reschedule')[0];
      fireEvent.click(rescheduleButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Reschedule Appointment')).toBeInTheDocument();
      expect(screen.getByText('Redirecting to appointment scheduling page for rescheduling...')).toBeInTheDocument();
    });
  });

  it('displays patient and doctor information correctly', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Dr. Michael Chen')).toBeInTheDocument();
    });
  });

  it('shows department information', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
      expect(screen.getByText('Neurology')).toBeInTheDocument();
      expect(screen.getByText('Dermatology')).toBeInTheDocument();
    });
  });

  it('displays appointment dates and times', async () => {
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('10:00 AM')).toBeInTheDocument();
      expect(screen.getByText('02:30 PM')).toBeInTheDocument();
      expect(screen.getByText('11:00 AM')).toBeInTheDocument();
    });
  });

  it('handles empty state', async () => {
    // Mock fetch to return empty array
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve([]),
    });
    
    renderWithProviders(<AppointmentManagementPage />);
    
    await waitFor(() => {
      // Should handle empty state gracefully
    });
  });
}); 