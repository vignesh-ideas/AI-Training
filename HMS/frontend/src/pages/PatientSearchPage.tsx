import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Pagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  ViewList,
  GridView,
  Person,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  Bloodtype,
  Edit,
  Delete,
  Visibility,
  Download,
  Print,
  Add,
  Sort,
  Clear,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  email?: string;
  phoneNumber: string;
  city: string;
  state: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  lastVisit: string;
  nextAppointment?: string;
  registrationDate: string;
}

const PatientSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);

  // Filter states
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterGender, setFilterGender] = useState<string>('ALL');
  const [filterBloodType, setFilterBloodType] = useState<string>('ALL');
  const [filterCity, setFilterCity] = useState<string>('ALL');
  const [filterDateRange, setFilterDateRange] = useState<{
    start: string;
    end: string;
  }>({ start: '', end: '' });
  const [filterHasAppointment, setFilterHasAppointment] = useState<boolean>(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm, filterStatus, filterGender, filterBloodType, filterCity, filterDateRange, filterHasAppointment]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPatients: Patient[] = [
        {
          id: 'PAT001',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-15',
          gender: 'MALE',
          bloodType: 'O+',
          email: 'john.doe@example.com',
          phoneNumber: '+1234567890',
          city: 'New York',
          state: 'NY',
          status: 'ACTIVE',
          lastVisit: '2024-01-15',
          nextAppointment: '2024-02-15',
          registrationDate: '2023-01-15',
        },
        {
          id: 'PAT002',
          firstName: 'Jane',
          lastName: 'Smith',
          dateOfBirth: '1985-05-20',
          gender: 'FEMALE',
          bloodType: 'A+',
          email: 'jane.smith@example.com',
          phoneNumber: '+1234567891',
          city: 'Los Angeles',
          state: 'CA',
          status: 'ACTIVE',
          lastVisit: '2024-01-10',
          registrationDate: '2023-02-10',
        },
        {
          id: 'PAT003',
          firstName: 'Michael',
          lastName: 'Johnson',
          dateOfBirth: '1978-12-03',
          gender: 'MALE',
          bloodType: 'B+',
          phoneNumber: '+1234567892',
          city: 'Chicago',
          state: 'IL',
          status: 'INACTIVE',
          lastVisit: '2023-11-20',
          registrationDate: '2022-08-15',
        },
        {
          id: 'PAT004',
          firstName: 'Sarah',
          lastName: 'Williams',
          dateOfBirth: '1992-08-12',
          gender: 'FEMALE',
          bloodType: 'AB+',
          email: 'sarah.williams@example.com',
          phoneNumber: '+1234567893',
          city: 'Houston',
          state: 'TX',
          status: 'ACTIVE',
          lastVisit: '2024-01-08',
          nextAppointment: '2024-01-25',
          registrationDate: '2023-03-20',
        },
        {
          id: 'PAT005',
          firstName: 'David',
          lastName: 'Brown',
          dateOfBirth: '1980-03-25',
          gender: 'MALE',
          bloodType: 'O-',
          phoneNumber: '+1234567894',
          city: 'Phoenix',
          state: 'AZ',
          status: 'PENDING',
          lastVisit: '2023-12-15',
          registrationDate: '2023-12-01',
        },
        {
          id: 'PAT006',
          firstName: 'Emily',
          lastName: 'Davis',
          dateOfBirth: '1995-11-08',
          gender: 'FEMALE',
          bloodType: 'A-',
          email: 'emily.davis@example.com',
          phoneNumber: '+1234567895',
          city: 'Philadelphia',
          state: 'PA',
          status: 'ACTIVE',
          lastVisit: '2024-01-12',
          nextAppointment: '2024-02-20',
          registrationDate: '2023-04-05',
        },
      ];

      setPatients(mockPatients);
    } catch (error) {
      setError('Failed to load patients');
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    let filtered = patients.filter(patient => {
      // Search term filter
      const searchMatch = 
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phoneNumber.includes(searchTerm);

      // Status filter
      const statusMatch = filterStatus === 'ALL' || patient.status === filterStatus;

      // Gender filter
      const genderMatch = filterGender === 'ALL' || patient.gender === filterGender;

      // Blood type filter
      const bloodTypeMatch = filterBloodType === 'ALL' || patient.bloodType === filterBloodType;

      // City filter
      const cityMatch = filterCity === 'ALL' || patient.city === filterCity;

      // Date range filter
      const dateMatch = !filterDateRange.start || !filterDateRange.end || 
        (patient.registrationDate >= filterDateRange.start && patient.registrationDate <= filterDateRange.end);

      // Appointment filter
      const appointmentMatch = !filterHasAppointment || patient.nextAppointment;

      return searchMatch && statusMatch && genderMatch && bloodTypeMatch && cityMatch && dateMatch && appointmentMatch;
    });

    setFilteredPatients(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('ALL');
    setFilterGender('ALL');
    setFilterBloodType('ALL');
    setFilterCity('ALL');
    setFilterDateRange({ start: '', end: '' });
    setFilterHasAppointment(false);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleEditPatient = (patient: Patient) => {
    navigate(`/patient/${patient.id}/edit`);
  };

  const handleDeletePatient = (patient: Patient) => {
    if (window.confirm(`Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`)) {
      setPatients(prev => prev.filter(p => p.id !== patient.id));
      toast.success(`${patient.firstName} ${patient.lastName} deleted successfully`);
    }
  };

  const handleExportPatients = () => {
    toast.success('Patient data exported successfully');
  };

  const handlePrintPatients = () => {
    toast.success('Patient list printed');
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'default';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Patient Search - HMS</title>
        <meta name="description" content="Search and manage patients in the Hospital Management System" />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Patient Search
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExportPatients}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrintPatients}
            >
              Print
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/patient/register')}
            >
              Add Patient
            </Button>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search patients by name, ID, email, or phone..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="List View">
                  <IconButton
                    onClick={() => setViewMode('list')}
                    color={viewMode === 'list' ? 'primary' : 'default'}
                  >
                    <ViewList />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Grid View">
                  <IconButton
                    onClick={() => setViewMode('grid')}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                  >
                    <GridView />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>

          {/* Advanced Filters */}
          {showFilters && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="ALL">All Status</MenuItem>
                      <MenuItem value="ACTIVE">Active</MenuItem>
                      <MenuItem value="INACTIVE">Inactive</MenuItem>
                      <MenuItem value="PENDING">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={filterGender}
                      onChange={(e) => setFilterGender(e.target.value)}
                      label="Gender"
                    >
                      <MenuItem value="ALL">All Genders</MenuItem>
                      <MenuItem value="MALE">Male</MenuItem>
                      <MenuItem value="FEMALE">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Blood Type</InputLabel>
                    <Select
                      value={filterBloodType}
                      onChange={(e) => setFilterBloodType(e.target.value)}
                      label="Blood Type"
                    >
                      <MenuItem value="ALL">All Blood Types</MenuItem>
                      <MenuItem value="A+">A+</MenuItem>
                      <MenuItem value="A-">A-</MenuItem>
                      <MenuItem value="B+">B+</MenuItem>
                      <MenuItem value="B-">B-</MenuItem>
                      <MenuItem value="AB+">AB+</MenuItem>
                      <MenuItem value="AB-">AB-</MenuItem>
                      <MenuItem value="O+">O+</MenuItem>
                      <MenuItem value="O-">O-</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>City</InputLabel>
                    <Select
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                      label="City"
                    >
                      <MenuItem value="ALL">All Cities</MenuItem>
                      <MenuItem value="New York">New York</MenuItem>
                      <MenuItem value="Los Angeles">Los Angeles</MenuItem>
                      <MenuItem value="Chicago">Chicago</MenuItem>
                      <MenuItem value="Houston">Houston</MenuItem>
                      <MenuItem value="Phoenix">Phoenix</MenuItem>
                      <MenuItem value="Philadelphia">Philadelphia</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Registration From"
                        value={filterDateRange.start}
                        onChange={(e) => setFilterDateRange(prev => ({ ...prev, start: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Registration To"
                        value={filterDateRange.end}
                        onChange={(e) => setFilterDateRange(prev => ({ ...prev, end: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterHasAppointment}
                        onChange={(e) => setFilterHasAppointment(e.target.checked)}
                      />
                    }
                    label="Has Upcoming Appointment"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<Clear />}
                    onClick={handleClearFilters}
                  >
                    Clear All Filters
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Results Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredPatients.length} of {patients.length} patients
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of {totalPages}
          </Typography>
        </Box>

        {/* Patients Grid/List */}
        {currentPatients.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Patients Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria or filters.
              </Typography>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <Grid container spacing={3}>
            {currentPatients.map((patient) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={patient.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {patient.firstName[0]}{patient.lastName[0]}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" noWrap>
                          {patient.firstName} {patient.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {patient.id}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={patient.status}
                        color={getStatusColor(patient.status) as any}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {patient.gender} • {calculateAge(patient.dateOfBirth)} years • {patient.bloodType}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <Phone fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {patient.phoneNumber}
                      </Typography>
                      {patient.email && (
                        <Typography variant="body2" color="text.secondary">
                          <Email fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                          {patient.email}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        <LocationOn fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {patient.city}, {patient.state}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Tooltip title="View Profile">
                        <IconButton
                          size="small"
                          onClick={() => handleViewPatient(patient)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Patient">
                        <IconButton
                          size="small"
                          onClick={() => handleEditPatient(patient)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Patient">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePatient(patient)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card>
            <List>
              {currentPatients.map((patient, index) => (
                <React.Fragment key={patient.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {patient.firstName[0]}{patient.lastName[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6">
                            {patient.firstName} {patient.lastName}
                          </Typography>
                          <Chip
                            label={patient.status}
                            color={getStatusColor(patient.status) as any}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            ID: {patient.id} • {patient.gender} • {calculateAge(patient.dateOfBirth)} years • {patient.bloodType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {patient.phoneNumber} • {patient.city}, {patient.state}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Last Visit: {patient.lastVisit} • Registered: {patient.registrationDate}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Profile">
                        <IconButton
                          size="small"
                          onClick={() => handleViewPatient(patient)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Patient">
                        <IconButton
                          size="small"
                          onClick={() => handleEditPatient(patient)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Patient">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePatient(patient)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                  {index < currentPatients.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
            />
          </Box>
        )}

        {/* Patient Details Dialog */}
        <Dialog
          open={showPatientDetails}
          onClose={() => setShowPatientDetails(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Patient Details
          </DialogTitle>
          <DialogContent>
            {selectedPatient && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  ID: {selectedPatient.id}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Personal Information</Typography>
                    <Typography variant="body2">Age: {calculateAge(selectedPatient.dateOfBirth)} years</Typography>
                    <Typography variant="body2">Gender: {selectedPatient.gender}</Typography>
                    <Typography variant="body2">Blood Type: {selectedPatient.bloodType}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Contact Information</Typography>
                    <Typography variant="body2">Phone: {selectedPatient.phoneNumber}</Typography>
                    {selectedPatient.email && (
                      <Typography variant="body2">Email: {selectedPatient.email}</Typography>
                    )}
                    <Typography variant="body2">Location: {selectedPatient.city}, {selectedPatient.state}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPatientDetails(false)}>Close</Button>
            <Button
              variant="contained"
              onClick={() => {
                if (selectedPatient) {
                  navigate(`/patient/${selectedPatient.id}`);
                  setShowPatientDetails(false);
                }
              }}
            >
              View Full Profile
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default PatientSearchPage; 