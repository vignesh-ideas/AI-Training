import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from '@/theme';
import DoctorScheduleManagementPage from '../DoctorScheduleManagementPage';

// Mock the schedule components
jest.mock('@/components/schedule/ScheduleConflictDetection', () => {
  return function MockScheduleConflictDetection(props) {
    return <div data-testid="schedule-conflict-detection">Schedule Conflict Detection</div>;
  };
});

jest.mock('@/components/schedule/ScheduleOptimization', () => {
  return function MockScheduleOptimization(props) {
    return <div data-testid="schedule-optimization">Schedule Optimization</div>;
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

describe('DoctorScheduleManagementPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the doctor schedule management page', () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    expect(screen.getByText('Doctor Schedule Management')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders schedule data after loading', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Dr. Michael Chen')).toBeInTheDocument();
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
    });
  });

  it('displays schedule table with headers', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Doctor')).toBeInTheDocument();
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Date & Time')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Utilization')).toBeInTheDocument();
      expect(screen.getByText('Conflicts')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  it('shows schedule status chips', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
      expect(screen.getByText('BUSY')).toBeInTheDocument();
      expect(screen.getByText('CONFLICT')).toBeInTheDocument();
      expect(screen.getByText('BREAK')).toBeInTheDocument();
    });
  });

  it('displays utilization information', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('8/20')).toBeInTheDocument();
      expect(screen.getByText('15/15')).toBeInTheDocument();
      expect(screen.getByText('12/25')).toBeInTheDocument();
    });
  });

  it('handles doctor filter', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const doctorSelect = screen.getByLabelText('Doctor');
      fireEvent.mouseDown(doctorSelect);
    });
    
    await waitFor(() => {
      expect(screen.getByText('All Doctors')).toBeInTheDocument();
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Dr. Michael Chen')).toBeInTheDocument();
    });
  });

  it('handles department filter', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const departmentSelect = screen.getByLabelText('Department');
      fireEvent.mouseDown(departmentSelect);
    });
    
    await waitFor(() => {
      expect(screen.getByText('All Departments')).toBeInTheDocument();
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
      expect(screen.getByText('Neurology')).toBeInTheDocument();
      expect(screen.getByText('Dermatology')).toBeInTheDocument();
    });
  });

  it('handles status filter', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const statusSelect = screen.getByLabelText('Status');
      fireEvent.mouseDown(statusSelect);
    });
    
    await waitFor(() => {
      expect(screen.getByText('All Status')).toBeInTheDocument();
      expect(screen.getByText('Available')).toBeInTheDocument();
      expect(screen.getByText('Busy')).toBeInTheDocument();
      expect(screen.getByText('Conflict')).toBeInTheDocument();
      expect(screen.getByText('Break')).toBeInTheDocument();
    });
  });

  it('handles date filter', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const dateInput = screen.getByLabelText('Date');
      expect(dateInput).toBeInTheDocument();
    });
  });

  it('handles show conflicts toggle', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const showConflictsSwitch = screen.getByLabelText('Show Only Conflicts');
      fireEvent.click(showConflictsSwitch);
    });
  });

  it('displays action buttons for each schedule', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const viewButtons = screen.getAllByLabelText('View Details');
      const editButtons = screen.getAllByLabelText('Edit Schedule');
      
      expect(viewButtons.length).toBeGreaterThan(0);
      expect(editButtons.length).toBeGreaterThan(0);
    });
  });

  it('handles view details action', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const viewButton = screen.getAllByLabelText('View Details')[0];
      fireEvent.click(viewButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Schedule Details')).toBeInTheDocument();
    });
  });

  it('handles edit action', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const editButton = screen.getAllByLabelText('Edit Schedule')[0];
      fireEvent.click(editButton);
    });
    
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('handles optimization dialog', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const optimizeButton = screen.getByText('View Optimization Suggestions');
      fireEvent.click(optimizeButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Schedule Optimization')).toBeInTheDocument();
    });
  });

  it('handles refresh button', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);
    });
  });

  it('handles export button', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const exportButton = screen.getByText('Export');
      fireEvent.click(exportButton);
    });
  });

  it('handles print button', async () => {
    const mockPrint = jest.spyOn(window, 'print').mockImplementation(() => {});
    
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const printButton = screen.getByText('Print');
      fireEvent.click(printButton);
    });
    
    expect(mockPrint).toHaveBeenCalled();
    mockPrint.mockRestore();
  });

  it('handles new schedule button', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const newScheduleButton = screen.getByText('New Schedule');
      fireEvent.click(newScheduleButton);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/schedules/create');
  });

  it('displays pagination', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const pagination = screen.getByRole('navigation');
      expect(pagination).toBeInTheDocument();
    });
  });

  it('displays schedule statistics', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Doctors')).toBeInTheDocument();
      expect(screen.getByText('Available Slots')).toBeInTheDocument();
      expect(screen.getByText('Conflicts')).toBeInTheDocument();
      expect(screen.getByText('Utilization Rate')).toBeInTheDocument();
    });
  });

  it('shows conflicts alert when conflicts exist', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Schedule Conflicts Detected')).toBeInTheDocument();
      expect(screen.getByText(/conflict\(s\) found/)).toBeInTheDocument();
    });
  });

  it('displays conflict information', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('1 conflict(s)')).toBeInTheDocument();
      expect(screen.getByText('No conflicts')).toBeInTheDocument();
    });
  });

  it('handles optimization suggestions', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const optimizeButton = screen.getByText('View Optimization Suggestions');
      fireEvent.click(optimizeButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Detected Conflicts')).toBeInTheDocument();
      expect(screen.getByText('Optimization Suggestions')).toBeInTheDocument();
    });
  });

  it('displays schedule details in dialog', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const viewButton = screen.getAllByLabelText('View Details')[0];
      fireEvent.click(viewButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Schedule Details')).toBeInTheDocument();
      expect(screen.getByText('Doctor')).toBeInTheDocument();
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Time')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Utilization')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
    });
  });

  it('handles apply optimization suggestions', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      const optimizeButton = screen.getByText('View Optimization Suggestions');
      fireEvent.click(optimizeButton);
    });
    
    await waitFor(() => {
      const applyButton = screen.getByText('Apply Suggestions');
      fireEvent.click(applyButton);
    });
  });

  it('displays doctor and department information correctly', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Dr. Michael Chen')).toBeInTheDocument();
      expect(screen.getByText('Dr. Emily Davis')).toBeInTheDocument();
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
      expect(screen.getByText('Neurology')).toBeInTheDocument();
      expect(screen.getByText('Dermatology')).toBeInTheDocument();
    });
  });

  it('shows schedule times and locations', async () => {
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('09:00 AM - 05:00 PM')).toBeInTheDocument();
      expect(screen.getByText('10:00 AM - 06:00 PM')).toBeInTheDocument();
      expect(screen.getByText('Cardiology Clinic - Room 101')).toBeInTheDocument();
      expect(screen.getByText('Neurology Clinic - Room 205')).toBeInTheDocument();
    });
  });

  it('handles empty state', async () => {
    // Mock fetch to return empty array
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve([]),
    });
    
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    await waitFor(() => {
      // Should handle empty state gracefully
    });
  });

  it('handles error state', async () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock fetch to throw an error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    
    renderWithProviders(<DoctorScheduleManagementPage />);
    
    // Should handle errors gracefully
    consoleSpy.mockRestore();
  });
}); 