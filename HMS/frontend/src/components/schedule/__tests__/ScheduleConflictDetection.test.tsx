import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';
import ScheduleConflictDetection from '../ScheduleConflictDetection';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ScheduleConflictDetection', () => {
  const mockConflicts = [
    {
      id: '1',
      type: 'OVERLAP',
      severity: 'HIGH',
      description: 'Dr. Emily Davis and Dr. Robert Wilson have overlapping schedules',
      affectedDoctors: ['Dr. Emily Davis', 'Dr. Robert Wilson'],
      affectedResources: ['Room 301', 'Room 401'],
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      date: '2024-02-15',
      suggestedResolution: 'Reschedule Dr. Wilson to start at 10:00 AM',
      impact: 'High impact on patient scheduling',
      priority: 1,
    },
    {
      id: '2',
      type: 'RESOURCE_CONFLICT',
      severity: 'MEDIUM',
      description: 'Multiple doctors assigned to same examination room',
      affectedDoctors: ['Dr. Sarah Johnson', 'Dr. Michael Chen'],
      affectedResources: ['Room 101'],
      startTime: '10:00 AM',
      endTime: '06:00 PM',
      date: '2024-02-15',
      suggestedResolution: 'Assign Dr. Chen to Room 102',
      impact: 'Medium impact on resource allocation',
      priority: 2,
    },
  ];

  const mockOnResolve = jest.fn();
  const mockOnIgnore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the conflict detection component', () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    expect(screen.getByText('Detected Conflicts (2)')).toBeInTheDocument();
  });

  it('displays conflict statistics', () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument(); // High priority conflicts
    expect(screen.getByText('High Priority Conflicts')).toBeInTheDocument();
    expect(screen.getByText('Medium Priority Conflicts')).toBeInTheDocument();
  });

  it('displays conflicts list', () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    expect(screen.getByText('Dr. Emily Davis and Dr. Robert Wilson have overlapping schedules')).toBeInTheDocument();
    expect(screen.getByText('Multiple doctors assigned to same examination room')).toBeInTheDocument();
  });

  it('shows conflict severity chips', () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
  });

  it('shows conflict type chips', () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    expect(screen.getByText('OVERLAP')).toBeInTheDocument();
    expect(screen.getByText('RESOURCE CONFLICT')).toBeInTheDocument();
  });

  it('handles expand/collapse conflict details', () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    const expandButtons = screen.getAllByLabelText('View Details');
    fireEvent.click(expandButtons[0]);

    expect(screen.getByText('Impact Analysis')).toBeInTheDocument();
    expect(screen.getByText('Suggested Resolution')).toBeInTheDocument();
  });

  it('handles resolve conflict action', async () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    const resolveButtons = screen.getAllByLabelText('Resolve Conflict');
    fireEvent.click(resolveButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Resolve Conflict')).toBeInTheDocument();
    });
  });

  it('handles ignore conflict action', () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    const ignoreButtons = screen.getAllByLabelText('Ignore Conflict');
    fireEvent.click(ignoreButtons[0]);

    expect(mockOnIgnore).toHaveBeenCalledWith('1');
  });

  it('displays conflict details in resolve dialog', async () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    const resolveButtons = screen.getAllByLabelText('Resolve Conflict');
    fireEvent.click(resolveButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Conflict Details')).toBeInTheDocument();
      expect(screen.getByText('Dr. Emily Davis and Dr. Robert Wilson have overlapping schedules')).toBeInTheDocument();
      expect(screen.getByText('Your Resolution')).toBeInTheDocument();
    });
  });

  it('handles resolution submission', async () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    const resolveButtons = screen.getAllByLabelText('Resolve Conflict');
    fireEvent.click(resolveButtons[0]);

    await waitFor(() => {
      const resolutionInput = screen.getByPlaceholderText('Describe how you will resolve this conflict...');
      fireEvent.change(resolutionInput, { target: { value: 'Reschedule the appointment' } });
    });

    const resolveButton = screen.getByText('Resolve Conflict');
    fireEvent.click(resolveButton);

    expect(mockOnResolve).toHaveBeenCalledWith('1', 'Reschedule the appointment');
  });

  it('disables resolve button when no resolution provided', async () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    const resolveButtons = screen.getAllByLabelText('Resolve Conflict');
    fireEvent.click(resolveButtons[0]);

    await waitFor(() => {
      const resolveButton = screen.getByText('Resolve Conflict');
      expect(resolveButton).toBeDisabled();
    });
  });

  it('shows loading state', () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
        loading={true}
      />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays no conflicts message when empty', () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={[]}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    expect(screen.getByText('No conflicts detected. All schedules are properly aligned.')).toBeInTheDocument();
  });

  it('displays affected resources when available', () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    const expandButtons = screen.getAllByLabelText('View Details');
    fireEvent.click(expandButtons[0]);

    expect(screen.getByText('Affected Resources')).toBeInTheDocument();
    expect(screen.getByText('Room 301')).toBeInTheDocument();
    expect(screen.getByText('Room 401')).toBeInTheDocument();
  });

  it('sorts conflicts by priority', () => {
    const highPriorityConflict = {
      id: '3',
      type: 'CAPACITY_OVERFLOW',
      severity: 'HIGH',
      description: 'High priority conflict',
      affectedDoctors: ['Dr. Test'],
      affectedResources: [],
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      date: '2024-02-15',
      suggestedResolution: 'Test resolution',
      impact: 'High impact',
      priority: 3,
    };

    const conflictsWithPriority = [mockConflicts[1], highPriorityConflict, mockConflicts[0]];

    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={conflictsWithPriority}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    // High priority conflicts should appear first
    expect(screen.getByText('High priority conflict')).toBeInTheDocument();
  });

  it('handles error in resolve action', async () => {
    const mockOnResolveWithError = jest.fn().mockRejectedValue(new Error('Resolve failed'));

    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolveWithError}
        onIgnore={mockOnIgnore}
      />
    );

    const resolveButtons = screen.getAllByLabelText('Resolve Conflict');
    fireEvent.click(resolveButtons[0]);

    await waitFor(() => {
      const resolutionInput = screen.getByPlaceholderText('Describe how you will resolve this conflict...');
      fireEvent.change(resolutionInput, { target: { value: 'Test resolution' } });
    });

    const resolveButton = screen.getByText('Resolve Conflict');
    fireEvent.click(resolveButton);

    // Should handle errors gracefully
  });

  it('displays conflict date and time information', () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    expect(screen.getByText(/Date: 2\/15\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/Time: 09:00 AM - 05:00 PM/)).toBeInTheDocument();
  });

  it('shows affected doctors information', () => {
    renderWithProviders(
      <ScheduleConflictDetection
        conflicts={mockConflicts}
        onResolve={mockOnResolve}
        onIgnore={mockOnIgnore}
      />
    );

    expect(screen.getByText(/Affected: Dr. Emily Davis, Dr. Robert Wilson/)).toBeInTheDocument();
    expect(screen.getByText(/Affected: Dr. Sarah Johnson, Dr. Michael Chen/)).toBeInTheDocument();
  });
}); 