import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert,
  LinearProgress,
  Autocomplete,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Save,
  Cancel,
  Add,
  Delete,
  Upload,
  Description,
  Person,
  MedicalServices,
  Category,
  Priority,
  Medication,
  Science,
  MonitorHeart,
  AttachFile,
  Note,
  Security,
  Verified,
} from '@mui/icons-material';

interface MedicalRecordFormData {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  recordType: string;
  title: string;
  description: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  labResults: string[];
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    oxygenSaturation: string;
  };
  priority: string;
  tags: string[];
  attachments: string[];
  notes: string;
  isConfidential: boolean;
}

interface MedicalRecordFormProps {
  initialData?: Partial<MedicalRecordFormData>;
  onSubmit: (data: MedicalRecordFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  mode,
}) => {
  const [formData, setFormData] = useState<MedicalRecordFormData>({
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    department: '',
    recordType: 'CONSULTATION',
    title: '',
    description: '',
    diagnosis: '',
    treatment: '',
    medications: [],
    labResults: [],
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      oxygenSaturation: '',
    },
    priority: 'MEDIUM',
    tags: [],
    attachments: [],
    notes: '',
    isConfidential: false,
    ...initialData,
  });

  const [activeTab, setActiveTab] = useState(0);
  const [newMedication, setNewMedication] = useState('');
  const [newLabResult, setNewLabResult] = useState('');
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const recordTypes = [
    { value: 'CONSULTATION', label: 'Consultation' },
    { value: 'DIAGNOSIS', label: 'Diagnosis' },
    { value: 'TREATMENT', label: 'Treatment' },
    { value: 'FOLLOW_UP', label: 'Follow-up' },
    { value: 'SURGERY', label: 'Surgery' },
    { value: 'EMERGENCY', label: 'Emergency' },
  ];

  const priorities = [
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  const departments = [
    'Cardiology',
    'Neurology',
    'Dermatology',
    'Orthopedics',
    'General Medicine',
    'Pediatrics',
    'Oncology',
    'Psychiatry',
  ];

  const commonTags = [
    'Follow-up Required',
    'Critical',
    'Routine',
    'Emergency',
    'Surgery',
    'Medication Change',
    'Lab Results Pending',
    'Discharge',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = 'Doctor name is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Record title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Diagnosis is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleVitalSignChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [field]: value,
      },
    }));
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setFormData(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()],
      }));
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const addLabResult = () => {
    if (newLabResult.trim()) {
      setFormData(prev => ({
        ...prev,
        labResults: [...prev.labResults, newLabResult.trim()],
      }));
      setNewLabResult('');
    }
  };

  const removeLabResult = (index: number) => {
    setFormData(prev => ({
      ...prev,
      labResults: prev.labResults.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileNames],
      }));
    }
  };

  const removeAttachment = (attachment: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a !== attachment),
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Basic Information" />
        <Tab label="Medical Details" />
        <Tab label="Vital Signs" />
        <Tab label="Medications & Labs" />
        <Tab label="Attachments & Notes" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Patient Name"
              value={formData.patientName}
              onChange={(e) => handleInputChange('patientName', e.target.value)}
              error={!!errors.patientName}
              helperText={errors.patientName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Patient ID"
              value={formData.patientId}
              onChange={(e) => handleInputChange('patientId', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Doctor Name"
              value={formData.doctorName}
              onChange={(e) => handleInputChange('doctorName', e.target.value)}
              error={!!errors.doctorName}
              helperText={errors.doctorName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Doctor ID"
              value={formData.doctorId}
              onChange={(e) => handleInputChange('doctorId', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={!!errors.department}>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                label="Department"
                onChange={(e) => handleInputChange('department', e.target.value)}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Record Type</InputLabel>
              <Select
                value={formData.recordType}
                label="Record Type"
                onChange={(e) => handleInputChange('recordType', e.target.value)}
              >
                {recordTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Record Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isConfidential}
                  onChange={(e) => handleInputChange('isConfidential', e.target.checked)}
                />
              }
              label="Confidential Record"
            />
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Diagnosis"
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              error={!!errors.diagnosis}
              helperText={errors.diagnosis}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Treatment Plan"
              value={formData.treatment}
              onChange={(e) => handleInputChange('treatment', e.target.value)}
            />
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Blood Pressure"
              value={formData.vitalSigns.bloodPressure}
              onChange={(e) => handleVitalSignChange('bloodPressure', e.target.value)}
              placeholder="e.g., 120/80 mmHg"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Heart Rate"
              value={formData.vitalSigns.heartRate}
              onChange={(e) => handleVitalSignChange('heartRate', e.target.value)}
              placeholder="e.g., 72 bpm"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Temperature"
              value={formData.vitalSigns.temperature}
              onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
              placeholder="e.g., 98.6°F"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Oxygen Saturation"
              value={formData.vitalSigns.oxygenSaturation}
              onChange={(e) => handleVitalSignChange('oxygenSaturation', e.target.value)}
              placeholder="e.g., 95%"
            />
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Medications
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Medication"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addMedication()}
              />
              <Button
                variant="contained"
                onClick={addMedication}
                disabled={!newMedication.trim()}
              >
                <Add />
              </Button>
            </Box>
            <List dense>
              {formData.medications.map((medication, index) => (
                <ListItem key={index}>
                  <ListItemIcon><Medication /></ListItemIcon>
                  <ListItemText primary={medication} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeMedication(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Lab Results
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Lab Result"
                value={newLabResult}
                onChange={(e) => setNewLabResult(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLabResult()}
              />
              <Button
                variant="contained"
                onClick={addLabResult}
                disabled={!newLabResult.trim()}
              >
                <Add />
              </Button>
            </Box>
            <List dense>
              {formData.labResults.map((lab, index) => (
                <ListItem key={index}>
                  <ListItemIcon><Science /></ListItemIcon>
                  <ListItemText primary={lab} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeLabResult(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      )}

      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button
                variant="contained"
                onClick={addTag}
                disabled={!newTag.trim()}
              >
                <Add />
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {commonTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => !formData.tags.includes(tag) && addTag()}
                  color={formData.tags.includes(tag) ? 'primary' : 'default'}
                  variant={formData.tags.includes(tag) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => removeTag(tag)}
                  color="primary"
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Attachments
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload />}
              sx={{ mb: 2 }}
            >
              Upload Files
              <input
                type="file"
                multiple
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <List dense>
              {formData.attachments.map((attachment, index) => (
                <ListItem key={index}>
                  <ListItemIcon><AttachFile /></ListItemIcon>
                  <ListItemText primary={attachment} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeAttachment(attachment)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes or observations..."
            />
          </Grid>
        </Grid>
      )}

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={<Save />}
          disabled={loading}
        >
          {loading ? <LinearProgress sx={{ width: 20, height: 20 }} /> : mode === 'create' ? 'Create Record' : 'Update Record'}
        </Button>
      </Box>
    </Box>
  );
};

export default MedicalRecordForm; 