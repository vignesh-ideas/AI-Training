import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Avatar,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  PhotoCamera,
  Crop,
  ZoomIn,
  ZoomOut,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface ProfilePictureUploadProps {}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = () => {
  const { user, updateProfilePicture } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!previewImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsLoading(true);
    try {
      // Convert base64 to blob
      const response = await fetch(previewImage);
      const blob = await response.blob();
      
      // Create file from blob
      const file = new File([blob], 'profile-picture.jpg', { type: 'image/jpeg' });
      
      await updateProfilePicture(file);
      toast.success('Profile picture updated successfully!');
      setPreviewImage(null);
    } catch (error) {
      toast.error('Failed to upload profile picture. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <PhotoCamera color="primary" />
            <Typography variant="h6" component="h2">
              Profile Picture
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload a profile picture to personalize your account. Supported formats: JPG, PNG, GIF. Maximum size: 5MB.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            {/* Current Profile Picture */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Picture
              </Typography>
              <Avatar
                src={user?.profilePicture}
                sx={{ width: 120, height: 120, mb: 2 }}
              >
                {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
              </Avatar>
            </Box>

            {/* Upload Area */}
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                border: dragActive ? '2px dashed' : '1px solid',
                borderColor: dragActive ? 'primary.main' : 'divider',
                backgroundColor: dragActive ? 'action.hover' : 'background.paper',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={handleCameraClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />

              {previewImage ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={previewImage}
                    sx={{ width: 120, height: 120, mb: 2, mx: 'auto' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Preview of new profile picture
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Upload Profile Picture
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Drag and drop an image here, or click to browse
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    JPG, PNG, GIF up to 5MB
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<PhotoCamera />}
                onClick={handleCameraClick}
                disabled={isLoading}
              >
                Choose File
              </Button>

              {previewImage && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
                  >
                    {isLoading ? 'Uploading...' : 'Upload Picture'}
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleRemove}
                    disabled={isLoading}
                  >
                    Remove
                  </Button>
                </>
              )}
            </Box>

            {/* Tips */}
            <Alert severity="info" sx={{ mt: 2, maxWidth: 400 }}>
              <Typography variant="body2">
                <strong>Tips for a great profile picture:</strong>
              </Typography>
              <Typography variant="body2" component="ul" sx={{ mt: 1, mb: 0 }}>
                <li>Use a clear, high-quality image</li>
                <li>Ensure good lighting and contrast</li>
                <li>Center your face in the frame</li>
                <li>Use a professional or friendly expression</li>
              </Typography>
            </Alert>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePictureUpload; 