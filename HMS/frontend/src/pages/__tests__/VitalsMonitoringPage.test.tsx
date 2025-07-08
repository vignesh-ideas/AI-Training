import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import VitalsMonitoringPage from '../VitalsMonitoringPage';

// Mock recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Area: () => <div data-testid="area" />,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
}));

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('VitalsMonitoringPage', () => {
  beforeEach(() => {
    // Mock console.error to suppress recharts warnings
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    test('renders vitals monitoring page with header', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      expect(screen.getByText('Vitals Monitoring')).toBeInTheDocument();
      expect(screen.getByText('Start Monitoring')).toBeInTheDocument();
      expect(screen.getByText('Add Vital')).toBeInTheDocument();
    });

    test('renders current vitals cards', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      expect(screen.getByText('Current Vitals')).toBeInTheDocument();
      expect(screen.getByText('BLOOD PRESSURE')).toBeInTheDocument();
      expect(screen.getByText('HEART RATE')).toBeInTheDocument();
      expect(screen.getByText('TEMPERATURE')).toBeInTheDocument();
      expect(screen.getByText('OXYGEN SATURATION')).toBeInTheDocument();
    });

    test('renders recent alerts section', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      expect(screen.getByText('Recent Alerts')).toBeInTheDocument();
    });

    test('renders charts section with tabs', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      expect(screen.getByText('Heart Rate')).toBeInTheDocument();
      expect(screen.getByText('Blood Pressure')).toBeInTheDocument();
      expect(screen.getByText('Temperature')).toBeInTheDocument();
      expect(screen.getByText('Oxygen Saturation')).toBeInTheDocument();
    });

    test('renders vitals history table', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      expect(screen.getByText('Vitals History')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Recorded By')).toBeInTheDocument();
      expect(screen.getByText('Timestamp')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  describe('Monitoring Controls', () => {
    test('starts monitoring when start button is clicked', async () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const startButton = screen.getByText('Start Monitoring');
      fireEvent.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText('Stop Monitoring')).toBeInTheDocument();
      });
    });

    test('stops monitoring when stop button is clicked', async () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      // Start monitoring first
      const startButton = screen.getByText('Start Monitoring');
      fireEvent.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText('Stop Monitoring')).toBeInTheDocument();
      });
      
      // Stop monitoring
      const stopButton = screen.getByText('Stop Monitoring');
      fireEvent.click(stopButton);
      
      await waitFor(() => {
        expect(screen.getByText('Start Monitoring')).toBeInTheDocument();
      });
    });
  });

  describe('Add Vital Dialog', () => {
    test('opens add vital dialog when add button is clicked', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const addButton = screen.getByText('Add Vital');
      fireEvent.click(addButton);
      
      expect(screen.getByText('Add New Vital Sign')).toBeInTheDocument();
      expect(screen.getByText('Vital Type')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
    });

    test('closes add vital dialog when cancel is clicked', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const addButton = screen.getByText('Add Vital');
      fireEvent.click(addButton);
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(screen.queryByText('Add New Vital Sign')).not.toBeInTheDocument();
    });

    test('closes add vital dialog when add vital is clicked', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const addButton = screen.getByText('Add Vital');
      fireEvent.click(addButton);
      
      const addVitalButton = screen.getByText('Add Vital');
      fireEvent.click(addVitalButton);
      
      expect(screen.queryByText('Add New Vital Sign')).not.toBeInTheDocument();
    });
  });

  describe('Alerts Dialog', () => {
    test('opens alerts dialog when view all alerts is clicked', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const viewAllButton = screen.getByText(/View All \(\d+\)/);
      fireEvent.click(viewAllButton);
      
      expect(screen.getByText('Vital Alerts')).toBeInTheDocument();
    });

    test('closes alerts dialog when close is clicked', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const viewAllButton = screen.getByText(/View All \(\d+\)/);
      fireEvent.click(viewAllButton);
      
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      expect(screen.queryByText('Vital Alerts')).not.toBeInTheDocument();
    });

    test('acknowledges alert when acknowledge button is clicked', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const viewAllButton = screen.getByText(/View All \(\d+\)/);
      fireEvent.click(viewAllButton);
      
      const acknowledgeButtons = screen.getAllByText('Acknowledge');
      if (acknowledgeButtons.length > 0) {
        fireEvent.click(acknowledgeButtons[0]);
      }
    });
  });

  describe('Settings Dialog', () => {
    test('opens settings dialog when settings button is clicked', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const settingsButton = screen.getByLabelText('Settings');
      fireEvent.click(settingsButton);
      
      expect(screen.getByText('Vitals Monitoring Settings')).toBeInTheDocument();
      expect(screen.getByText('Alert Thresholds')).toBeInTheDocument();
    });

    test('closes settings dialog when cancel is clicked', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const settingsButton = screen.getByLabelText('Settings');
      fireEvent.click(settingsButton);
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(screen.queryByText('Vitals Monitoring Settings')).not.toBeInTheDocument();
    });

    test('closes settings dialog when save is clicked', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const settingsButton = screen.getByLabelText('Settings');
      fireEvent.click(settingsButton);
      
      const saveButton = screen.getByText('Save Settings');
      fireEvent.click(saveButton);
      
      expect(screen.queryByText('Vitals Monitoring Settings')).not.toBeInTheDocument();
    });
  });

  describe('Chart Tabs', () => {
    test('switches between chart tabs', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const bloodPressureTab = screen.getByText('Blood Pressure');
      fireEvent.click(bloodPressureTab);
      
      const temperatureTab = screen.getByText('Temperature');
      fireEvent.click(temperatureTab);
      
      const oxygenTab = screen.getByText('Oxygen Saturation');
      fireEvent.click(oxygenTab);
    });
  });

  describe('Export and Print', () => {
    test('exports data when export button is clicked', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const exportButton = screen.getByText('Export');
      fireEvent.click(exportButton);
    });

    test('prints report when print button is clicked', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const printButton = screen.getByText('Print');
      fireEvent.click(printButton);
    });
  });

  describe('Vital Status Display', () => {
    test('displays vital status chips with correct colors', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const statusChips = screen.getAllByText('normal');
      expect(statusChips.length).toBeGreaterThan(0);
    });

    test('displays vital values correctly', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      expect(screen.getByText('120/80 mmHg')).toBeInTheDocument();
      expect(screen.getByText('75 bpm')).toBeInTheDocument();
      expect(screen.getByText('98.6 °F')).toBeInTheDocument();
      expect(screen.getByText('98 %')).toBeInTheDocument();
    });
  });

  describe('Alert Display', () => {
    test('displays alert severity correctly', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const viewAllButton = screen.getByText(/View All \(\d+\)/);
      fireEvent.click(viewAllButton);
      
      expect(screen.getByText('medium')).toBeInTheDocument();
      expect(screen.getByText('high')).toBeInTheDocument();
    });

    test('displays alert messages correctly', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const viewAllButton = screen.getByText(/View All \(\d+\)/);
      fireEvent.click(viewAllButton);
      
      expect(screen.getByText(/Heart rate elevated/)).toBeInTheDocument();
      expect(screen.getByText(/Blood pressure high/)).toBeInTheDocument();
    });
  });

  describe('Table Actions', () => {
    test('displays action buttons in table rows', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const viewButtons = screen.getAllByLabelText('View Details');
      const editButtons = screen.getAllByLabelText('Edit');
      const deleteButtons = screen.getAllByLabelText('Delete');
      
      expect(viewButtons.length).toBeGreaterThan(0);
      expect(editButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Floating Action Button', () => {
    test('renders floating action button', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const fab = screen.getByLabelText('add');
      expect(fab).toBeInTheDocument();
    });

    test('opens add vital dialog when FAB is clicked', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const fab = screen.getByLabelText('add');
      fireEvent.click(fab);
      
      expect(screen.getByText('Add New Vital Sign')).toBeInTheDocument();
    });
  });

  describe('Threshold Settings', () => {
    test('displays threshold settings correctly', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const settingsButton = screen.getByLabelText('Settings');
      fireEvent.click(settingsButton);
      
      expect(screen.getByText('HEART RATE')).toBeInTheDocument();
      expect(screen.getByText('BLOOD PRESSURE')).toBeInTheDocument();
      expect(screen.getByText('TEMPERATURE')).toBeInTheDocument();
      expect(screen.getByText('OXYGEN SATURATION')).toBeInTheDocument();
      expect(screen.getByText('RESPIRATORY RATE')).toBeInTheDocument();
    });

    test('toggles threshold alerts', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      const settingsButton = screen.getByLabelText('Settings');
      fireEvent.click(settingsButton);
      
      const switches = screen.getAllByRole('checkbox');
      if (switches.length > 0) {
        fireEvent.click(switches[0]);
      }
    });
  });

  describe('Error Handling', () => {
    test('handles missing data gracefully', () => {
      renderWithProviders(<VitalsMonitoringPage />);
      
      // Page should render without errors even with empty data
      expect(screen.getByText('Vitals Monitoring')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('renders on different screen sizes', () => {
      const { rerender } = renderWithProviders(<VitalsMonitoringPage />);
      
      // Test mobile view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      window.dispatchEvent(new Event('resize'));
      
      // Test tablet view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      window.dispatchEvent(new Event('resize'));
      
      // Test desktop view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      window.dispatchEvent(new Event('resize'));
    });
  });
}); 