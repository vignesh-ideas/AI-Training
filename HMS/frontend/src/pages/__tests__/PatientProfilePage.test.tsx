import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import theme from '@/theme';
import PatientProfilePage from '../PatientProfilePage';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ patientId: 'PAT123' }),
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

describe('PatientProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders patient profile page', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Patient ID: PAT123')).toBeInTheDocument();
    });
  });

  it('displays patient information correctly', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('+1234567890')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('New York, NY')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    renderWithProviders(<PatientProfilePage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays quick stats cards', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Last Visit')).toBeInTheDocument();
      expect(screen.getByText('Next Appointment')).toBeInTheDocument();
      expect(screen.getByText('Blood Type')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
    });
  });

  it('displays action buttons', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByTitle('Edit Patient')).toBeInTheDocument();
      expect(screen.getByTitle('Print Profile')).toBeInTheDocument();
      expect(screen.getByTitle('Download Profile')).toBeInTheDocument();
      expect(screen.getByTitle('Share Profile')).toBeInTheDocument();
    });
  });

  it('displays tab navigation', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Information')).toBeInTheDocument();
      expect(screen.getByText('Medical History')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(screen.getByText('Timeline')).toBeInTheDocument();
      expect(screen.getByText('Statistics')).toBeInTheDocument();
    });
  });

  it('handles tab changes', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      const medicalHistoryTab = screen.getByText('Medical History');
      fireEvent.click(medicalHistoryTab);
    });
  });

  it('displays patient status chip', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    });
  });

  it('shows patient avatar with initials', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  it('displays contact information', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('+1234567890')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('New York, NY')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    // Mock failed API call
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch'));

    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load patient data')).toBeInTheDocument();
    });
  });

  it('displays patient age calculation', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      // Should display age based on date of birth
      expect(screen.getByText(/years old/)).toBeInTheDocument();
    });
  });

  it('shows medical information when available', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Medical Information')).toBeInTheDocument();
    });
  });

  it('displays emergency contact information', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
    });
  });

  it('shows insurance information when available', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Insurance Information')).toBeInTheDocument();
    });
  });

  it('displays registration information', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Registration Information')).toBeInTheDocument();
    });
  });

  it('handles print functionality', async () => {
    const mockPrint = jest.spyOn(window, 'print').mockImplementation(() => {});
    
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      const printButton = screen.getByTitle('Print Profile');
      fireEvent.click(printButton);
    });

    expect(mockPrint).toHaveBeenCalled();
    mockPrint.mockRestore();
  });

  it('handles download functionality', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      const downloadButton = screen.getByTitle('Download Profile');
      fireEvent.click(downloadButton);
    });
  });

  it('handles share functionality', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      const shareButton = screen.getByTitle('Share Profile');
      fireEvent.click(shareButton);
    });
  });

  it('displays patient documents count', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Documents')).toBeInTheDocument();
    });
  });

  it('shows patient timeline', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Timeline')).toBeInTheDocument();
    });
  });

  it('displays patient statistics', async () => {
    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Statistics')).toBeInTheDocument();
    });
  });

  it('handles missing patient data gracefully', async () => {
    // Mock empty patient data
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    } as Response);

    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Patient not found')).toBeInTheDocument();
    });
  });

  it('navigates back to patients list on error', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    renderWithProviders(<PatientProfilePage />);

    await waitFor(() => {
      const backButton = screen.getByText('Back to Patients');
      fireEvent.click(backButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/patients');
  });
}); 