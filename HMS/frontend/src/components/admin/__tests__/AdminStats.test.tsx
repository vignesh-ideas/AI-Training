import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AdminStats from '../AdminStats';
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

describe('AdminStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders admin stats component', () => {
    renderWithProviders(<AdminStats />);

    expect(screen.getByText(/quick stats/i)).toBeInTheDocument();
    expect(screen.getByText(/system metrics/i)).toBeInTheDocument();
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
    expect(screen.getByText(/quick actions/i)).toBeInTheDocument();
  });

  it('displays quick stats cards', () => {
    renderWithProviders(<AdminStats />);

    expect(screen.getByText(/total users/i)).toBeInTheDocument();
    expect(screen.getByText(/1,247/i)).toBeInTheDocument();
    expect(screen.getByText(/active users/i)).toBeInTheDocument();
    expect(screen.getByText(/1,189/i)).toBeInTheDocument();
    expect(screen.getByText(/new users \(this month\)/i)).toBeInTheDocument();
    expect(screen.getByText(/89/i)).toBeInTheDocument();
    expect(screen.getByText(/suspended users/i)).toBeInTheDocument();
    expect(screen.getByText(/23/i)).toBeInTheDocument();
  });

  it('displays change percentages in stats', () => {
    renderWithProviders(<AdminStats />);

    expect(screen.getByText(/12\.5%/i)).toBeInTheDocument();
    expect(screen.getByText(/8\.2%/i)).toBeInTheDocument();
    expect(screen.getByText(/3\.1%/i)).toBeInTheDocument();
    expect(screen.getByText(/15\.4%/i)).toBeInTheDocument();
  });

  it('displays system metrics with progress bars', () => {
    renderWithProviders(<AdminStats />);

    expect(screen.getByText(/system performance/i)).toBeInTheDocument();
    expect(screen.getByText(/85%/i)).toBeInTheDocument();
    expect(screen.getByText(/storage usage/i)).toBeInTheDocument();
    expect(screen.getByText(/67%/i)).toBeInTheDocument();
    expect(screen.getByText(/network load/i)).toBeInTheDocument();
    expect(screen.getByText(/42%/i)).toBeInTheDocument();
    expect(screen.getByText(/security status/i)).toBeInTheDocument();
    expect(screen.getByText(/98%/i)).toBeInTheDocument();
  });

  it('displays recent activity list', () => {
    renderWithProviders(<AdminStats />);

    expect(screen.getByText(/new user registered: dr\. sarah johnson/i)).toBeInTheDocument();
    expect(screen.getByText(/user suspended: mike\.wilson@example\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/high storage usage detected/i)).toBeInTheDocument();
    expect(screen.getByText(/security scan completed successfully/i)).toBeInTheDocument();
  });

  it('displays activity timestamps', () => {
    renderWithProviders(<AdminStats />);

    expect(screen.getByText(/2 minutes ago/i)).toBeInTheDocument();
    expect(screen.getByText(/15 minutes ago/i)).toBeInTheDocument();
    expect(screen.getByText(/1 hour ago/i)).toBeInTheDocument();
    expect(screen.getByText(/2 hours ago/i)).toBeInTheDocument();
  });

  it('displays quick action buttons', () => {
    renderWithProviders(<AdminStats />);

    expect(screen.getByText(/add new user/i)).toBeInTheDocument();
    expect(screen.getByText(/schedule maintenance/i)).toBeInTheDocument();
    expect(screen.getByText(/run security scan/i)).toBeInTheDocument();
    expect(screen.getByText(/manage notifications/i)).toBeInTheDocument();
  });

  it('shows system status alert', () => {
    renderWithProviders(<AdminStats />);

    expect(screen.getByText(/system status/i)).toBeInTheDocument();
    expect(screen.getByText(/all systems operational/i)).toBeInTheDocument();
  });

  it('displays last updated timestamp', () => {
    renderWithProviders(<AdminStats />);

    expect(screen.getByText(/last updated/i)).toBeInTheDocument();
  });

  it('handles quick action button clicks', () => {
    renderWithProviders(<AdminStats />);

    const addUserButton = screen.getByText(/add new user/i);
    fireEvent.click(addUserButton);

    // Should show info message
    expect(screen.getByText(/add user functionality coming soon/i)).toBeInTheDocument();
  });

  it('shows trending up icon for positive changes', () => {
    renderWithProviders(<AdminStats />);

    // Check for trending up icons in stats with positive changes
    const trendingIcons = screen.getAllByTestId('TrendingUpIcon');
    expect(trendingIcons.length).toBeGreaterThan(0);
  });

  it('shows trending down icon for negative changes', () => {
    renderWithProviders(<AdminStats />);

    // Check for trending down icons in stats with negative changes
    const trendingIcons = screen.getAllByTestId('TrendingDownIcon');
    expect(trendingIcons.length).toBeGreaterThan(0);
  });

  it('displays activity icons with correct colors', () => {
    renderWithProviders(<AdminStats />);

    const activityIcons = screen.getAllByTestId('PersonAddIcon');
    expect(activityIcons.length).toBeGreaterThan(0);
  });

  it('shows progress bars for system metrics', () => {
    renderWithProviders(<AdminStats />);

    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBe(4); // 4 system metrics
  });

  it('displays stats in a grid layout', () => {
    renderWithProviders(<AdminStats />);

    const statCards = screen.getAllByText(/total users|active users|new users|suspended users/i);
    expect(statCards.length).toBe(4);
  });

  it('shows proper formatting for large numbers', () => {
    renderWithProviders(<AdminStats />);

    expect(screen.getByText(/1,247/i)).toBeInTheDocument();
    expect(screen.getByText(/1,189/i)).toBeInTheDocument();
  });

  it('displays change indicators with proper styling', () => {
    renderWithProviders(<AdminStats />);

    const changePercentages = screen.getAllByText(/\d+\.\d+%/);
    expect(changePercentages.length).toBeGreaterThan(0);
  });

  it('shows "from last month" text for changes', () => {
    renderWithProviders(<AdminStats />);

    const fromLastMonthTexts = screen.getAllByText(/from last month/i);
    expect(fromLastMonthTexts.length).toBe(4); // 4 stat cards
  });
}); 