import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MedicalHistoryTimelinePage from '../MedicalHistoryTimelinePage';

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock window.print
Object.defineProperty(window, 'print', {
  value: jest.fn(),
  writable: true,
});

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {component}
      </LocalizationProvider>
    </BrowserRouter>
  );
};

describe('MedicalHistoryTimelinePage', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ patientId: 'PAT001' });
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  it('renders the page title and header', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Medical History Timeline')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Print')).toBeInTheDocument();
  });

  it('displays statistics cards', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Events')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Confidential')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    // Should show loading initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays timeline events after loading', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
      expect(screen.getByText('Neurological Assessment')).toBeInTheDocument();
      expect(screen.getByText('Skin Condition Treatment')).toBeInTheDocument();
    });
  });

  it('filters events by search term', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search by title, description, doctor, diagnosis...');
    fireEvent.change(searchInput, { target: { value: 'cardiac' } });
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
      expect(screen.queryByText('Neurological Assessment')).not.toBeInTheDocument();
    });
  });

  it('filters events by event type', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
    });
    
    const eventTypeSelect = screen.getByLabelText('Event Type');
    fireEvent.mouseDown(eventTypeSelect);
    
    const consultationOption = screen.getByText('Consultation');
    fireEvent.click(consultationOption);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
      expect(screen.queryByText('Neurological Assessment')).not.toBeInTheDocument();
    });
  });

  it('filters events by status', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
    });
    
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.mouseDown(statusSelect);
    
    const completedOption = screen.getByText('Completed');
    fireEvent.click(completedOption);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
      expect(screen.getByText('Skin Condition Treatment')).toBeInTheDocument();
    });
  });

  it('filters events by priority', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
    });
    
    const prioritySelect = screen.getByLabelText('Priority');
    fireEvent.mouseDown(prioritySelect);
    
    const highOption = screen.getByText('High');
    fireEvent.click(highOption);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
      expect(screen.getByText('Knee Surgery Consultation')).toBeInTheDocument();
    });
  });

  it('filters events by department', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
    });
    
    const departmentSelect = screen.getByLabelText('Department');
    fireEvent.mouseDown(departmentSelect);
    
    const cardiologyOption = screen.getByText('Cardiology');
    fireEvent.click(cardiologyOption);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
      expect(screen.getByText('Cardiac Follow-up')).toBeInTheDocument();
      expect(screen.queryByText('Neurological Assessment')).not.toBeInTheDocument();
    });
  });

  it('shows/hides confidential events', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
    });
    
    const confidentialSwitch = screen.getByLabelText('Show Confidential Events');
    fireEvent.click(confidentialSwitch);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Follow-up')).toBeInTheDocument();
    });
  });

  it('sorts events by different criteria', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
    });
    
    const sortBySelect = screen.getByLabelText('Sort By');
    fireEvent.mouseDown(sortBySelect);
    
    const priorityOption = screen.getByText('Priority');
    fireEvent.click(priorityOption);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
    });
  });

  it('opens event details dialog when view details is clicked', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
    });
    
    const viewButtons = screen.getAllByTestId('VisibilityIcon');
    fireEvent.click(viewButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Event Details')).toBeInTheDocument();
    });
  });

  it('displays event details in dialog tabs', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
    });
    
    const viewButtons = screen.getAllByTestId('VisibilityIcon');
    fireEvent.click(viewButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Event Details')).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Treatment')).toBeInTheDocument();
      expect(screen.getByText('Vitals')).toBeInTheDocument();
      expect(screen.getByText('Attachments')).toBeInTheDocument();
    });
  });

  it('switches between dialog tabs', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
    });
    
    const viewButtons = screen.getAllByTestId('VisibilityIcon');
    fireEvent.click(viewButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Event Details')).toBeInTheDocument();
    });
    
    const treatmentTab = screen.getByText('Treatment');
    fireEvent.click(treatmentTab);
    
    await waitFor(() => {
      expect(screen.getByText('Diagnosis')).toBeInTheDocument();
      expect(screen.getByText('Treatment')).toBeInTheDocument();
    });
  });

  it('opens analytics dialog when analytics button is clicked', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });
    
    const analyticsButton = screen.getByText('Analytics');
    fireEvent.click(analyticsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Timeline Analytics')).toBeInTheDocument();
    });
  });

  it('displays analytics data in dialog', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });
    
    const analyticsButton = screen.getByText('Analytics');
    fireEvent.click(analyticsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Timeline Analytics')).toBeInTheDocument();
      expect(screen.getByText('Event Distribution by Type')).toBeInTheDocument();
      expect(screen.getByText('Event Distribution by Department')).toBeInTheDocument();
      expect(screen.getByText('Event Distribution by Status')).toBeInTheDocument();
      expect(screen.getByText('Summary Statistics')).toBeInTheDocument();
    });
  });

  it('handles export functionality', async () => {
    const { toast } = require('react-hot-toast');
    
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Export')).toBeInTheDocument();
    });
    
    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);
    
    expect(toast.success).toHaveBeenCalledWith('Timeline exported successfully');
  });

  it('handles print functionality', async () => {
    const { toast } = require('react-hot-toast');
    
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Print')).toBeInTheDocument();
    });
    
    const printButton = screen.getByText('Print');
    fireEvent.click(printButton);
    
    expect(window.print).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Timeline printed');
  });

  it('handles refresh functionality', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument();
    });
    
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    
    // Should show loading state
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays event status chips with correct colors', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('COMPLETED')).toBeInTheDocument();
      expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument();
      expect(screen.getByText('PENDING')).toBeInTheDocument();
    });
  });

  it('displays event priority chips with correct colors', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('HIGH')).toBeInTheDocument();
      expect(screen.getByText('MEDIUM')).toBeInTheDocument();
      expect(screen.getByText('LOW')).toBeInTheDocument();
    });
  });

  it('displays confidential event indicators', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
    });
    
    const confidentialSwitch = screen.getByLabelText('Show Confidential Events');
    fireEvent.click(confidentialSwitch);
    
    await waitFor(() => {
      expect(screen.getByText('Confidential')).toBeInTheDocument();
    });
  });

  it('displays timeline with correct event information', async () => {
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
      expect(screen.getByText('Patient presented with chest pain and shortness of breath')).toBeInTheDocument();
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
    });
  });

  it('handles empty timeline gracefully', async () => {
    // Mock empty events
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response)
    );
    
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Events')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  it('handles error state gracefully', async () => {
    const { toast } = require('react-hot-toast');
    
    // Mock error
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );
    
    renderWithProviders(<MedicalHistoryTimelinePage />);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load timeline events');
    });
  });
}); 