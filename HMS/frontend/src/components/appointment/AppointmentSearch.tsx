import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
  DateRange,
  Person,
  MedicalServices,
  LocationOn,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface SearchFilters {
  searchTerm: string;
  status: string;
  type: string;
  department: string;
  doctor: string;
  patient: string;
  startDate: Date | null;
  endDate: Date | null;
  dateRange: string;
}

interface AppointmentSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  onClear: () => void;
  loading?: boolean;
}

const AppointmentSearch: React.FC<AppointmentSearchProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  onClear,
  loading = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleFilterChange = (field: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleClearFilters = () => {
    onClear();
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'NO_SHOW', label: 'No Show' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'CONSULTATION', label: 'Consultation' },
    { value: 'FOLLOW_UP', label: 'Follow-up' },
    { value: 'LAB_TEST', label: 'Lab Test' },
    { value: 'PHYSICAL_EXAMINATION', label: 'Physical Examination' },
    { value: 'EMERGENCY', label: 'Emergency' },
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'General Medicine', label: 'General Medicine' },
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this_week', label: 'This Week' },
    { value: 'next_week', label: 'Next Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.status !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.department !== 'all') count++;
    if (filters.doctor) count++;
    if (filters.patient) count++;
    if (filters.startDate || filters.endDate) count++;
    return count;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Search />
              Search & Filters
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {getActiveFiltersCount() > 0 && (
                <Chip
                  label={`${getActiveFiltersCount()} active filters`}
                  color="primary"
                  size="small"
                />
              )}
              <Tooltip title={expanded ? 'Hide Advanced Filters' : 'Show Advanced Filters'}>
                <IconButton
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Basic Search */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Search appointments"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                placeholder="Search by patient name, doctor, department, or reason..."
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  label="Type"
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  {typeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Advanced Filters */}
          <Collapse in={expanded}>
            <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList />
                Advanced Filters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={filters.department}
                      label="Department"
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                    >
                      {departmentOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Doctor Name"
                    value={filters.doctor}
                    onChange={(e) => handleFilterChange('doctor', e.target.value)}
                    placeholder="Search by doctor name..."
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Patient Name"
                    value={filters.patient}
                    onChange={(e) => handleFilterChange('patient', e.target.value)}
                    placeholder="Search by patient name..."
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Date Range</InputLabel>
                    <Select
                      value={filters.dateRange}
                      label="Date Range"
                      onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    >
                      {dateRangeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {filters.dateRange === 'custom' && (
                  <>
                    <Grid item xs={12} md={6}>
                      <DatePicker
                        label="Start Date"
                        value={filters.startDate}
                        onChange={(date) => handleFilterChange('startDate', date)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <DatePicker
                        label="End Date"
                        value={filters.endDate}
                        onChange={(date) => handleFilterChange('endDate', date)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Collapse>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={onSearch}
              disabled={loading}
              startIcon={<Search />}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<Clear />}
            >
              Clear Filters
            </Button>
          </Box>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Active Filters:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filters.searchTerm && (
                  <Chip
                    label={`Search: ${filters.searchTerm}`}
                    onDelete={() => handleFilterChange('searchTerm', '')}
                    size="small"
                  />
                )}
                {filters.status !== 'all' && (
                  <Chip
                    label={`Status: ${statusOptions.find(s => s.value === filters.status)?.label}`}
                    onDelete={() => handleFilterChange('status', 'all')}
                    size="small"
                  />
                )}
                {filters.type !== 'all' && (
                  <Chip
                    label={`Type: ${typeOptions.find(t => t.value === filters.type)?.label}`}
                    onDelete={() => handleFilterChange('type', 'all')}
                    size="small"
                  />
                )}
                {filters.department !== 'all' && (
                  <Chip
                    label={`Department: ${filters.department}`}
                    onDelete={() => handleFilterChange('department', 'all')}
                    size="small"
                  />
                )}
                {filters.doctor && (
                  <Chip
                    label={`Doctor: ${filters.doctor}`}
                    onDelete={() => handleFilterChange('doctor', '')}
                    size="small"
                  />
                )}
                {filters.patient && (
                  <Chip
                    label={`Patient: ${filters.patient}`}
                    onDelete={() => handleFilterChange('patient', '')}
                    size="small"
                  />
                )}
                {(filters.startDate || filters.endDate) && (
                  <Chip
                    label={`Date: ${filters.startDate?.toLocaleDateString()} - ${filters.endDate?.toLocaleDateString()}`}
                    onDelete={() => {
                      handleFilterChange('startDate', null);
                      handleFilterChange('endDate', null);
                    }}
                    size="small"
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default AppointmentSearch; 