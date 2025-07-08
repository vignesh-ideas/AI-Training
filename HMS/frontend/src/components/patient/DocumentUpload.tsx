import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
} from '@mui/material';
import {
  CloudUpload,
  Description,
  Delete,
  CheckCircle,
  Error,
  PhotoCamera,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

interface DocumentUploadProps {
  onNext: (documents: any[]) => void;
  onBack: () => void;
  patientId: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onNext,
  onBack,
  patientId,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      status: 'uploading',
      progress: 0,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    handleFileUpload(newFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  const handleFileUpload = async (files: UploadedFile[]) => {
    setIsUploading(true);

    for (const file of files) {
      try {
        // Simulate file upload with progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, progress } : f
            )
          );
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Simulate successful upload
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: 'success', progress: 100 } : f
          )
        );

        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, status: 'error', error: 'Upload failed' }
              : f
          )
        );
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast.success('File removed');
  };

  const handleNext = () => {
    const successfulFiles = uploadedFiles.filter((f) => f.status === 'success');
    if (successfulFiles.length === 0) {
      toast.error('Please upload at least one document');
      return;
    }
    onNext(successfulFiles);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <PhotoCamera />;
    if (type.includes('pdf')) return <DocumentIcon />;
    return <Description />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <CircularProgress size={20} />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload patient documents and identification. Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB each)
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Patient ID:</strong> {patientId}
        </Typography>
      </Alert>

      {/* Document Categories */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Required Documents
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Government ID (Passport, Driver's License, etc.)
                <br />
                • Insurance Card (if applicable)
                <br />
                • Previous Medical Records
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Optional Documents
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Emergency Contact Information
                <br />
                • Power of Attorney (if applicable)
                <br />
                • Living Will or Advance Directives
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upload Area */}
      <Paper
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          or click to select files
        </Typography>
        <Button variant="outlined" component="span">
          Choose Files
        </Button>
      </Paper>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded Files ({uploadedFiles.filter(f => f.status === 'success').length}/{uploadedFiles.length})
          </Typography>
          <List>
            {uploadedFiles.map((file) => (
              <ListItem
                key={file.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  {getFileIcon(file.type)}
                </Box>
                <ListItemText
                  primary={file.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                      {file.status === 'uploading' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {file.progress}%
                          </Typography>
                        </Box>
                      )}
                      {file.error && (
                        <Typography variant="body2" color="error">
                          {file.error}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getStatusIcon(file.status)}
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveFile(file.id)}
                      disabled={file.status === 'uploading'}
                      sx={{ ml: 1 }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* File Status Summary */}
      {uploadedFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {uploadedFiles.filter(f => f.status === 'success').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Successfully Uploaded
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {uploadedFiles.filter(f => f.status === 'uploading').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Currently Uploading
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error">
                    {uploadedFiles.filter(f => f.status === 'error').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Failed Uploads
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={isUploading}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={isUploading || uploadedFiles.filter(f => f.status === 'success').length === 0}
          sx={{ minWidth: 120 }}
        >
          {isUploading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Next'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentUpload; 