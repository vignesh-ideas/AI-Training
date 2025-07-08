import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Toaster } from 'react-hot-toast';
import theme from '../../theme';
import EditMedicalRecordPage from '../EditMedicalRecordPage';

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

// Mock react-hot-toast
const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
};
jest.mock('react-hot-toast', () => ({
  toast: mockToast,
}));

// Mock MedicalRecordForm component
jest.mock('../../components/medical-record/MedicalRecordForm', () => {
  return function MockMedicalRecordForm({ onSubmit, onCancel, loading, mode, initialData }) {
    return (
      <div data-testid="medical-record-form">
        <button onClick={() => onSubmit({ test: 'data' })}>Submit Form</button>
        <button onClick={onCancel}>Cancel Form</button>
        <span>Loading: {loading.toString()}</span>
        <span>Mode: {mode}</span>
        <span>Has Initial Data: {initialData ? 'true' : 'false'}</span>
      </div>
    );
  };
});

const renderWithProviders = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <EditMedicalRecordPage />
          <Toaster />
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('EditMedicalRecordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '1' });
  });

  it('renders the page title', () => {
    renderWithProviders();

    expect(screen.getByText('Edit Medical Record')).toBeInTheDocument();
  });

  it('renders the info alert', () => {
    renderWithProviders();

    expect(screen.getByText(/Update the medical record information/)).toBeInTheDocument();
    expect(screen.getByText(/All changes will be logged for audit purposes/)).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    renderWithProviders();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('loads medical record data and renders form', async () => {
    renderWithProviders();

    // Initially shows loading
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // After loading, shows form
    await waitFor(() => {
      expect(screen.getByTestId('medical-record-form')).toBeInTheDocument();
      expect(screen.getByText('Mode: edit')).toBeInTheDocument();
      expect(screen.getByText('Has Initial Data: true')).toBeInTheDocument();
    });
  });

  it('handles form submission successfully', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId('medical-record-form')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Medical record updated successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/medical-records');
    });
  });

  it('handles form submission error', async () => {
    // Mock the onSubmit to throw an error
    const mockOnSubmit = jest.fn().mockRejectedValue(new Error('API Error'));
    
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId('medical-record-form')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to update medical record');
    });
  });

  it('handles cancel action', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId('medical-record-form')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel Form');
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/medical-records');
  });

  it('shows loading state during submission', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId('medical-record-form')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    // Check that loading state is shown
    expect(screen.getByText('Loading: true')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Loading: false')).toBeInTheDocument();
    });
  });

  it('handles fetch error and navigates back', async () => {
    // Mock fetch to throw an error
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockRejectedValue(new Error('Fetch failed'));

    renderWithProviders();

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to load medical record');
      expect(mockNavigate).toHaveBeenCalledWith('/medical-records');
    });

    global.fetch = originalFetch;
  });

  it('shows error message when record not found', async () => {
    // Mock fetch to return null
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(null),
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/Medical record not found/)).toBeInTheDocument();
    });

    global.fetch = originalFetch;
  });

  it('has correct meta tags', () => {
    renderWithProviders();

    // Check for helmet content
    const helmet = document.querySelector('title');
    expect(helmet).toHaveTextContent('Edit Medical Record - HMS');
  });

  it('renders within a card container', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId('medical-record-form')).toBeInTheDocument();
    });

    // The form should be wrapped in a Card component
    const card = screen.getByTestId('medical-record-form').closest('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('has proper container styling', () => {
    renderWithProviders();

    // Check that the page uses Container with proper maxWidth
    const container = screen.getByText('Edit Medical Record').closest('.MuiContainer-root');
    expect(container).toBeInTheDocument();
  });

  it('logs form data to console on successful submission', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId('medical-record-form')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Updating medical record:', { test: 'data' });
    });

    consoleSpy.mockRestore();
  });

  it('handles multiple rapid submissions', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId('medical-record-form')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit Form');
    
    // Click multiple times rapidly
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    // Should only process once due to loading state
    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledTimes(1);
    });
  });

  it('maintains form state during loading', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId('medical-record-form')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    // Form should still be visible during loading
    expect(screen.getByTestId('medical-record-form')).toBeInTheDocument();
    expect(screen.getByText('Loading: true')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Loading: false')).toBeInTheDocument();
    });
  });

  it('navigates to medical records list after successful submission', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId('medical-record-form')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/medical-records');
    });
  });

  it('does not navigate on submission error', async () => {
    // Mock the onSubmit to throw an error
    const mockOnSubmit = jest.fn().mockRejectedValue(new Error('API Error'));
    
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId('medical-record-form')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('has proper accessibility attributes', () => {
    renderWithProviders();

    // Check for proper heading structure
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Edit Medical Record');
  });

  it('renders alert with proper severity', () => {
    renderWithProviders();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('MuiAlert-standardInfo');
  });

  it('has proper spacing and layout', () => {
    renderWithProviders();

    // Check that the page has proper vertical spacing
    const container = screen.getByText('Edit Medical Record').closest('.MuiContainer-root');
    expect(container).toHaveClass('MuiContainer-maxWidthLg');
  });

  it('handles different record IDs', () => {
    mockUseParams.mockReturnValue({ id: '123' });
    
    renderWithProviders();

    expect(screen.getByText('Edit Medical Record')).toBeInTheDocument();
  });

  it('shows loading spinner during initial data fetch', () => {
    renderWithProviders();

    // Should show loading spinner initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles missing record ID', () => {
    mockUseParams.mockReturnValue({});
    
    renderWithProviders();

    expect(screen.getByText('Edit Medical Record')).toBeInTheDocument();
  });
}); 