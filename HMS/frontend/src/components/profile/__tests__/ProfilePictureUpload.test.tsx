import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProfilePictureUpload from '../ProfilePictureUpload';
import { AuthProvider } from '@/hooks/useAuth';

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('ProfilePictureUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile picture upload component', () => {
    renderWithProviders(<ProfilePictureUpload />);

    expect(screen.getByText(/profile picture/i)).toBeInTheDocument();
    expect(screen.getByText(/upload profile picture/i)).toBeInTheDocument();
    expect(screen.getByText(/drag and drop an image here/i)).toBeInTheDocument();
    expect(screen.getByText(/choose file/i)).toBeInTheDocument();
  });

  it('shows current profile picture', () => {
    renderWithProviders(<ProfilePictureUpload />);

    expect(screen.getByText(/current picture/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('shows file format and size requirements', () => {
    renderWithProviders(<ProfilePictureUpload />);

    expect(screen.getByText(/jpg, png, gif up to 5mb/i)).toBeInTheDocument();
    expect(screen.getByText(/supported formats: jpg, png, gif/i)).toBeInTheDocument();
    expect(screen.getByText(/maximum size: 5mb/i)).toBeInTheDocument();
  });

  it('opens file dialog when choose file button is clicked', () => {
    renderWithProviders(<ProfilePictureUpload />);

    const chooseFileButton = screen.getByText(/choose file/i);
    fireEvent.click(chooseFileButton);

    // The file input should be triggered
    expect(chooseFileButton).toBeInTheDocument();
  });

  it('shows upload tips', () => {
    renderWithProviders(<ProfilePictureUpload />);

    expect(screen.getByText(/tips for a great profile picture/i)).toBeInTheDocument();
    expect(screen.getByText(/use a clear, high-quality image/i)).toBeInTheDocument();
    expect(screen.getByText(/ensure good lighting and contrast/i)).toBeInTheDocument();
    expect(screen.getByText(/center your face in the frame/i)).toBeInTheDocument();
    expect(screen.getByText(/use a professional or friendly expression/i)).toBeInTheDocument();
  });

  it('shows drag and drop area', () => {
    renderWithProviders(<ProfilePictureUpload />);

    const uploadArea = screen.getByText(/drag and drop an image here/i).closest('div');
    expect(uploadArea).toBeInTheDocument();
  });

  it('handles file selection via file input', () => {
    renderWithProviders(<ProfilePictureUpload />);

    const fileInput = screen.getByDisplayValue('') as HTMLInputElement;
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Should show preview and upload button
    expect(screen.getByText(/preview of new profile picture/i)).toBeInTheDocument();
    expect(screen.getByText(/upload picture/i)).toBeInTheDocument();
    expect(screen.getByText(/remove/i)).toBeInTheDocument();
  });

  it('shows error for invalid file type', () => {
    renderWithProviders(<ProfilePictureUpload />);

    const fileInput = screen.getByDisplayValue('') as HTMLInputElement;
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Should show error message
    expect(screen.getByText(/please select a valid image file/i)).toBeInTheDocument();
  });

  it('shows error for file size too large', () => {
    renderWithProviders(<ProfilePictureUpload />);

    const fileInput = screen.getByDisplayValue('') as HTMLInputElement;
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    // Should show error message
    expect(screen.getByText(/image size must be less than 5mb/i)).toBeInTheDocument();
  });

  it('removes preview when remove button is clicked', () => {
    renderWithProviders(<ProfilePictureUpload />);

    const fileInput = screen.getByDisplayValue('') as HTMLInputElement;
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    const removeButton = screen.getByText(/remove/i);
    fireEvent.click(removeButton);

    expect(screen.queryByText(/preview of new profile picture/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/upload picture/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/remove/i)).not.toBeInTheDocument();
  });

  it('shows upload button only when file is selected', () => {
    renderWithProviders(<ProfilePictureUpload />);

    // Initially, upload button should not be visible
    expect(screen.queryByText(/upload picture/i)).not.toBeInTheDocument();

    // Select a file
    const fileInput = screen.getByDisplayValue('') as HTMLInputElement;
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Upload button should now be visible
    expect(screen.getByText(/upload picture/i)).toBeInTheDocument();
  });

  it('shows remove button only when file is selected', () => {
    renderWithProviders(<ProfilePictureUpload />);

    // Initially, remove button should not be visible
    expect(screen.queryByText(/remove/i)).not.toBeInTheDocument();

    // Select a file
    const fileInput = screen.getByDisplayValue('') as HTMLInputElement;
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Remove button should now be visible
    expect(screen.getByText(/remove/i)).toBeInTheDocument();
  });

  it('handles drag and drop events', () => {
    renderWithProviders(<ProfilePictureUpload />);

    const uploadArea = screen.getByText(/drag and drop an image here/i).closest('div');

    // Simulate drag enter
    fireEvent.dragEnter(uploadArea!);
    expect(uploadArea).toHaveStyle({ borderColor: 'primary.main' });

    // Simulate drag leave
    fireEvent.dragLeave(uploadArea!);
    expect(uploadArea).not.toHaveStyle({ borderColor: 'primary.main' });
  });

  it('handles file drop', () => {
    renderWithProviders(<ProfilePictureUpload />);

    const uploadArea = screen.getByText(/drag and drop an image here/i).closest('div');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    // Simulate file drop
    fireEvent.drop(uploadArea!, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(screen.getByText(/preview of new profile picture/i)).toBeInTheDocument();
  });
}); 