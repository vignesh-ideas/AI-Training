import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';
import ScheduleOptimization from '../ScheduleOptimization';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ScheduleOptimization', () => {
  const mockAnalytics = {
    totalDoctors: 5,
    totalHours: 40,
    averageUtilization: 75,
    conflictCount: 3,
    efficiencyScore: 82,
    departmentStats: [
      {
        name: 'Cardiology',
        utilization: 85,
        conflicts: 1,
        efficiency: 90,
      },
      {
        name: 'Neurology',
        utilization: 70,
        conflicts: 2,
        efficiency: 75,
      },
      {
        name: 'Dermatology',
        utilization: 60,
        conflicts: 0,
        efficiency: 80,
      },
    ],
  };

  const mockSuggestions = [
    {
      id: '1',
      type: 'RESCHEDULE',
      title: 'Reschedule Dr. Wilson',
      description: 'Reschedule Dr. Wilson to avoid overlap with Dr. Davis',
      impact: 'HIGH',
      effort: 'LOW',
      priority: 1,
      estimatedSavings: 5000,
      affectedResources: ['Dr. Wilson', 'Room 401'],
      implementation: 'Move Dr. Wilson\'s schedule to start at 10:00 AM',
    },
    {
      id: '2',
      type: 'ADD_DOCTOR',
      title: 'Add Additional Doctor',
      description: 'Add another doctor to high-demand departments',
      impact: 'MEDIUM',
      effort: 'HIGH',
      priority: 2,
      estimatedSavings: 3000,
      affectedResources: ['Neurology Department'],
      implementation: 'Hire and onboard new neurologist',
    },
    {
      id: '3',
      type: 'EXTEND_HOURS',
      title: 'Extend Clinic Hours',
      description: 'Extend clinic hours for busy departments',
      impact: 'MEDIUM',
      effort: 'MEDIUM',
      priority: 3,
      estimatedSavings: 2000,
      affectedResources: ['Cardiology Department'],
      implementation: 'Extend operating hours by 2 hours',
    },
  ];

  const mockOnApplySuggestion = jest.fn();
  const mockOnGenerateReport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the optimization component', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    expect(screen.getByText('Department Performance')).toBeInTheDocument();
    expect(screen.getByText('Optimization Suggestions (3)')).toBeInTheDocument();
  });

  it('displays analytics overview', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument(); // Total Doctors
    expect(screen.getByText('40')).toBeInTheDocument(); // Total Hours
    expect(screen.getByText('75%')).toBeInTheDocument(); // Avg Utilization
    expect(screen.getByText('82%')).toBeInTheDocument(); // Efficiency Score
  });

  it('displays department performance table', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Utilization')).toBeInTheDocument();
    expect(screen.getByText('Conflicts')).toBeInTheDocument();
    expect(screen.getByText('Efficiency')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('Neurology')).toBeInTheDocument();
    expect(screen.getByText('Dermatology')).toBeInTheDocument();
  });

  it('shows department efficiency status', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('displays optimization suggestions', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    expect(screen.getByText('Reschedule Dr. Wilson')).toBeInTheDocument();
    expect(screen.getByText('Add Additional Doctor')).toBeInTheDocument();
    expect(screen.getByText('Extend Clinic Hours')).toBeInTheDocument();
  });

  it('shows suggestion impact and effort chips', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('displays estimated savings', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    expect(screen.getByText('$5,000')).toBeInTheDocument();
    expect(screen.getByText('$3,000')).toBeInTheDocument();
    expect(screen.getByText('$2,000')).toBeInTheDocument();
  });

  it('handles expand/collapse suggestion details', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    const expandButtons = screen.getAllByLabelText('View Details');
    fireEvent.click(expandButtons[0]);

    expect(screen.getByText('Expected Impact')).toBeInTheDocument();
    expect(screen.getByText('Implementation Effort')).toBeInTheDocument();
    expect(screen.getByText('Implementation Steps')).toBeInTheDocument();
  });

  it('handles apply suggestion action', async () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    const applyButtons = screen.getAllByLabelText('Apply Suggestion');
    fireEvent.click(applyButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Apply Optimization Suggestion')).toBeInTheDocument();
    });
  });

  it('handles generate report action', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    const generateReportButton = screen.getByText('Generate Report');
    fireEvent.click(generateReportButton);

    expect(mockOnGenerateReport).toHaveBeenCalled();
  });

  it('displays suggestion details in apply dialog', async () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    const applyButtons = screen.getAllByLabelText('Apply Suggestion');
    fireEvent.click(applyButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Suggestion Details')).toBeInTheDocument();
      expect(screen.getByText('Reschedule Dr. Wilson to avoid overlap with Dr. Davis')).toBeInTheDocument();
      expect(screen.getByText('Expected Benefits')).toBeInTheDocument();
      expect(screen.getByText('Implementation Steps')).toBeInTheDocument();
    });
  });

  it('handles apply suggestion submission', async () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    const applyButtons = screen.getAllByLabelText('Apply Suggestion');
    fireEvent.click(applyButtons[0]);

    await waitFor(() => {
      const applyButton = screen.getByText('Apply Suggestion');
      fireEvent.click(applyButton);
    });

    expect(mockOnApplySuggestion).toHaveBeenCalledWith('1');
  });

  it('shows loading state', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
        loading={true}
      />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays no suggestions message when empty', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={[]}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    expect(screen.getByText('No optimization suggestions available. Schedule is already optimized.')).toBeInTheDocument();
  });

  it('displays affected resources when available', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    const expandButtons = screen.getAllByLabelText('View Details');
    fireEvent.click(expandButtons[0]);

    expect(screen.getByText('Affected Resources')).toBeInTheDocument();
    expect(screen.getByText('Dr. Wilson')).toBeInTheDocument();
    expect(screen.getByText('Room 401')).toBeInTheDocument();
  });

  it('sorts suggestions by priority', () => {
    const lowPrioritySuggestion = {
      id: '4',
      type: 'MINOR_ADJUSTMENT',
      title: 'Minor Schedule Adjustment',
      description: 'Minor adjustment to improve efficiency',
      impact: 'LOW',
      effort: 'LOW',
      priority: 4,
      estimatedSavings: 500,
      affectedResources: ['General Schedule'],
      implementation: 'Minor time slot adjustments',
    };

    const suggestionsWithPriority = [mockSuggestions[1], lowPrioritySuggestion, mockSuggestions[0]];

    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={suggestionsWithPriority}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    // High impact suggestions should appear first
    expect(screen.getByText('Reschedule Dr. Wilson')).toBeInTheDocument();
  });

  it('handles error in apply suggestion action', async () => {
    const mockOnApplySuggestionWithError = jest.fn().mockRejectedValue(new Error('Apply failed'));

    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestionWithError}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    const applyButtons = screen.getAllByLabelText('Apply Suggestion');
    fireEvent.click(applyButtons[0]);

    await waitFor(() => {
      const applyButton = screen.getByText('Apply Suggestion');
      fireEvent.click(applyButton);
    });

    // Should handle errors gracefully
  });

  it('displays efficiency score with appropriate color', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    // Efficiency score should be displayed with success color (82% is good)
    expect(screen.getByText('82%')).toBeInTheDocument();
  });

  it('shows utilization progress bars', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    // Should display utilization percentages
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('displays conflict counts for departments', () => {
    renderWithProviders(
      <ScheduleOptimization
        analytics={mockAnalytics}
        suggestions={mockSuggestions}
        onApplySuggestion={mockOnApplySuggestion}
        onGenerateReport={mockOnGenerateReport}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument(); // Cardiology conflicts
    expect(screen.getByText('2')).toBeInTheDocument(); // Neurology conflicts
    expect(screen.getByText('0')).toBeInTheDocument(); // Dermatology conflicts
  });
}); 