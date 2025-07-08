import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';

const DATA_TYPES = [
  { value: 'patients', label: 'Patients' },
  { value: 'appointments', label: 'Appointments' },
  { value: 'lab_results', label: 'Lab Results' },
  { value: 'prescriptions', label: 'Prescriptions' },
  { value: 'medical_records', label: 'Medical Records' },
  { value: 'users', label: 'Users' }
];

const FORMATS = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
  { value: 'json', label: 'JSON' }
];

const DataExportPage: React.FC = () => {
  const [dataType, setDataType] = useState('patients');
  const [format, setFormat] = useState('csv');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: `Exported ${dataType} data as ${format.toUpperCase()}${startDate && endDate ? ` (${startDate} to ${endDate})` : ''}`,
        severity: 'success'
      });
    }, 2000);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Data Export</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Data Type</InputLabel>
                <Select
                  value={dataType}
                  onChange={e => setDataType(e.target.value)}
                  label="Data Type"
                >
                  {DATA_TYPES.map(dt => (
                    <MenuItem key={dt.value} value={dt.value}>{dt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  value={format}
                  onChange={e => setFormat(e.target.value)}
                  label="Format"
                >
                  {FORMATS.map(f => (
                    <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
                onClick={handleExport}
                disabled={loading}
                fullWidth
                size="large"
              >
                Export Data
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DataExportPage; 