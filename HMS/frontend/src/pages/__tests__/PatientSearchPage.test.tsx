import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import theme from '@/theme';
import PatientSearchPage from '../PatientSearchPage';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

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

describe('PatientSearchPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders patient search page', async () => {
    renderWithProviders(<PatientSearchPage />);

    expect(screen.getByText('Patient Search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search patients by name/)).toBeInTheDocument();
  });

  it('displays search functionality', async () => {
    renderWithProviders(<PatientSearchPage />);

    const searchInput = screen.getByPlaceholderText(/Search patients by name/);
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'John' } });
  });

  it('shows loading state initially', () => {
    renderWithProviders(<PatientSearchPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays patient cards in grid view', async () => {
    renderWithProviders(<PatientSearchPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Michael Johnson')).toBeInTheDocument();
    });
  });

  it('displays patient information correctly', async () => {
    renderWithProviders(<PatientSearchPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('PAT001')).toBeInTheDocument();
      expect(screen.getByText('+1234567890')).toBeInTheDocument();
      expect(screen.getByText('New York, NY')).toBeInTheDocument();
    });
  });

  it('shows patient status chips', async () => {
    renderWithProviders(<PatientSearchPage />);

    await waitFor(() => {
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
      expect(screen.getByText('INACTIVE')).toBeInTheDocument();
    });
  });

  it('displays action buttons for each patient', async () => {
    renderWithProviders(<PatientSearchPage />);

    await waitFor(() => {
      expect(screen.getAllByTitle('View Profile')).toHaveLength(6);
      expect(screen.getAllByTitle('Edit Patient')).toHaveLength(6);
      expect(screen.getAllByTitle('Delete Patient')).toHaveLength(6);
    });
  });

  it('handles view mode toggle', async () => {
    renderWithProviders(<PatientSearchPage />);

    await waitFor(() => {
      const listViewButton = screen.getByTitle('List View');
      const gridViewButton = screen.getByTitle('Grid View');
      
      fireEvent.click(listViewButton);
      fireEvent.click(gridViewButton);
    });
  });

  it('shows filters when filter button is clicked', async () => {
    renderWithProviders(<PatientSearchPage />);

    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
      expect(screen.getByText('Blood Type')).toBeInTheDocument();
    });
  });

  it('handles status filter', async () => {
    renderWithProviders(<PatientSearchPage />);

    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    await waitFor(() => {
      const statusSelect = screen.getByLabelText('Status');
      fireEvent.mouseDown(statusSelect);
    });
  });

  it('handles gender filter', async () => {
    renderWithProviders(<PatientSearchPage />);

    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    await waitFor(() => {
      const genderSelect = screen.getByLabelText('Gender');
      fireEvent.mouseDown(genderSelect);
    });
  });

  it('handles blood type filter', async () => {
    renderWithProviders(<PatientSearchPage />);

    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    await waitFor(() => {
      const bloodTypeSelect = screen.getByLabelText('Blood Type');
      fireEvent.mouseDown(bloodTypeSelect);
    });
  });

  it('handles city filter', async () => {
    renderWithProviders(<PatientSearchPage />);

    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    await waitFor(() => {
      const citySelect = screen.getByLabelText('City');
      fireEvent.mouseDown(citySelect);
    });
  });

  it('handles date range filter', async () => {
    renderWithProviders(<PatientSearchPage />);

    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    await waitFor(() => {
      const startDateInput = screen.getByLabelText('Registration From');
      const endDateInput = screen.getByLabelText('Registration To');
      
      fireEvent.change(startDateInput, { target: { value: '2023-01-01' } });
      fireEvent.change(endDateInput, { target: { value: '2023-12-31' } });
    });
  });

  it('handles appointment filter', async () => {
    renderWithProviders(<PatientSearchPage />);

    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    await waitFor(() => {
      const appointmentCheckbox = screen.getByLabelText('Has Upcoming Appointment');
      fireEvent.click(appointmentCheckbox);
    });
  });

  it('clears all filters', async () => {
    renderWithProviders(<PatientSearchPage />);

    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    await waitFor(() => {
      const clearButton = screen.getByText('Clear All Filters');
      fireEvent.click(clearButton);
    });
  });

  it('displays results summary', async () => {
    renderWithProviders(<PatientSearchPage />);

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 of 6 patients/)).toBeInTheDocument();
    });
  });

  it('handles patient deletion', async () => {
    const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true);

    renderWithProviders(<PatientSearchPage />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByTitle('Delete Patient');
      fireEvent.click(deleteButtons[0]);
    });

    expect(mockConfirm).toHaveBeenCalled();
    mockConfirm.mockRestore();
  });

  it('handles export functionality', async () => {
    renderWithProviders(<PatientSearchPage />);

    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);
  });

  it('handles print functionality', async () => {
    renderWithProviders(<PatientSearchPage />);

    const printButton = screen.getByText('Print');
    fireEvent.click(printButton);
  });

  it('navigates to add patient page', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    renderWithProviders(<PatientSearchPage />);

    const addButton = screen.getByText('Add Patient');
    fireEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith('/patient/register');
  });

  it('shows patient details dialog', async () => {
    renderWithProviders(<PatientSearchPage />);

    await waitFor(() => {
      const viewButtons = screen.getAllByTitle('View Profile');
      fireEvent.click(viewButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Patient Details')).toBeInTheDocument();
    });
  });

  it('displays patient age calculation', async () => {
    renderWithProviders(<PatientSearchPage />);

    await waitFor(() => {
      expect(screen.getByText(/years/)).toBeInTheDocument();
    });
  });

  it('shows patient contact information', async () => {
    renderWithProviders(<PatientSearchPage />);

    await waitFor(() => {
      expect(screen.getByText('+1234567890')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
  });

  it('displays patient location', async () => {
    renderWithProviders(<PatientSearchPage />);

    await waitFor(() => {
      expect(screen.getByText('New York, NY')).toBeInTheDocument();
      expect(screen.getByText('Los Angeles, CA')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    renderWithProviders(<PatientSearchPage />);

    const searchInput = screen.getByPlaceholderText(/Search patients by name/);
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('filters patients by status', async () => {
    renderWithProviders(<PatientSearchPage />);

    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    await waitFor(() => {
      const statusSelect = screen.getByLabelText('Status');
      fireEvent.mouseDown(statusSelect);
      
      const activeOption = screen.getByText('Active');
      fireEvent.click(activeOption);
    });
  });

  it('shows no results message when no patients match', async () => {
    renderWithProviders(<PatientSearchPage />);

    const searchInput = screen.getByPlaceholderText(/Search patients by name/);
    fireEvent.change(searchInput, { target: { value: 'NonExistentPatient' } });

    await waitFor(() => {
      expect(screen.getByText('No Patients Found')).toBeInTheDocument();
    });
  });

  it('displays pagination when needed', async () => {
    // Mock more patients to trigger pagination
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => Array.from({ length: 20 }, (_, i) => ({
        id: `PAT${i + 1}`,
        firstName: `Patient${i + 1}`,
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
        bloodType: 'O+',
        phoneNumber: '+1234567890',
        city: 'Test City',
        state: 'TS',
        status: 'ACTIVE',
        lastVisit: '2024-01-01',
        registrationDate: '2023-01-01',
      })),
    } as Response);

    renderWithProviders(<PatientSearchPage />);

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch'));

    renderWithProviders(<PatientSearchPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load patients')).toBeInTheDocument();
    });
  });
}); 