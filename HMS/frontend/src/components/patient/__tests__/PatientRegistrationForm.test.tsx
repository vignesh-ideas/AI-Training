import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import theme from '@/theme';
import PatientRegistrationForm from '../PatientRegistrationForm';

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (fn: any) => fn,
    watch: jest.fn(),
    formState: { errors: {} },
  }),
  Controller: ({ render }: any) => render({ field: {} }),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockOnNext = jest.fn();
const mockOnBack = jest.fn();

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

describe('PatientRegistrationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders patient registration form', () => {
    renderWithProviders(
      <PatientRegistrationForm onNext={mockOnNext} onBack={mockOnBack} />
    );

    expect(screen.getByText('Patient Information')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Address Information')).toBeInTheDocument();
    expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
    expect(screen.getByText('Insurance Information')).toBeInTheDocument();
    expect(screen.getByText('Medical Information')).toBeInTheDocument();
  });

  it('displays form fields correctly', () => {
    renderWithProviders(
      <PatientRegistrationForm onNext={mockOnNext} onBack={mockOnBack} />
    );

    // Personal Information fields
    expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Blood Type/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument();

    // Address fields
    expect(screen.getByLabelText(/Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/)).toBeInTheDocument();
    expect(screen.getByLabelText(/ZIP Code/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/)).toBeInTheDocument();

    // Emergency Contact fields
    expect(screen.getByLabelText(/Emergency Contact Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Relationship/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Emergency Contact Phone/)).toBeInTheDocument();
  });

  it('handles back button click', () => {
    renderWithProviders(
      <PatientRegistrationForm onNext={mockOnNext} onBack={mockOnBack} />
    );

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('handles form submission', async () => {
    renderWithProviders(
      <PatientRegistrationForm onNext={mockOnNext} onBack={mockOnBack} />
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalled();
    });
  });

  it('displays insurance fields when insurance checkbox is checked', () => {
    renderWithProviders(
      <PatientRegistrationForm onNext={mockOnNext} onBack={mockOnBack} />
    );

    const insuranceCheckbox = screen.getByLabelText(/Patient has insurance/);
    fireEvent.click(insuranceCheckbox);

    expect(screen.getByLabelText(/Insurance Provider/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Insurance Number/)).toBeInTheDocument();
  });

  it('displays medical condition fields when checkboxes are checked', () => {
    renderWithProviders(
      <PatientRegistrationForm onNext={mockOnNext} onBack={mockOnBack} />
    );

    // Check allergies checkbox
    const allergiesCheckbox = screen.getByLabelText(/Patient has allergies/);
    fireEvent.click(allergiesCheckbox);
    expect(screen.getByLabelText(/Allergies/)).toBeInTheDocument();

    // Check medical conditions checkbox
    const medicalConditionsCheckbox = screen.getByLabelText(/Patient has medical conditions/);
    fireEvent.click(medicalConditionsCheckbox);
    expect(screen.getByLabelText(/Medical Conditions/)).toBeInTheDocument();

    // Check current medications checkbox
    const currentMedicationsCheckbox = screen.getByLabelText(/Patient is taking current medications/);
    fireEvent.click(currentMedicationsCheckbox);
    expect(screen.getByLabelText(/Current Medications/)).toBeInTheDocument();
  });

  it('shows loading state during submission', async () => {
    renderWithProviders(
      <PatientRegistrationForm onNext={mockOnNext} onBack={mockOnBack} />
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('displays required field indicators', () => {
    renderWithProviders(
      <PatientRegistrationForm onNext={mockOnNext} onBack={mockOnBack} />
    );

    const requiredFields = [
      'First Name *',
      'Last Name *',
      'Date of Birth *',
      'Gender *',
      'Blood Type *',
      'Phone Number *',
      'Address *',
      'City *',
      'State *',
      'ZIP Code *',
      'Country *',
      'Marital Status *',
      'Emergency Contact Name *',
      'Relationship *',
      'Emergency Contact Phone *',
    ];

    requiredFields.forEach(field => {
      expect(screen.getByText(field)).toBeInTheDocument();
    });
  });

  it('displays help text for form sections', () => {
    renderWithProviders(
      <PatientRegistrationForm onNext={mockOnNext} onBack={mockOnBack} />
    );

    expect(screen.getByText(/Please provide comprehensive patient information/)).toBeInTheDocument();
    expect(screen.getByText(/All fields marked with \* are required/)).toBeInTheDocument();
  });

  it('handles form validation errors', () => {
    // Mock form errors
    jest.doMock('react-hook-form', () => ({
      useForm: () => ({
        control: {},
        handleSubmit: (fn: any) => fn,
        watch: jest.fn(),
        formState: {
          errors: {
            firstName: { message: 'First name is required' },
            lastName: { message: 'Last name is required' },
          },
        },
      }),
      Controller: ({ render }: any) => render({ field: {} }),
    }));

    renderWithProviders(
      <PatientRegistrationForm onNext={mockOnNext} onBack={mockOnBack} />
    );

    // Error messages should be displayed
    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
  });
}); 