import { SxProps } from '@mui/material';

interface OscillatorControlsStyles {
  container: SxProps;
  section: SxProps;
  playButton: SxProps;
  sliderWithInput: SxProps;
}

export const oscillatorControlsStyles: OscillatorControlsStyles = {
  container: {
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  section: {
    width: '100%',
  },
  playButton: {
    width: '100%',
  },
  sliderWithInput: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    '& .MuiSlider-root': {
      flex: 1,
    },
    '& .MuiTextField-root': {
      width: '100px',
    },
  },
}; 