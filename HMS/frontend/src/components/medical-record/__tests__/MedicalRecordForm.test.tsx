import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from '../../../theme';
import MedicalRecordForm from '../MedicalRecordForm';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

const defaultProps = {
  onSubmit: mockOnSubmit,
  onCancel: mockOnCancel,
  loading: false,
  mode: 'create',
};

const renderWithProviders = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MedicalRecordForm {...defaultProps} {...props} />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

describe('MedicalRecordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form tabs', () => {
    renderWithProviders();

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Medical Details')).toBeInTheDocument();
    expect(screen.getByText('Vital Signs')).toBeInTheDocument();
    expect(screen.getByText('Medications & Labs')).toBeInTheDocument();
    expect(screen.getByText('Attachments & Notes')).toBeInTheDocument();
  });

  it('renders basic information fields', () => {
    renderWithProviders();

    expect(screen.getByLabelText('Patient Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Patient ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Doctor Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Doctor ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Department *')).toBeInTheDocument();
    expect(screen.getByLabelText('Record Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Record Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description *')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Confidential Record')).toBeInTheDocument();
  });

  it('renders medical details fields when tab is clicked', () => {
    renderWithProviders();

    const medicalDetailsTab = screen.getByText('Medical Details');
    fireEvent.click(medicalDetailsTab);

    expect(screen.getByLabelText('Diagnosis *')).toBeInTheDocument();
    expect(screen.getByLabelText('Treatment Plan')).toBeInTheDocument();
  });

  it('renders vital signs fields when tab is clicked', () => {
    renderWithProviders();

    const vitalsTab = screen.getByText('Vital Signs');
    fireEvent.click(vitalsTab);

    expect(screen.getByLabelText('Blood Pressure')).toBeInTheDocument();
    expect(screen.getByLabelText('Heart Rate')).toBeInTheDocument();
    expect(screen.getByLabelText('Temperature')).toBeInTheDocument();
    expect(screen.getByLabelText('Oxygen Saturation')).toBeInTheDocument();
  });

  it('renders medications and labs fields when tab is clicked', () => {
    renderWithProviders();

    const medicationsTab = screen.getByText('Medications & Labs');
    fireEvent.click(medicationsTab);

    expect(screen.getByText('Medications')).toBeInTheDocument();
    expect(screen.getByText('Lab Results')).toBeInTheDocument();
    expect(screen.getByLabelText('Add Medication')).toBeInTheDocument();
    expect(screen.getByLabelText('Add Lab Result')).toBeInTheDocument();
  });

  it('renders attachments and notes fields when tab is clicked', () => {
    renderWithProviders();

    const attachmentsTab = screen.getByText('Attachments & Notes');
    fireEvent.click(attachmentsTab);

    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Attachments')).toBeInTheDocument();
    expect(screen.getByLabelText('Add Tag')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProviders();

    const submitButton = screen.getByText('Create Record');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Patient name is required')).toBeInTheDocument();
      expect(screen.getByText('Doctor name is required')).toBeInTheDocument();
      expect(screen.getByText('Department is required')).toBeInTheDocument();
      expect(screen.getByText('Record title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  it('fills form with initial data in edit mode', () => {
    const initialData = {
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      department: 'Cardiology',
      recordType: 'CONSULTATION',
      title: 'Test Record',
      description: 'Test description',
      diagnosis: 'Test diagnosis',
      treatment: 'Test treatment',
      medications: ['Medication 1', 'Medication 2'],
      labResults: ['Lab 1', 'Lab 2'],
      vitalSigns: {
        bloodPressure: '120/80',
        heartRate: '72',
        temperature: '98.6',
        oxygenSaturation: '95',
      },
      priority: 'HIGH',
      tags: ['Tag 1', 'Tag 2'],
      attachments: ['file1.pdf', 'file2.pdf'],
      notes: 'Test notes',
      isConfidential: true,
    };

    renderWithProviders({ initialData, mode: 'edit' });

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Record')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
  });

  it('adds medication when add button is clicked', () => {
    renderWithProviders();

    const medicationsTab = screen.getByText('Medications & Labs');
    fireEvent.click(medicationsTab);

    const medicationInput = screen.getByLabelText('Add Medication');
    const addButton = screen.getByText('Add Medication').closest('button');

    fireEvent.change(medicationInput, { target: { value: 'Aspirin' } });
    fireEvent.click(addButton!);

    expect(screen.getByText('Aspirin')).toBeInTheDocument();
  });

  it('adds medication when Enter key is pressed', () => {
    renderWithProviders();

    const medicationsTab = screen.getByText('Medications & Labs');
    fireEvent.click(medicationsTab);

    const medicationInput = screen.getByLabelText('Add Medication');
    fireEvent.change(medicationInput, { target: { value: 'Aspirin' } });
    fireEvent.keyPress(medicationInput, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Aspirin')).toBeInTheDocument();
  });

  it('removes medication when delete button is clicked', () => {
    renderWithProviders();

    const medicationsTab = screen.getByText('Medications & Labs');
    fireEvent.click(medicationsTab);

    const medicationInput = screen.getByLabelText('Add Medication');
    const addButton = screen.getByText('Add Medication').closest('button');

    fireEvent.change(medicationInput, { target: { value: 'Aspirin' } });
    fireEvent.click(addButton!);

    expect(screen.getByText('Aspirin')).toBeInTheDocument();

    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Aspirin')).not.toBeInTheDocument();
  });

  it('adds lab result when add button is clicked', () => {
    renderWithProviders();

    const medicationsTab = screen.getByText('Medications & Labs');
    fireEvent.click(medicationsTab);

    const labInput = screen.getByLabelText('Add Lab Result');
    const addButton = screen.getAllByText('Add Lab Result')[1].closest('button');

    fireEvent.change(labInput, { target: { value: 'Blood Test' } });
    fireEvent.click(addButton!);

    expect(screen.getByText('Blood Test')).toBeInTheDocument();
  });

  it('removes lab result when delete button is clicked', () => {
    renderWithProviders();

    const medicationsTab = screen.getByText('Medications & Labs');
    fireEvent.click(medicationsTab);

    const labInput = screen.getByLabelText('Add Lab Result');
    const addButton = screen.getAllByText('Add Lab Result')[1].closest('button');

    fireEvent.change(labInput, { target: { value: 'Blood Test' } });
    fireEvent.click(addButton!);

    expect(screen.getByText('Blood Test')).toBeInTheDocument();

    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[1]); // Second delete button for lab result

    expect(screen.queryByText('Blood Test')).not.toBeInTheDocument();
  });

  it('adds tag when add button is clicked', () => {
    renderWithProviders();

    const attachmentsTab = screen.getByText('Attachments & Notes');
    fireEvent.click(attachmentsTab);

    const tagInput = screen.getByLabelText('Add Tag');
    const addButton = screen.getAllByText('Add Tag')[1].closest('button');

    fireEvent.change(tagInput, { target: { value: 'Important' } });
    fireEvent.click(addButton!);

    expect(screen.getByText('Important')).toBeInTheDocument();
  });

  it('adds tag when Enter key is pressed', () => {
    renderWithProviders();

    const attachmentsTab = screen.getByText('Attachments & Notes');
    fireEvent.click(attachmentsTab);

    const tagInput = screen.getByLabelText('Add Tag');
    fireEvent.change(tagInput, { target: { value: 'Important' } });
    fireEvent.keyPress(tagInput, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Important')).toBeInTheDocument();
  });

  it('removes tag when delete button is clicked', () => {
    renderWithProviders();

    const attachmentsTab = screen.getByText('Attachments & Notes');
    fireEvent.click(attachmentsTab);

    const tagInput = screen.getByLabelText('Add Tag');
    const addButton = screen.getAllByText('Add Tag')[1].closest('button');

    fireEvent.change(tagInput, { target: { value: 'Important' } });
    fireEvent.click(addButton!);

    expect(screen.getByText('Important')).toBeInTheDocument();

    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Important')).not.toBeInTheDocument();
  });

  it('adds common tags when clicked', () => {
    renderWithProviders();

    const attachmentsTab = screen.getByText('Attachments & Notes');
    fireEvent.click(attachmentsTab);

    const followUpTag = screen.getByText('Follow-up Required');
    fireEvent.click(followUpTag);

    expect(screen.getByText('Follow-up Required')).toHaveClass('MuiChip-colorPrimary');
  });

  it('prevents duplicate tags', () => {
    renderWithProviders();

    const attachmentsTab = screen.getByText('Attachments & Notes');
    fireEvent.click(attachmentsTab);

    const tagInput = screen.getByLabelText('Add Tag');
    const addButton = screen.getAllByText('Add Tag')[1].closest('button');

    // Add tag first time
    fireEvent.change(tagInput, { target: { value: 'Important' } });
    fireEvent.click(addButton!);

    // Try to add same tag again
    fireEvent.change(tagInput, { target: { value: 'Important' } });
    fireEvent.click(addButton!);

    const importantTags = screen.getAllByText('Important');
    expect(importantTags).toHaveLength(1);
  });

  it('handles file upload', () => {
    renderWithProviders();

    const attachmentsTab = screen.getByText('Attachments & Notes');
    fireEvent.click(attachmentsTab);

    const fileInput = screen.getByLabelText('Upload Files');
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('removes attachment when delete button is clicked', () => {
    renderWithProviders();

    const attachmentsTab = screen.getByText('Attachments & Notes');
    fireEvent.click(attachmentsTab);

    const fileInput = screen.getByLabelText('Upload Files');
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('test.pdf')).toBeInTheDocument();

    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    renderWithProviders();

    // Fill required fields
    fireEvent.change(screen.getByLabelText('Patient Name *'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Doctor Name *'), { target: { value: 'Dr. Smith' } });
    fireEvent.change(screen.getByLabelText('Record Title *'), { target: { value: 'Test Record' } });
    fireEvent.change(screen.getByLabelText('Description *'), { target: { value: 'Test description' } });

    // Fill diagnosis
    const medicalDetailsTab = screen.getByText('Medical Details');
    fireEvent.click(medicalDetailsTab);
    fireEvent.change(screen.getByLabelText('Diagnosis *'), { target: { value: 'Test diagnosis' } });

    const submitButton = screen.getByText('Create Record');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        patientName: 'John Doe',
        doctorName: 'Dr. Smith',
        title: 'Test Record',
        description: 'Test description',
        diagnosis: 'Test diagnosis',
      }));
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    renderWithProviders();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows loading state when loading prop is true', () => {
    renderWithProviders({ loading: true });

    const submitButton = screen.getByText('Create Record');
    expect(submitButton).toBeDisabled();
  });

  it('shows correct button text based on mode', () => {
    renderWithProviders({ mode: 'create' });
    expect(screen.getByText('Create Record')).toBeInTheDocument();

    renderWithProviders({ mode: 'edit' });
    expect(screen.getByText('Update Record')).toBeInTheDocument();
  });

  it('handles vital signs input changes', () => {
    renderWithProviders();

    const vitalsTab = screen.getByText('Vital Signs');
    fireEvent.click(vitalsTab);

    const bloodPressureInput = screen.getByLabelText('Blood Pressure');
    fireEvent.change(bloodPressureInput, { target: { value: '120/80 mmHg' } });

    expect(bloodPressureInput).toHaveValue('120/80 mmHg');
  });

  it('handles department selection', () => {
    renderWithProviders();

    const departmentSelect = screen.getByLabelText('Department *');
    fireEvent.mouseDown(departmentSelect);

    const cardiologyOption = screen.getByText('Cardiology');
    fireEvent.click(cardiologyOption);

    expect(departmentSelect).toHaveValue('Cardiology');
  });

  it('handles record type selection', () => {
    renderWithProviders();

    const recordTypeSelect = screen.getByLabelText('Record Type');
    fireEvent.mouseDown(recordTypeSelect);

    const consultationOption = screen.getByText('Consultation');
    fireEvent.click(consultationOption);

    expect(recordTypeSelect).toHaveValue('CONSULTATION');
  });

  it('handles priority selection', () => {
    renderWithProviders();

    const prioritySelect = screen.getByLabelText('Priority');
    fireEvent.mouseDown(prioritySelect);

    const highOption = screen.getByText('High');
    fireEvent.click(highOption);

    expect(prioritySelect).toHaveValue('HIGH');
  });

  it('handles confidential record toggle', () => {
    renderWithProviders();

    const confidentialSwitch = screen.getByText('Confidential Record').closest('label')?.querySelector('input');
    fireEvent.click(confidentialSwitch!);

    expect(confidentialSwitch).toBeChecked();
  });

  it('clears validation errors when user starts typing', async () => {
    renderWithProviders();

    const submitButton = screen.getByText('Create Record');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Patient name is required')).toBeInTheDocument();
    });

    const patientNameInput = screen.getByLabelText('Patient Name *');
    fireEvent.change(patientNameInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.queryByText('Patient name is required')).not.toBeInTheDocument();
    });
  });
}); 