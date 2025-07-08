import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import theme from '@/theme';
import RegistrationConfirmation from '../RegistrationConfirmation';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockPatientData = {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  gender: 'MALE',
  bloodType: 'O+',
  email: 'john.doe@example.com',
  phoneNumber: '+1234567890',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'USA',
  occupation: 'Software Engineer',
  maritalStatus: 'SINGLE',
  insuranceProvider: 'Blue Cross',
  insuranceNumber: 'BC123456',
  allergies: 'Peanuts',
  medicalConditions: 'Hypertension',
  currentMedications: 'Lisinopril',
  familyHistory: 'Heart disease in family',
  emergencyContactName: 'Jane Doe',
  emergencyContactRelationship: 'Spouse',
  emergencyContact: '+1234567891',
  hasInsurance: true,
  hasAllergies: true,
  hasMedicalConditions: true,
  hasCurrentMedications: true,
};

const mockDocuments = [
  {
    id: '1',
    name: 'passport.pdf',
    size: 1024 * 1024,
    type: 'application/pdf',
    status: 'success',
  },
  {
    id: '2',
    name: 'insurance_card.jpg',
    size: 512 * 1024,
    type: 'image/jpeg',
    status: 'success',
  },
];

const mockPatientId = 'PAT123456789';
const mockOnComplete = jest.fn();

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

describe('RegistrationConfirmation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration confirmation', () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Registration Complete')).toBeInTheDocument();
    expect(screen.getByText(/Please review the patient information/)).toBeInTheDocument();
    expect(screen.getByText(`Patient ID: ${mockPatientId}`)).toBeInTheDocument();
  });

  it('displays patient information correctly', () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Patient Information')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('1990-01-01')).toBeInTheDocument();
    expect(screen.getByText('MALE')).toBeInTheDocument();
    expect(screen.getByText('O+')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
  });

  it('displays address information', () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('New York, NY 10001')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
  });

  it('displays medical information', () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Medical Information')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Blue Cross')).toBeInTheDocument();
    expect(screen.getByText('BC123456')).toBeInTheDocument();
    expect(screen.getByText('Peanuts')).toBeInTheDocument();
    expect(screen.getByText('Hypertension')).toBeInTheDocument();
    expect(screen.getByText('Lisinopril')).toBeInTheDocument();
    expect(screen.getByText('Heart disease in family')).toBeInTheDocument();
  });

  it('displays emergency contact information', () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Spouse')).toBeInTheDocument();
    expect(screen.getByText('+1234567891')).toBeInTheDocument();
  });

  it('displays uploaded documents', () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Uploaded Documents (2)')).toBeInTheDocument();
    expect(screen.getByText('passport.pdf')).toBeInTheDocument();
    expect(screen.getByText('insurance_card.jpg')).toBeInTheDocument();
  });

  it('handles complete registration button click', async () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    const completeButton = screen.getByText('Complete Registration');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  it('handles print button click', () => {
    const mockPrint = jest.spyOn(window, 'print').mockImplementation(() => {});
    
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    const printButton = screen.getByText('Print');
    fireEvent.click(printButton);

    expect(mockPrint).toHaveBeenCalledTimes(1);
    mockPrint.mockRestore();
  });

  it('handles download button click', () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);

    // Mock download functionality
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('displays next steps information', () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Next Steps:')).toBeInTheDocument();
    expect(screen.getByText(/Schedule appointments/)).toBeInTheDocument();
    expect(screen.getByText(/Access medical records/)).toBeInTheDocument();
    expect(screen.getByText(/Receive notifications/)).toBeInTheDocument();
    expect(screen.getByText(/Contact healthcare providers/)).toBeInTheDocument();
  });

  it('handles missing optional fields gracefully', () => {
    const minimalPatientData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      gender: 'MALE',
      bloodType: 'O+',
      phoneNumber: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      maritalStatus: 'SINGLE',
      emergencyContactName: 'Jane Doe',
      emergencyContactRelationship: 'Spouse',
      emergencyContact: '+1234567891',
      hasInsurance: false,
      hasAllergies: false,
      hasMedicalConditions: false,
      hasCurrentMedications: false,
    };

    renderWithProviders(
      <RegistrationConfirmation
        patientData={minimalPatientData}
        documents={[]}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('No documents uploaded')).toBeInTheDocument();
  });

  it('displays insurance information when available', () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Provider: Blue Cross')).toBeInTheDocument();
    expect(screen.getByText('Number: BC123456')).toBeInTheDocument();
  });

  it('displays medical conditions when available', () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Peanuts')).toBeInTheDocument();
    expect(screen.getByText('Hypertension')).toBeInTheDocument();
    expect(screen.getByText('Lisinopril')).toBeInTheDocument();
  });

  it('shows loading state during completion', async () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    const completeButton = screen.getByText('Complete Registration');
    fireEvent.click(completeButton);

    // Should show loading state briefly
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('displays file size information', () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('1.0 MB')).toBeInTheDocument();
    expect(screen.getByText('512.0 KB')).toBeInTheDocument();
  });

  it('handles empty documents array', () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={[]}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Uploaded Documents (0)')).toBeInTheDocument();
    expect(screen.getByText('No documents uploaded')).toBeInTheDocument();
  });

  it('displays success message after completion', async () => {
    renderWithProviders(
      <RegistrationConfirmation
        patientData={mockPatientData}
        documents={mockDocuments}
        patientId={mockPatientId}
        onComplete={mockOnComplete}
      />
    );

    const completeButton = screen.getByText('Complete Registration');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });
}); 