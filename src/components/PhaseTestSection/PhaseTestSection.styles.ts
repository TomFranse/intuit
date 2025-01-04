import { SxProps } from '@mui/material';

interface PhaseTestSectionStyles {
  container: SxProps;
  content: SxProps;
  description: SxProps;
  visualizer: SxProps;
  result: SxProps;
}

export const phaseTestSectionStyles: PhaseTestSectionStyles = {
  container: {
    mt: 6,
    width: '100%',
  },
  content: {
    p: 3,
    bgcolor: 'background.paper',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  description: {
    mb: 2,
  },
  visualizer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mb: 2,
  },
  result: {
    mt: 2,
  },
}; 