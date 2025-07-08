import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Description,
  PhotoCamera,
  Download,
  Delete,
  Visibility,
  Upload,
  Folder,
  PictureAsPdf,
  Image,
  Description as DocumentIcon,
  Add,
  Edit,
  Search,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

interface PatientDocumentsProps {
  patientId: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  category: 'IDENTIFICATION' | 'MEDICAL_RECORD' | 'INSURANCE' | 'CONSENT_FORM' | 'OTHER';
  uploadDate: string;
  description?: string;
  tags: string[];
  status: 'ACTIVE' | 'ARCHIVED' | 'PENDING';
}

const PatientDocuments: React.FC<PatientDocumentsProps> = ({ patientId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    fetchDocuments();
  }, [patientId]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDocuments: Document[] = [
        {
          id: '1',
          name: 'passport.pdf',
          type: 'application/pdf',
          size: 1024 * 1024, // 1MB
          category: 'IDENTIFICATION',
          uploadDate: '2024-01-15',
          description: 'Government issued passport',
          tags: ['identification', 'government'],
          status: 'ACTIVE',
        },
        {
          id: '2',
          name: 'insurance_card.jpg',
          type: 'image/jpeg',
          size: 512 * 1024, // 512KB
          category: 'INSURANCE',
          uploadDate: '2024-01-15',
          description: 'Blue Cross Blue Shield insurance card',
          tags: ['insurance', 'card'],
          status: 'ACTIVE',
        },
        {
          id: '3',
          name: 'medical_records.pdf',
          type: 'application/pdf',
          size: 2048 * 1024, // 2MB
          category: 'MEDICAL_RECORD',
          uploadDate: '2024-01-10',
          description: 'Previous medical records from other hospital',
          tags: ['medical', 'records', 'history'],
          status: 'ACTIVE',
        },
        {
          id: '4',
          name: 'consent_form.pdf',
          type: 'application/pdf',
          size: 256 * 1024, // 256KB
          category: 'CONSENT_FORM',
          uploadDate: '2024-01-15',
          description: 'Patient consent form for treatment',
          tags: ['consent', 'legal'],
          status: 'ACTIVE',
        },
        {
          id: '5',
          name: 'xray_chest.jpg',
          type: 'image/jpeg',
          size: 1536 * 1024, // 1.5MB
          category: 'MEDICAL_RECORD',
          uploadDate: '2024-01-08',
          description: 'Chest X-ray from recent examination',
          tags: ['xray', 'imaging', 'chest'],
          status: 'ACTIVE',
        },
      ];

      setDocuments(mockDocuments);
    } catch (error) {
      setError('Failed to load documents');
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const getDocumentIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image color="primary" />;
    if (type.includes('pdf')) return <PictureAsPdf color="error" />;
    return <DocumentIcon color="action" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'IDENTIFICATION':
        return 'primary';
      case 'MEDICAL_RECORD':
        return 'success';
      case 'INSURANCE':
        return 'info';
      case 'CONSENT_FORM':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
  };

  const handleDownloadDocument = (document: Document) => {
    toast.success(`Downloading ${document.name}`);
  };

  const handleDeleteDocument = (document: Document) => {
    if (window.confirm(`Are you sure you want to delete ${document.name}?`)) {
      setDocuments(prev => prev.filter(d => d.id !== document.id));
      toast.success(`${document.name} deleted successfully`);
    }
  };

  const handleUploadDocument = () => {
    setUploadDialogOpen(true);
  };

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'ALL' || document.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryStats = () => {
    const stats = documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return stats;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Folder />
          Patient Documents
        </Typography>
        <Button
          variant="contained"
          startIcon={<Upload />}
          onClick={handleUploadDocument}
        >
          Upload Document
        </Button>
      </Box>

      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="ALL">All Categories</MenuItem>
                  <MenuItem value="IDENTIFICATION">Identification</MenuItem>
                  <MenuItem value="MEDICAL_RECORD">Medical Records</MenuItem>
                  <MenuItem value="INSURANCE">Insurance</MenuItem>
                  <MenuItem value="CONSENT_FORM">Consent Forms</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                {filteredDocuments.length} of {documents.length} documents
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Document Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {Object.entries(getCategoryStats()).map(([category, count]) => (
          <Grid item xs={12} md={3} key={category}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color={`${getCategoryColor(category)}.main`}>
                  {count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.replace('_', ' ')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Documents Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || filterCategory !== 'ALL' 
                ? 'No documents match your search criteria.'
                : 'No documents have been uploaded for this patient yet.'
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filteredDocuments.map((document) => (
            <Grid item xs={12} md={6} lg={4} key={document.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getDocumentIcon(document.type)}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" noWrap>
                        {document.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                          label={document.category.replace('_', ' ')}
                          color={getCategoryColor(document.category) as any}
                          size="small"
                        />
                        <Chip
                          label={document.status}
                          color={document.status === 'ACTIVE' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {document.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(document.size)} • Uploaded {document.uploadDate}
                      </Typography>
                      {document.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {document.tags.slice(0, 3).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                          {document.tags.length > 3 && (
                            <Chip
                              label={`+${document.tags.length - 3}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDocument(document)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadDocument(document)}
                        >
                          <Download />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteDocument(document)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Document Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedDocument?.name}
        </DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Box>
              <Typography variant="body1" paragraph>
                {selectedDocument.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Size: {formatFileSize(selectedDocument.size)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Uploaded: {selectedDocument.uploadDate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Type: {selectedDocument.type}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedDocument) {
                handleDownloadDocument(selectedDocument);
              }
              setPreviewOpen(false);
            }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Upload a new document for this patient. Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
          </Typography>
          {/* Upload form would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            toast.success('Document uploaded successfully');
            setUploadDialogOpen(false);
          }}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDocuments; 