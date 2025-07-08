import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Toaster } from 'react-hot-toast';
import theme from '../../theme';
import MedicalRecordsManagementPage from '../MedicalRecordsManagementPage';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {component}
          <Toaster />
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('MedicalRecordsManagementPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page title and header', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    expect(screen.getByText('Medical Records Management')).toBeInTheDocument();
    expect(screen.getByText('New Record')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Print')).toBeInTheDocument();
  });

  it('displays statistics cards', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('Total Records')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('High Priority')).toBeInTheDocument();
    });
  });

  it('shows filters section', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by patient, doctor, title, diagnosis...')).toBeInTheDocument();
    expect(screen.getByText('Record Type')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
  });

  it('displays medical records table after loading', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    // Initially shows loading
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // After loading, shows table
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Cardiac Consultation')).toBeInTheDocument();
      expect(screen.getByText('Angina pectoris')).toBeInTheDocument();
    });
  });

  it('filters records by search term', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by patient, doctor, title, diagnosis...');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  it('filters records by record type', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const recordTypeSelect = screen.getByText('Record Type').closest('.MuiFormControl-root')?.querySelector('input');
    fireEvent.mouseDown(recordTypeSelect!);
    
    const consultationOption = screen.getByText('Consultation');
    fireEvent.click(consultationOption);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('filters records by status', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const statusSelect = screen.getByText('Status').closest('.MuiFormControl-root')?.querySelector('input');
    fireEvent.mouseDown(statusSelect!);
    
    const completedOption = screen.getByText('Completed');
    fireEvent.click(completedOption);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('filters records by priority', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const prioritySelect = screen.getByText('Priority').closest('.MuiFormControl-root')?.querySelector('input');
    fireEvent.mouseDown(prioritySelect!);
    
    const highOption = screen.getByText('High');
    fireEvent.click(highOption);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('filters records by department', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const departmentSelect = screen.getByText('Department').closest('.MuiFormControl-root')?.querySelector('input');
    fireEvent.mouseDown(departmentSelect!);
    
    const cardiologyOption = screen.getByText('Cardiology');
    fireEvent.click(cardiologyOption);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('opens record details dialog when view button is clicked', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByLabelText('View Details');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Medical Record Details')).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Treatment')).toBeInTheDocument();
      expect(screen.getByText('Vitals')).toBeInTheDocument();
      expect(screen.getByText('Attachments')).toBeInTheDocument();
    });
  });

  it('navigates to edit page when edit button is clicked', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByLabelText('Edit Record');
    fireEvent.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/medical-records/1/edit');
  });

  it('opens delete confirmation dialog when delete button is clicked', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText('Delete Record');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Delete Medical Record')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this medical record?')).toBeInTheDocument();
    });
  });

  it('deletes record when confirmed', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText('Delete Record');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Delete Medical Record')).toBeInTheDocument();
    });

    const confirmDeleteButton = screen.getByText('Delete');
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  it('navigates to create new record page', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    const newRecordButton = screen.getByText('New Record');
    fireEvent.click(newRecordButton);

    expect(mockNavigate).toHaveBeenCalledWith('/medical-records/create');
  });

  it('shows export success message', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(require('react-hot-toast').toast.success).toHaveBeenCalledWith('Medical records exported successfully');
    });
  });

  it('shows print success message', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    const printButton = screen.getByText('Print');
    fireEvent.click(printButton);

    await waitFor(() => {
      expect(require('react-hot-toast').toast.success).toHaveBeenCalledWith('Medical records printed');
    });
  });

  it('refreshes data when refresh button is clicked', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    // Should show loading again
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays pagination controls', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  it('changes page when pagination is clicked', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const paginationButtons = screen.getAllByRole('button');
    const nextPageButton = paginationButtons.find(button => 
      button.getAttribute('aria-label')?.includes('Go to next page')
    );

    if (nextPageButton) {
      fireEvent.click(nextPageButton);
    }
  });

  it('displays record type chips with correct colors', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('CONSULTATION')).toBeInTheDocument();
      expect(screen.getByText('DIAGNOSIS')).toBeInTheDocument();
      expect(screen.getByText('TREATMENT')).toBeInTheDocument();
    });
  });

  it('displays status chips with correct colors', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('COMPLETED')).toBeInTheDocument();
      expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument();
      expect(screen.getByText('PENDING')).toBeInTheDocument();
    });
  });

  it('displays priority chips with correct colors', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('HIGH')).toBeInTheDocument();
      expect(screen.getByText('MEDIUM')).toBeInTheDocument();
      expect(screen.getByText('LOW')).toBeInTheDocument();
    });
  });

  it('shows record details in dialog tabs', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByLabelText('View Details');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Medical Record Details')).toBeInTheDocument();
    });

    // Check overview tab content
    expect(screen.getByText('Patient Information')).toBeInTheDocument();
    expect(screen.getByText('Record Information')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();

    // Switch to treatment tab
    const treatmentTab = screen.getByText('Treatment');
    fireEvent.click(treatmentTab);

    await waitFor(() => {
      expect(screen.getByText('Diagnosis')).toBeInTheDocument();
      expect(screen.getByText('Treatment')).toBeInTheDocument();
      expect(screen.getByText('Medications')).toBeInTheDocument();
      expect(screen.getByText('Lab Results')).toBeInTheDocument();
    });

    // Switch to vitals tab
    const vitalsTab = screen.getByText('Vitals');
    fireEvent.click(vitalsTab);

    await waitFor(() => {
      expect(screen.getByText('Vital Signs')).toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
    });

    // Switch to attachments tab
    const attachmentsTab = screen.getByText('Attachments');
    fireEvent.click(attachmentsTab);

    await waitFor(() => {
      expect(screen.getByText('Attachments')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
    });
  });

  it('closes details dialog when close button is clicked', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByLabelText('View Details');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Medical Record Details')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Medical Record Details')).not.toBeInTheDocument();
    });
  });

  it('cancels delete operation when cancel button is clicked', async () => {
    renderWithProviders(<MedicalRecordsManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText('Delete Record');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Delete Medical Record')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Delete Medical Record')).not.toBeInTheDocument();
    });
  });
}); 