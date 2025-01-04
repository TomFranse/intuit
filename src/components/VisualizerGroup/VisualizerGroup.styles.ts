import { SxProps } from '@mui/material';

interface VisualizerGroupStyles {
  container: SxProps;
  section: SxProps;
  visualizerContainer: SxProps;
}

export const visualizerGroupStyles: VisualizerGroupStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    mt: 4,
  },
  section: {
    width: '100%',
  },
  visualizerContainer: {
    p: 2,
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'background.paper',
  },
}; 