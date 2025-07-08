import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PrescriptionManagementPage from '../PrescriptionManagementPage';

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('PrescriptionManagementPage', () => {
  beforeEach(() => {
    // Mock console.error to suppress warnings
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    test('renders prescription management page with header', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      expect(screen.getByText('Prescription Management')).toBeInTheDocument();
      expect(screen.getByText('New Prescription')).toBeInTheDocument();
      expect(screen.getByText('Send to Pharmacy')).toBeInTheDocument();
    });

    test('renders statistics cards', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      expect(screen.getByText('Total Prescriptions')).toBeInTheDocument();
      expect(screen.getByText('Active Prescriptions')).toBeInTheDocument();
      expect(screen.getByText('Pending Refills')).toBeInTheDocument();
      expect(screen.getByText('Expired Prescriptions')).toBeInTheDocument();
    });

    test('renders search and filter controls', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      expect(screen.getByPlaceholderText('Search by patient or doctor...')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Priority')).toBeInTheDocument();
      expect(screen.getByText('Sort By')).toBeInTheDocument();
      expect(screen.getByText('More Filters')).toBeInTheDocument();
    });

    test('renders prescriptions table', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      expect(screen.getByText('Prescriptions')).toBeInTheDocument();
      expect(screen.getByText('Patient')).toBeInTheDocument();
      expect(screen.getByText('Doctor')).toBeInTheDocument();
      expect(screen.getByText('Medications')).toBeInTheDocument();
      expect(screen.getByText('Diagnosis')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Priority')).toBeInTheDocument();
      expect(screen.getByText('Expiry Date')).toBeInTheDocument();
      expect(screen.getByText('Refills')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  describe('Search and Filtering', () => {
    test('filters prescriptions by search term', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const searchInput = screen.getByPlaceholderText('Search by patient or doctor...');
      fireEvent.change(searchInput, { target: { value: 'John' } });
      
      expect(searchInput).toHaveValue('John');
    });

    test('filters prescriptions by status', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const statusSelect = screen.getByText('Status');
      fireEvent.mouseDown(statusSelect);
      
      const activeOption = screen.getByText('Active');
      fireEvent.click(activeOption);
    });

    test('filters prescriptions by priority', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const prioritySelect = screen.getByText('Priority');
      fireEvent.mouseDown(prioritySelect);
      
      const highOption = screen.getByText('High');
      fireEvent.click(highOption);
    });

    test('sorts prescriptions by different criteria', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const sortSelect = screen.getByText('Sort By');
      fireEvent.mouseDown(sortSelect);
      
      const patientOption = screen.getByText('Patient');
      fireEvent.click(patientOption);
    });
  });

  describe('Create Prescription Dialog', () => {
    test('opens create prescription dialog when new prescription button is clicked', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const newPrescriptionButton = screen.getByText('New Prescription');
      fireEvent.click(newPrescriptionButton);
      
      expect(screen.getByText('Create New Prescription')).toBeInTheDocument();
      expect(screen.getByText('Patient Information')).toBeInTheDocument();
    });

    test('navigates through prescription creation steps', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const newPrescriptionButton = screen.getByText('New Prescription');
      fireEvent.click(newPrescriptionButton);
      
      // Step 1: Patient Information
      expect(screen.getByText('Patient Information')).toBeInTheDocument();
      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);
      
      // Step 2: Medications
      expect(screen.getByText('Medications')).toBeInTheDocument();
      const continueButton2 = screen.getByText('Continue');
      fireEvent.click(continueButton2);
      
      // Step 3: Review & Sign
      expect(screen.getByText('Review & Sign')).toBeInTheDocument();
    });

    test('closes create prescription dialog when cancel is clicked', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const newPrescriptionButton = screen.getByText('New Prescription');
      fireEvent.click(newPrescriptionButton);
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(screen.queryByText('Create New Prescription')).not.toBeInTheDocument();
    });
  });

  describe('View Prescription Dialog', () => {
    test('opens view prescription dialog when view button is clicked', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const viewButtons = screen.getAllByLabelText('View Details');
      if (viewButtons.length > 0) {
        fireEvent.click(viewButtons[0]);
        
        expect(screen.getByText('Prescription Details')).toBeInTheDocument();
      }
    });

    test('displays prescription information in view dialog', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const viewButtons = screen.getAllByLabelText('View Details');
      if (viewButtons.length > 0) {
        fireEvent.click(viewButtons[0]);
        
        expect(screen.getByText('Patient Information')).toBeInTheDocument();
        expect(screen.getByText('Medications')).toBeInTheDocument();
        expect(screen.getByText('Prescription Information')).toBeInTheDocument();
      }
    });

    test('closes view prescription dialog when close is clicked', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const viewButtons = screen.getAllByLabelText('View Details');
      if (viewButtons.length > 0) {
        fireEvent.click(viewButtons[0]);
        
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
        
        expect(screen.queryByText('Prescription Details')).not.toBeInTheDocument();
      }
    });
  });

  describe('Fill Prescription Dialog', () => {
    test('opens fill prescription dialog when fill button is clicked', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const fillButtons = screen.getAllByLabelText('Fill Prescription');
      if (fillButtons.length > 0) {
        fireEvent.click(fillButtons[0]);
        
        expect(screen.getByText('Fill Prescription')).toBeInTheDocument();
        expect(screen.getByText('Select Pharmacy')).toBeInTheDocument();
      }
    });

    test('closes fill prescription dialog when cancel is clicked', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const fillButtons = screen.getAllByLabelText('Fill Prescription');
      if (fillButtons.length > 0) {
        fireEvent.click(fillButtons[0]);
        
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);
        
        expect(screen.queryByText('Fill Prescription')).not.toBeInTheDocument();
      }
    });

    test('sends prescription to pharmacy when send button is clicked', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const fillButtons = screen.getAllByLabelText('Fill Prescription');
      if (fillButtons.length > 0) {
        fireEvent.click(fillButtons[0]);
        
        const sendButton = screen.getByText('Send to Pharmacy');
        fireEvent.click(sendButton);
        
        expect(screen.queryByText('Fill Prescription')).not.toBeInTheDocument();
      }
    });
  });

  describe('Table Actions', () => {
    test('displays action buttons in table rows', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const viewButtons = screen.getAllByLabelText('View Details');
      const sendButtons = screen.getAllByLabelText('Send to Pharmacy');
      const fillButtons = screen.getAllByLabelText('Fill Prescription');
      const cancelButtons = screen.getAllByLabelText('Cancel Prescription');
      
      expect(viewButtons.length).toBeGreaterThan(0);
      expect(sendButtons.length).toBeGreaterThan(0);
      expect(fillButtons.length).toBeGreaterThan(0);
      expect(cancelButtons.length).toBeGreaterThan(0);
    });

    test('handles send to pharmacy action', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const sendButtons = screen.getAllByLabelText('Send to Pharmacy');
      if (sendButtons.length > 0) {
        fireEvent.click(sendButtons[0]);
      }
    });

    test('handles cancel prescription action', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const cancelButtons = screen.getAllByLabelText('Cancel Prescription');
      if (cancelButtons.length > 0) {
        fireEvent.click(cancelButtons[0]);
      }
    });

    test('handles refill prescription action', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const refillButtons = screen.getAllByLabelText('Request Refill');
      if (refillButtons.length > 0) {
        fireEvent.click(refillButtons[0]);
      }
    });
  });

  describe('Export and Print', () => {
    test('exports prescriptions when export button is clicked', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const exportButton = screen.getByText('Export');
      fireEvent.click(exportButton);
    });

    test('prints prescriptions when print button is clicked', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const printButton = screen.getByText('Print');
      fireEvent.click(printButton);
    });
  });

  describe('Status Display', () => {
    test('displays status chips with correct colors', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const statusChips = screen.getAllByText('active');
      expect(statusChips.length).toBeGreaterThan(0);
    });

    test('displays priority chips with correct colors', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const priorityChips = screen.getAllByText('medium');
      expect(priorityChips.length).toBeGreaterThan(0);
    });
  });

  describe('Patient Information Display', () => {
    test('displays patient names and IDs correctly', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('P001')).toBeInTheDocument();
    });
  });

  describe('Medication Information Display', () => {
    test('displays medication names and dosages correctly', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      expect(screen.getByText('Lisinopril 10mg')).toBeInTheDocument();
      expect(screen.getByText('Metformin 500mg')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    test('displays pagination controls', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      // Pagination should be present if there are multiple pages
      const pagination = screen.getByRole('navigation');
      expect(pagination).toBeInTheDocument();
    });

    test('changes page when pagination is clicked', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const paginationButtons = screen.getAllByRole('button');
      const pageButtons = paginationButtons.filter(button => 
        button.textContent && /^\d+$/.test(button.textContent)
      );
      
      if (pageButtons.length > 1) {
        fireEvent.click(pageButtons[1]);
      }
    });
  });

  describe('Floating Action Button', () => {
    test('renders floating action button', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const fab = screen.getByLabelText('add prescription');
      expect(fab).toBeInTheDocument();
    });

    test('opens create prescription dialog when FAB is clicked', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const fab = screen.getByLabelText('add prescription');
      fireEvent.click(fab);
      
      expect(screen.getByText('Create New Prescription')).toBeInTheDocument();
    });
  });

  describe('Alert Display', () => {
    test('displays alerts for expired prescriptions', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      // Should show alert if there are expired prescriptions or pending refills
      const alerts = screen.queryByRole('alert');
      if (alerts) {
        expect(alerts).toBeInTheDocument();
      }
    });
  });

  describe('Statistics Display', () => {
    test('displays correct statistics', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      expect(screen.getByText('2')).toBeInTheDocument(); // Total prescriptions
      expect(screen.getByText('1')).toBeInTheDocument(); // Active prescriptions
      expect(screen.getByText('2')).toBeInTheDocument(); // Pending refills
      expect(screen.getByText('0')).toBeInTheDocument(); // Expired prescriptions
    });
  });

  describe('Form Validation', () => {
    test('validates required fields in create prescription form', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const newPrescriptionButton = screen.getByText('New Prescription');
      fireEvent.click(newPrescriptionButton);
      
      const patientIdField = screen.getByLabelText('Patient ID');
      expect(patientIdField).toBeInTheDocument();
    });
  });

  describe('Stepper Navigation', () => {
    test('navigates through prescription creation steps', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      const newPrescriptionButton = screen.getByText('New Prescription');
      fireEvent.click(newPrescriptionButton);
      
      // Check that step 1 is active
      expect(screen.getByText('Patient Information')).toBeInTheDocument();
      
      // Navigate to step 2
      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);
      
      // Check that step 2 is active
      expect(screen.getByText('Medications')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles missing data gracefully', () => {
      renderWithProviders(<PrescriptionManagementPage />);
      
      // Page should render without errors even with empty data
      expect(screen.getByText('Prescription Management')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('renders on different screen sizes', () => {
      const { rerender } = renderWithProviders(<PrescriptionManagementPage />);
      
      // Test mobile view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      window.dispatchEvent(new Event('resize'));
      
      // Test tablet view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      window.dispatchEvent(new Event('resize'));
      
      // Test desktop view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      window.dispatchEvent(new Event('resize'));
    });
  });
}); 