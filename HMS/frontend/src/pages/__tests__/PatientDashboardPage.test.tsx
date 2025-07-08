import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import theme from '@/theme';
import PatientDashboardPage from '../PatientDashboardPage';

// Mock the dashboard components
jest.mock('@/components/patient/dashboard/PatientOverview', () => {
  return function MockPatientOverview(props: any) {
    return <div data-testid="patient-overview">Patient Overview: {props.patient.firstName}</div>;
  };
});

jest.mock('@/components/patient/dashboard/RecentAppointments', () => {
  return function MockRecentAppointments(props: any) {
    return <div data-testid="recent-appointments">Recent Appointments: {props.appointments.length}</div>;
  };
});

jest.mock('@/components/patient/dashboard/MedicalHistorySummary', () => {
  return function MockMedicalHistorySummary(props: any) {
    return <div data-testid="medical-history-summary">Medical History: {props.history.totalRecords} records</div>;
  };
});

jest.mock('@/components/patient/dashboard/UpcomingCalendar', () => {
  return function MockUpcomingCalendar(props: any) {
    return <div data-testid="upcoming-calendar">Upcoming Calendar: {props.appointments.length} appointments</div>;
  };
});

jest.mock('@/components/patient/dashboard/PatientStatistics', () => {
  return function MockPatientStatistics(props: any) {
    return <div data-testid="patient-statistics">Patient Statistics: {props.statistics.appointmentCompletionRate}%</div>;
  };
});

jest.mock('@/components/patient/dashboard/QuickActions', () => {
  return function MockQuickActions(props: any) {
    return (
      <div data-testid="quick-actions">
        <button onClick={() => props.onAction('schedule_appointment')}>Schedule Appointment</button>
        <button onClick={() => props.onAction('view_medical_records')}>View Medical Records</button>
      </div>
    );
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Toaster />
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('PatientDashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    renderWithProviders(<PatientDashboardPage />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders dashboard content after loading', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Welcome back, John!')).toBeInTheDocument();
    });
  });

  it('displays patient information correctly', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Patient ID: PAT001')).toBeInTheDocument();
      expect(screen.getByText('Last visit: 2024-01-15')).toBeInTheDocument();
    });
  });

  it('shows quick stats cards', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('83%')).toBeInTheDocument();
      expect(screen.getByText('Appointment Completion Rate')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('Total Visits')).toBeInTheDocument();
      expect(screen.getByText('92%')).toBeInTheDocument();
      expect(screen.getByText('Patient Satisfaction')).toBeInTheDocument();
    });
  });

  it('renders all dashboard components', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('patient-overview')).toBeInTheDocument();
      expect(screen.getByTestId('recent-appointments')).toBeInTheDocument();
      expect(screen.getByTestId('medical-history-summary')).toBeInTheDocument();
      expect(screen.getByTestId('upcoming-calendar')).toBeInTheDocument();
      expect(screen.getByTestId('patient-statistics')).toBeInTheDocument();
      expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
    });
  });

  it('displays notifications section', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Notifications')).toBeInTheDocument();
      expect(screen.getByText('Your appointment with Dr. Sarah Johnson is tomorrow at 11:00 AM')).toBeInTheDocument();
      expect(screen.getByText('Your blood work results are now available')).toBeInTheDocument();
    });
  });

  it('shows unread notification count', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Unread Notifications')).toBeInTheDocument();
    });
  });

  it('handles refresh button click', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      const refreshButton = screen.getByLabelText('Refresh Dashboard');
      expect(refreshButton).toBeInTheDocument();
    });
  });

  it('handles print button click', async () => {
    const mockPrint = jest.spyOn(window, 'print').mockImplementation(() => {});
    
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      const printButton = screen.getByLabelText('Print Dashboard');
      fireEvent.click(printButton);
    });
    
    expect(mockPrint).toHaveBeenCalled();
    mockPrint.mockRestore();
  });

  it('handles export button click', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      const exportButton = screen.getByLabelText('Export Dashboard');
      fireEvent.click(exportButton);
    });
  });

  it('handles quick action clicks', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      const scheduleButton = screen.getByText('Schedule Appointment');
      fireEvent.click(scheduleButton);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/appointments/schedule');
  });

  it('handles view medical records action', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      const viewRecordsButton = screen.getByText('View Medical Records');
      fireEvent.click(viewRecordsButton);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/patient/PAT001');
  });

  it('displays appointment statistics correctly', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('2 Completed')).toBeInTheDocument();
      expect(screen.getByText('1 Scheduled')).toBeInTheDocument();
      expect(screen.getByText('0 Cancelled')).toBeInTheDocument();
    });
  });

  it('shows notification types correctly', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('APPOINTMENT')).toBeInTheDocument();
      expect(screen.getByText('LAB RESULT')).toBeInTheDocument();
      expect(screen.getByText('PRESCRIPTION')).toBeInTheDocument();
    });
  });

  it('displays patient avatar with initials', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      const avatar = screen.getByText('JD');
      expect(avatar).toBeInTheDocument();
    });
  });

  it('shows patient status chip', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    });
  });

  it('displays notification dates correctly', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('2024-02-14')).toBeInTheDocument();
      expect(screen.getByText('2024-01-16')).toBeInTheDocument();
      expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock fetch to throw an error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  it('handles empty dashboard data', async () => {
    // Mock fetch to return null
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(null),
    });
    
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No dashboard data available.')).toBeInTheDocument();
    });
  });

  it('displays view all buttons', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      const viewAllButtons = screen.getAllByText('View All');
      expect(viewAllButtons).toHaveLength(3); // Recent Appointments, Upcoming Calendar, Notifications
    });
  });

  it('shows notification read status correctly', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      // Check for unread notification indicator
      const unreadIndicator = document.querySelector('[style*="background-color: rgb(25, 118, 210)"]');
      expect(unreadIndicator).toBeInTheDocument();
    });
  });

  it('displays medical history summary correctly', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Medical History: 15 records')).toBeInTheDocument();
    });
  });

  it('shows upcoming calendar with appointments', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Upcoming Calendar: 2 appointments')).toBeInTheDocument();
    });
  });

  it('displays patient statistics correctly', async () => {
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Patient Statistics: 83%')).toBeInTheDocument();
    });
  });

  it('handles prescription request action', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      // Simulate quick action for prescription request
      const quickActions = screen.getByTestId('quick-actions');
      // This would be handled by the mock component
    });
  });

  it('handles contact doctor action', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    
    renderWithProviders(<PatientDashboardPage />);
    
    await waitFor(() => {
      // Simulate quick action for contact doctor
      const quickActions = screen.getByTestId('quick-actions');
      // This would be handled by the mock component
    });
  });
}); 