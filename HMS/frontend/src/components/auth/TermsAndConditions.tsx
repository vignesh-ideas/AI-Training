import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';

interface TermsAndConditionsProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  open,
  onAccept,
  onDecline,
}) => {
  const [accepted, setAccepted] = useState(false);

  const terms = [
    'You agree to provide accurate and complete information during registration.',
    'You are responsible for maintaining the confidentiality of your account credentials.',
    'You agree to use the HMS system only for legitimate healthcare purposes.',
    'You understand that your personal health information will be protected under HIPAA regulations.',
    'You consent to receive important notifications via email and SMS.',
    'You agree to comply with all applicable laws and regulations.',
    'You understand that the hospital may suspend or terminate your account for violations.',
    'You consent to the collection and processing of your data as described in our Privacy Policy.',
  ];

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { maxHeight: '80vh' }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="h2">
          Terms and Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please read and accept our terms and conditions
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" paragraph>
          By using the Hospital Management System (HMS), you agree to the following terms and conditions:
        </Typography>

        <List>
          {terms.map((term, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemIcon>
                <Check color="primary" />
              </ListItemIcon>
              <ListItemText primary={term} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body2" paragraph>
            Your privacy is important to us. We collect and process your personal information in accordance with our Privacy Policy, which includes:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Check fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Secure storage of your personal and health information" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Check fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="HIPAA-compliant data protection measures" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Check fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Limited access to authorized healthcare professionals only" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Check fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Regular security audits and updates" />
            </ListItem>
          </List>
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              color="primary"
            />
          }
          label="I have read and agree to the Terms and Conditions and Privacy Policy"
          sx={{ mt: 2 }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onDecline}
          startIcon={<Close />}
          color="error"
        >
          Decline
        </Button>
        <Button
          onClick={handleAccept}
          variant="contained"
          disabled={!accepted}
          startIcon={<Check />}
        >
          Accept & Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsAndConditions; 