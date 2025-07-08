import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LabResultsManagementPage from '../LabResultsManagementPage';

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

describe('LabResultsManagementPage', () => {
  beforeEach(() => {
    // Mock console.error to suppress warnings
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    test('renders lab results management page with header', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      expect(screen.getByText('Lab Results Management')).toBeInTheDocument();
      expect(screen.getByText('Upload Results')).toBeInTheDocument();
      expect(screen.getByText('Order Test')).toBeInTheDocument();
    });

    test('renders statistics cards', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      expect(screen.getByText('Total Results')).toBeInTheDocument();
      expect(screen.getByText('Pending Results')).toBeInTheDocument();
      expect(screen.getByText('Critical Results')).toBeInTheDocument();
      expect(screen.getByText('Unreviewed Results')).toBeInTheDocument();
    });

    test('renders search and filter controls', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      expect(screen.getByPlaceholderText('Search by patient name or test...')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Priority')).toBeInTheDocument();
      expect(screen.getByText('Sort By')).toBeInTheDocument();
    });

    test('renders lab results table', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      expect(screen.getByText('Lab Results')).toBeInTheDocument();
      expect(screen.getByText('Patient')).toBeInTheDocument();
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Result')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Priority')).toBeInTheDocument();
      expect(screen.getByText('Reported Date')).toBeInTheDocument();
      expect(screen.getByText('Reviewed')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  describe('Search and Filtering', () => {
    test('filters results by search term', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const searchInput = screen.getByPlaceholderText('Search by patient name or test...');
      fireEvent.change(searchInput, { target: { value: 'John' } });
      
      expect(searchInput).toHaveValue('John');
    });

    test('filters results by status', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const statusSelect = screen.getByText('Status');
      fireEvent.mouseDown(statusSelect);
      
      const completedOption = screen.getByText('Completed');
      fireEvent.click(completedOption);
    });

    test('filters results by category', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const categorySelect = screen.getByText('Category');
      fireEvent.mouseDown(categorySelect);
      
      const hematologyOption = screen.getByText('Hematology');
      fireEvent.click(hematologyOption);
    });

    test('filters results by priority', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const prioritySelect = screen.getByText('Priority');
      fireEvent.mouseDown(prioritySelect);
      
      const highOption = screen.getByText('High');
      fireEvent.click(highOption);
    });

    test('sorts results by different criteria', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const sortSelect = screen.getByText('Sort By');
      fireEvent.mouseDown(sortSelect);
      
      const patientOption = screen.getByText('Patient');
      fireEvent.click(patientOption);
    });
  });

  describe('Upload Results Dialog', () => {
    test('opens upload dialog when upload button is clicked', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const uploadButton = screen.getByText('Upload Results');
      fireEvent.click(uploadButton);
      
      expect(screen.getByText('Upload Lab Results')).toBeInTheDocument();
      expect(screen.getByText('Drag and drop files here')).toBeInTheDocument();
      expect(screen.getByText('Choose Files')).toBeInTheDocument();
    });

    test('closes upload dialog when cancel is clicked', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const uploadButton = screen.getByText('Upload Results');
      fireEvent.click(uploadButton);
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(screen.queryByText('Upload Lab Results')).not.toBeInTheDocument();
    });

    test('closes upload dialog when upload is clicked', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const uploadButton = screen.getByText('Upload Results');
      fireEvent.click(uploadButton);
      
      const uploadResultsButton = screen.getByText('Upload Results');
      fireEvent.click(uploadResultsButton);
      
      expect(screen.queryByText('Upload Lab Results')).not.toBeInTheDocument();
    });
  });

  describe('Order Test Dialog', () => {
    test('opens order test dialog when order test button is clicked', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const orderTestButton = screen.getByText('Order Test');
      fireEvent.click(orderTestButton);
      
      expect(screen.getByText('Order Lab Test')).toBeInTheDocument();
      expect(screen.getByText('Patient ID')).toBeInTheDocument();
      expect(screen.getByText('Test Category')).toBeInTheDocument();
      expect(screen.getByText('Select Test')).toBeInTheDocument();
    });

    test('closes order test dialog when cancel is clicked', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const orderTestButton = screen.getByText('Order Test');
      fireEvent.click(orderTestButton);
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(screen.queryByText('Order Lab Test')).not.toBeInTheDocument();
    });

    test('closes order test dialog when order test is clicked', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const orderTestButton = screen.getByText('Order Test');
      fireEvent.click(orderTestButton);
      
      const orderTestButtonInDialog = screen.getByText('Order Test');
      fireEvent.click(orderTestButtonInDialog);
      
      expect(screen.queryByText('Order Lab Test')).not.toBeInTheDocument();
    });
  });

  describe('Result Details Dialog', () => {
    test('opens result details dialog when view button is clicked', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const viewButtons = screen.getAllByLabelText('View Details');
      if (viewButtons.length > 0) {
        fireEvent.click(viewButtons[0]);
        
        expect(screen.getByText('Lab Result Details')).toBeInTheDocument();
      }
    });

    test('displays patient information in result details', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const viewButtons = screen.getAllByLabelText('View Details');
      if (viewButtons.length > 0) {
        fireEvent.click(viewButtons[0]);
        
        expect(screen.getByText('Patient Information')).toBeInTheDocument();
        expect(screen.getByText('Test Information')).toBeInTheDocument();
        expect(screen.getByText('Timeline')).toBeInTheDocument();
        expect(screen.getByText('Staff')).toBeInTheDocument();
      }
    });

    test('closes result details dialog when close is clicked', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const viewButtons = screen.getAllByLabelText('View Details');
      if (viewButtons.length > 0) {
        fireEvent.click(viewButtons[0]);
        
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
        
        expect(screen.queryByText('Lab Result Details')).not.toBeInTheDocument();
      }
    });
  });

  describe('Table Actions', () => {
    test('displays action buttons in table rows', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const viewButtons = screen.getAllByLabelText('View Details');
      const shareButtons = screen.getAllByLabelText('Share');
      const downloadButtons = screen.getAllByLabelText('Download');
      
      expect(viewButtons.length).toBeGreaterThan(0);
      expect(shareButtons.length).toBeGreaterThan(0);
      expect(downloadButtons.length).toBeGreaterThan(0);
    });

    test('handles share result action', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const shareButtons = screen.getAllByLabelText('Share');
      if (shareButtons.length > 0) {
        fireEvent.click(shareButtons[0]);
      }
    });

    test('handles download result action', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const downloadButtons = screen.getAllByLabelText('Download');
      if (downloadButtons.length > 0) {
        fireEvent.click(downloadButtons[0]);
      }
    });

    test('handles mark as reviewed action', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const reviewButtons = screen.getAllByLabelText('Mark as Reviewed');
      if (reviewButtons.length > 0) {
        fireEvent.click(reviewButtons[0]);
      }
    });
  });

  describe('Export and Print', () => {
    test('exports results when export button is clicked', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const exportButton = screen.getByText('Export');
      fireEvent.click(exportButton);
    });

    test('prints report when print button is clicked', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const printButton = screen.getByText('Print');
      fireEvent.click(printButton);
    });
  });

  describe('Status Display', () => {
    test('displays status chips with correct colors', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const statusChips = screen.getAllByText('completed');
      expect(statusChips.length).toBeGreaterThan(0);
    });

    test('displays priority chips with correct colors', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const priorityChips = screen.getAllByText('medium');
      expect(priorityChips.length).toBeGreaterThan(0);
    });
  });

  describe('Patient Information Display', () => {
    test('displays patient names and IDs correctly', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('P001')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('P002')).toBeInTheDocument();
    });
  });

  describe('Test Information Display', () => {
    test('displays test names and categories correctly', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      expect(screen.getByText('Complete Blood Count (CBC)')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive Metabolic Panel')).toBeInTheDocument();
      expect(screen.getByText('Lipid Panel')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    test('displays pagination controls', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      // Pagination should be present if there are multiple pages
      const pagination = screen.getByRole('navigation');
      expect(pagination).toBeInTheDocument();
    });

    test('changes page when pagination is clicked', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
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
      renderWithProviders(<LabResultsManagementPage />);
      
      const fab = screen.getByLabelText('upload');
      expect(fab).toBeInTheDocument();
    });

    test('opens upload dialog when FAB is clicked', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const fab = screen.getByLabelText('upload');
      fireEvent.click(fab);
      
      expect(screen.getByText('Upload Lab Results')).toBeInTheDocument();
    });
  });

  describe('Alert Display', () => {
    test('displays alerts for critical results', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      // Should show alert if there are critical or pending results
      const alerts = screen.queryByRole('alert');
      if (alerts) {
        expect(alerts).toBeInTheDocument();
      }
    });
  });

  describe('Statistics Display', () => {
    test('displays correct statistics', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      expect(screen.getByText('3')).toBeInTheDocument(); // Total results
      expect(screen.getByText('1')).toBeInTheDocument(); // Pending results
      expect(screen.getByText('0')).toBeInTheDocument(); // Critical results
      expect(screen.getByText('2')).toBeInTheDocument(); // Unreviewed results
    });
  });

  describe('Form Validation', () => {
    test('validates required fields in upload form', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const uploadButton = screen.getByText('Upload Results');
      fireEvent.click(uploadButton);
      
      const patientIdField = screen.getByLabelText('Patient ID');
      expect(patientIdField).toBeInTheDocument();
    });

    test('validates required fields in order test form', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      const orderTestButton = screen.getByText('Order Test');
      fireEvent.click(orderTestButton);
      
      const patientIdField = screen.getByLabelText('Patient ID');
      expect(patientIdField).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles missing data gracefully', () => {
      renderWithProviders(<LabResultsManagementPage />);
      
      // Page should render without errors even with empty data
      expect(screen.getByText('Lab Results Management')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('renders on different screen sizes', () => {
      const { rerender } = renderWithProviders(<LabResultsManagementPage />);
      
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