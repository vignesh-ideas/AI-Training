import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Toaster } from 'react-hot-toast';
import theme from '../../theme';
import CreateMedicalRecordPage from '../CreateMedicalRecordPage';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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
  return function MockMedicalRecordForm({ onSubmit, onCancel, loading, mode }) {
    return (
      <div data-testid="medical-record-form">
        <button onClick={() => onSubmit({ test: 'data' })}>Submit Form</button>
        <button onClick={onCancel}>Cancel Form</button>
        <span>Loading: {loading.toString()}</span>
        <span>Mode: {mode}</span>
      </div>
    );
  };
});

const renderWithProviders = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CreateMedicalRecordPage />
          <Toaster />
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('CreateMedicalRecordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page title', () => {
    renderWithProviders();

    expect(screen.getByText('Create Medical Record')).toBeInTheDocument();
  });

  it('renders the info alert', () => {
    renderWithProviders();

    expect(screen.getByText(/Fill in the required information/)).toBeInTheDocument();
    expect(screen.getByText(/All fields marked with \* are required/)).toBeInTheDocument();
  });

  it('renders the MedicalRecordForm component', () => {
    renderWithProviders();

    expect(screen.getByTestId('medical-record-form')).toBeInTheDocument();
  });

  it('passes correct props to MedicalRecordForm', () => {
    renderWithProviders();

    expect(screen.getByText('Mode: create')).toBeInTheDocument();
  });

  it('handles form submission successfully', async () => {
    renderWithProviders();

    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Medical record created successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/medical-records');
    });
  });

  it('handles form submission error', async () => {
    // Mock the onSubmit to throw an error
    const mockOnSubmit = jest.fn().mockRejectedValue(new Error('API Error'));
    
    renderWithProviders();

    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to create medical record');
    });
  });

  it('handles cancel action', () => {
    renderWithProviders();

    const cancelButton = screen.getByText('Cancel Form');
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/medical-records');
  });

  it('shows loading state during submission', async () => {
    renderWithProviders();

    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    // Check that loading state is shown
    expect(screen.getByText('Loading: true')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Loading: false')).toBeInTheDocument();
    });
  });

  it('has correct meta tags', () => {
    renderWithProviders();

    // Check for helmet content
    const helmet = document.querySelector('title');
    expect(helmet).toHaveTextContent('Create Medical Record - HMS');
  });

  it('renders within a card container', () => {
    renderWithProviders();

    // The form should be wrapped in a Card component
    const card = screen.getByTestId('medical-record-form').closest('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('has proper container styling', () => {
    renderWithProviders();

    // Check that the page uses Container with proper maxWidth
    const container = screen.getByText('Create Medical Record').closest('.MuiContainer-root');
    expect(container).toBeInTheDocument();
  });

  it('logs form data to console on successful submission', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    renderWithProviders();

    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Creating medical record:', { test: 'data' });
    });

    consoleSpy.mockRestore();
  });

  it('handles multiple rapid submissions', async () => {
    renderWithProviders();

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
    expect(heading).toHaveTextContent('Create Medical Record');
  });

  it('renders alert with proper severity', () => {
    renderWithProviders();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('MuiAlert-standardInfo');
  });

  it('has proper spacing and layout', () => {
    renderWithProviders();

    // Check that the page has proper vertical spacing
    const container = screen.getByText('Create Medical Record').closest('.MuiContainer-root');
    expect(container).toHaveClass('MuiContainer-maxWidthLg');
  });
}); 