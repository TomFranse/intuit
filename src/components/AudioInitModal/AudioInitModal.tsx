import {
  Modal,
  Box,
  Button,
  Typography,
  Backdrop,
  Fade
} from '@mui/material';
import { VolumeUp } from '@mui/icons-material';

interface AudioInitModalProps {
  open: boolean;
  onInitialize: () => void;
}

export const AudioInitModal = ({ open, onInitialize }: AudioInitModalProps) => {
  return (
    <Modal
      open={open}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)'
          }
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Fade in={open}>
        <Box sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxWidth: 400,
          textAlign: 'center'
        }}>
          <VolumeUp sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" component="h2" gutterBottom>
            Enable Audio
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Click the button below to initialize audio playback. This is required by browsers for web audio to work.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onInitialize}
            startIcon={<VolumeUp />}
          >
            Enable Audio
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}; 