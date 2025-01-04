import { SxProps, Theme } from '@mui/material';
import { 
  controlPanelStyles, 
  controlSectionStyles,
  listContainerStyles,
  headerStyles,
  visualizerContainerStyles,
  buttonGroupStyles
} from '../../styles';

export const noteBuilderStyles = {
  layerPanel: {
    ...controlPanelStyles,
    height: '100%',
  },
  layerHeader: {
    ...headerStyles,
  },
  layerList: {
    ...listContainerStyles,
  },
  controlPanel: {
    ...controlPanelStyles,
  },
  controlSection: {
    ...controlSectionStyles,
  },
  buttonGroup: {
    ...buttonGroupStyles,
  },
  layerControls: {
    mb: 4,
    '& > .MuiTypography-subtitle1': {
      mb: 2,
    },
  },
  visualizerContainer: {
    ...visualizerContainerStyles,
    mt: 2,
  },
  combinedVisualizer: {
    mt: 4,
    '& > .MuiTypography-h6': {
      mb: 2,
    },
  },
} satisfies Record<string, SxProps<Theme>>; 