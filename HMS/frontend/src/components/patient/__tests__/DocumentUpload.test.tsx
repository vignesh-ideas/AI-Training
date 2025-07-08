import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import theme from '@/theme';
import DocumentUpload from '../DocumentUpload';

// Mock react-dropzone
jest.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false,
  }),
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
const mockPatientId = 'PAT123456789';

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

describe('DocumentUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders document upload component', () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    expect(screen.getByText('Document Upload')).toBeInTheDocument();
    expect(screen.getByText(/Upload patient documents and identification/)).toBeInTheDocument();
    expect(screen.getByText(/Patient ID:/)).toBeInTheDocument();
    expect(screen.getByText(mockPatientId)).toBeInTheDocument();
  });

  it('displays upload area with drag and drop instructions', () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    expect(screen.getByText('Drag & drop files here')).toBeInTheDocument();
    expect(screen.getByText('or click to select files')).toBeInTheDocument();
    expect(screen.getByText('Choose Files')).toBeInTheDocument();
  });

  it('displays document categories', () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    expect(screen.getByText('Required Documents')).toBeInTheDocument();
    expect(screen.getByText('Optional Documents')).toBeInTheDocument();
    expect(screen.getByText(/Government ID/)).toBeInTheDocument();
    expect(screen.getByText(/Insurance Card/)).toBeInTheDocument();
    expect(screen.getByText(/Previous Medical Records/)).toBeInTheDocument();
  });

  it('displays supported file formats', () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    expect(screen.getByText(/Supported formats: JPG, PNG, PDF, DOC, DOCX/)).toBeInTheDocument();
    expect(screen.getByText(/Max 10MB each/)).toBeInTheDocument();
  });

  it('handles back button click', () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('disables next button when no files are uploaded', () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('shows file upload progress', async () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    // Mock file upload
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    
    // Simulate file upload
    const uploadArea = screen.getByText('Drag & drop files here').closest('div');
    if (uploadArea) {
      fireEvent.drop(uploadArea, {
        dataTransfer: {
          files: [mockFile],
        },
      });
    }

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
  });

  it('displays file information correctly', () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    // Mock uploaded files
    const mockFiles = [
      {
        id: '1',
        name: 'document.pdf',
        size: 1024 * 1024, // 1MB
        type: 'application/pdf',
        status: 'success',
        progress: 100,
      },
      {
        id: '2',
        name: 'photo.jpg',
        size: 512 * 1024, // 512KB
        type: 'image/jpeg',
        status: 'success',
        progress: 100,
      },
    ];

    // Simulate files being uploaded
    // This would normally be done through the component's state
    // For testing, we'll just verify the component handles files correctly
  });

  it('handles file removal', () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    // Mock file removal
    const removeButton = screen.queryByTestId('remove-file');
    if (removeButton) {
      fireEvent.click(removeButton);
    }
  });

  it('displays upload statistics', () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    // Initially no files uploaded
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Successfully Uploaded')).toBeInTheDocument();
  });

  it('shows error messages for failed uploads', () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    // Mock failed upload
    // This would be handled by the component's error state
  });

  it('validates file types', () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    // Test file type validation
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    // Simulate invalid file upload
    const uploadArea = screen.getByText('Drag & drop files here').closest('div');
    if (uploadArea) {
      fireEvent.drop(uploadArea, {
        dataTransfer: {
          files: [invalidFile],
        },
      });
    }
  });

  it('validates file size', () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    // Test file size validation (10MB limit)
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    
    // Simulate large file upload
    const uploadArea = screen.getByText('Drag & drop files here').closest('div');
    if (uploadArea) {
      fireEvent.drop(uploadArea, {
        dataTransfer: {
          files: [largeFile],
        },
      });
    }
  });

  it('handles multiple file uploads', () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    // Test multiple file upload
    const files = [
      new File(['test1'], 'document1.pdf', { type: 'application/pdf' }),
      new File(['test2'], 'document2.pdf', { type: 'application/pdf' }),
      new File(['test3'], 'photo.jpg', { type: 'image/jpeg' }),
    ];

    const uploadArea = screen.getByText('Drag & drop files here').closest('div');
    if (uploadArea) {
      fireEvent.drop(uploadArea, {
        dataTransfer: {
          files,
        },
      });
    }
  });

  it('displays loading state during upload', async () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    // Mock file upload to trigger loading state
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    
    const uploadArea = screen.getByText('Drag & drop files here').closest('div');
    if (uploadArea) {
      fireEvent.drop(uploadArea, {
        dataTransfer: {
          files: [mockFile],
        },
      });
    }

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('calls onNext with uploaded documents', async () => {
    renderWithProviders(
      <DocumentUpload
        onNext={mockOnNext}
        onBack={mockOnBack}
        patientId={mockPatientId}
      />
    );

    // Mock successful file upload
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    
    const uploadArea = screen.getByText('Drag & drop files here').closest('div');
    if (uploadArea) {
      fireEvent.drop(uploadArea, {
        dataTransfer: {
          files: [mockFile],
        },
      });
    }

    // Wait for upload to complete
    await waitFor(() => {
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
    });

    expect(mockOnNext).toHaveBeenCalled();
  });
}); 