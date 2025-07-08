import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from '@/theme';
import AppointmentSearch from '../AppointmentSearch';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </LocalizationProvider>
  );
};

describe('AppointmentSearch', () => {
  const mockFilters = {
    searchTerm: '',
    status: 'all',
    type: 'all',
    department: 'all',
    doctor: '',
    patient: '',
    startDate: null,
    endDate: null,
    dateRange: 'all',
  };

  const mockOnFiltersChange = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search component', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('Search & Filters')).toBeInTheDocument();
  });

  it('displays search input', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByPlaceholderText('Search by patient name, doctor, department, or reason...')).toBeInTheDocument();
  });

  it('displays status filter', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('displays type filter', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByLabelText('Type')).toBeInTheDocument();
  });

  it('handles search term change', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search by patient name, doctor, department, or reason...');
    fireEvent.change(searchInput, { target: { value: 'John Doe' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      searchTerm: 'John Doe',
    });
  });

  it('handles status filter change', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    const statusSelect = screen.getByLabelText('Status');
    fireEvent.mouseDown(statusSelect);

    waitFor(() => {
      const scheduledOption = screen.getByText('Scheduled');
      fireEvent.click(scheduledOption);
    });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      status: 'SCHEDULED',
    });
  });

  it('handles type filter change', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    const typeSelect = screen.getByLabelText('Type');
    fireEvent.mouseDown(typeSelect);

    waitFor(() => {
      const consultationOption = screen.getByText('Consultation');
      fireEvent.click(consultationOption);
    });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      type: 'CONSULTATION',
    });
  });

  it('handles search button click', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalled();
  });

  it('handles clear filters button click', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalled();
  });

  it('shows advanced filters when expanded', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    const expandButton = screen.getByLabelText('Show Advanced Filters');
    fireEvent.click(expandButton);

    expect(screen.getByText('Advanced Filters')).toBeInTheDocument();
    expect(screen.getByLabelText('Department')).toBeInTheDocument();
    expect(screen.getByLabelText('Doctor Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Patient Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Date Range')).toBeInTheDocument();
  });

  it('handles department filter change', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    // Expand advanced filters first
    const expandButton = screen.getByLabelText('Show Advanced Filters');
    fireEvent.click(expandButton);

    const departmentSelect = screen.getByLabelText('Department');
    fireEvent.mouseDown(departmentSelect);

    waitFor(() => {
      const cardiologyOption = screen.getByText('Cardiology');
      fireEvent.click(cardiologyOption);
    });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      department: 'Cardiology',
    });
  });

  it('handles doctor name filter change', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    // Expand advanced filters first
    const expandButton = screen.getByLabelText('Show Advanced Filters');
    fireEvent.click(expandButton);

    const doctorInput = screen.getByLabelText('Doctor Name');
    fireEvent.change(doctorInput, { target: { value: 'Dr. Smith' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      doctor: 'Dr. Smith',
    });
  });

  it('handles patient name filter change', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    // Expand advanced filters first
    const expandButton = screen.getByLabelText('Show Advanced Filters');
    fireEvent.click(expandButton);

    const patientInput = screen.getByLabelText('Patient Name');
    fireEvent.change(patientInput, { target: { value: 'John Doe' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      patient: 'John Doe',
    });
  });

  it('handles date range filter change', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    // Expand advanced filters first
    const expandButton = screen.getByLabelText('Show Advanced Filters');
    fireEvent.click(expandButton);

    const dateRangeSelect = screen.getByLabelText('Date Range');
    fireEvent.mouseDown(dateRangeSelect);

    waitFor(() => {
      const todayOption = screen.getByText('Today');
      fireEvent.click(todayOption);
    });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      dateRange: 'today',
    });
  });

  it('shows custom date inputs when custom range is selected', () => {
    const filtersWithCustomRange = {
      ...mockFilters,
      dateRange: 'custom',
    };

    renderWithProviders(
      <AppointmentSearch
        filters={filtersWithCustomRange}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    // Expand advanced filters first
    const expandButton = screen.getByLabelText('Show Advanced Filters');
    fireEvent.click(expandButton);

    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
  });

  it('displays active filters count', () => {
    const filtersWithActiveFilters = {
      ...mockFilters,
      searchTerm: 'John',
      status: 'SCHEDULED',
      type: 'CONSULTATION',
    };

    renderWithProviders(
      <AppointmentSearch
        filters={filtersWithActiveFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('3 active filters')).toBeInTheDocument();
  });

  it('displays active filter chips', () => {
    const filtersWithActiveFilters = {
      ...mockFilters,
      searchTerm: 'John',
      status: 'SCHEDULED',
      type: 'CONSULTATION',
    };

    renderWithProviders(
      <AppointmentSearch
        filters={filtersWithActiveFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('Search: John')).toBeInTheDocument();
    expect(screen.getByText('Status: Scheduled')).toBeInTheDocument();
    expect(screen.getByText('Type: Consultation')).toBeInTheDocument();
  });

  it('handles filter chip deletion', () => {
    const filtersWithActiveFilters = {
      ...mockFilters,
      searchTerm: 'John',
    };

    renderWithProviders(
      <AppointmentSearch
        filters={filtersWithActiveFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    const searchChip = screen.getByText('Search: John');
    const deleteButton = searchChip.parentElement?.querySelector('[data-testid="CancelIcon"]');
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
    }

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...filtersWithActiveFilters,
      searchTerm: '',
    });
  });

  it('shows loading state', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        loading={true}
      />
    );

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('disables search button when loading', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        loading={true}
      />
    );

    const searchButton = screen.getByText('Searching...');
    expect(searchButton).toBeDisabled();
  });

  it('displays all status options', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    const statusSelect = screen.getByLabelText('Status');
    fireEvent.mouseDown(statusSelect);

    waitFor(() => {
      expect(screen.getByText('All Status')).toBeInTheDocument();
      expect(screen.getByText('Scheduled')).toBeInTheDocument();
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Cancelled')).toBeInTheDocument();
      expect(screen.getByText('No Show')).toBeInTheDocument();
    });
  });

  it('displays all type options', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    const typeSelect = screen.getByLabelText('Type');
    fireEvent.mouseDown(typeSelect);

    waitFor(() => {
      expect(screen.getByText('All Types')).toBeInTheDocument();
      expect(screen.getByText('Consultation')).toBeInTheDocument();
      expect(screen.getByText('Follow-up')).toBeInTheDocument();
      expect(screen.getByText('Lab Test')).toBeInTheDocument();
      expect(screen.getByText('Physical Exam')).toBeInTheDocument();
      expect(screen.getByText('Emergency')).toBeInTheDocument();
    });
  });

  it('displays all department options', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    // Expand advanced filters first
    const expandButton = screen.getByLabelText('Show Advanced Filters');
    fireEvent.click(expandButton);

    const departmentSelect = screen.getByLabelText('Department');
    fireEvent.mouseDown(departmentSelect);

    waitFor(() => {
      expect(screen.getByText('All Departments')).toBeInTheDocument();
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
      expect(screen.getByText('Neurology')).toBeInTheDocument();
      expect(screen.getByText('Dermatology')).toBeInTheDocument();
      expect(screen.getByText('Orthopedics')).toBeInTheDocument();
      expect(screen.getByText('General Medicine')).toBeInTheDocument();
    });
  });

  it('displays all date range options', () => {
    renderWithProviders(
      <AppointmentSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onSearch={mockOnSearch}
        onClear={mockOnClear}
      />
    );

    // Expand advanced filters first
    const expandButton = screen.getByLabelText('Show Advanced Filters');
    fireEvent.click(expandButton);

    const dateRangeSelect = screen.getByLabelText('Date Range');
    fireEvent.mouseDown(dateRangeSelect);

    waitFor(() => {
      expect(screen.getByText('All Dates')).toBeInTheDocument();
      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('Tomorrow')).toBeInTheDocument();
      expect(screen.getByText('This Week')).toBeInTheDocument();
      expect(screen.getByText('Next Week')).toBeInTheDocument();
      expect(screen.getByText('This Month')).toBeInTheDocument();
      expect(screen.getByText('Custom Range')).toBeInTheDocument();
    });
  });
}); 