import { SxProps, Theme } from '@mui/material';

// Common container styles
export const containerStyles: SxProps<Theme> = {
  width: '100%',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

// Control panel styles (used in both ToneCreator and NoteBuilder)
export const controlPanelStyles: SxProps<Theme> = {
  p: 3,
  height: '100%',
  bgcolor: 'background.paper',
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
};

// Visualizer container styles
export const visualizerContainerStyles: SxProps<Theme> = {
  p: 1,
  bgcolor: 'grey.50',
  borderRadius: 1,
  mb: 3,
};

// Control section styles
export const controlSectionStyles: SxProps<Theme> = {
  mb: 3,
  '& .MuiTypography-root': {
    mb: 1,
  },
};

// Grid container styles
export const gridContainerStyles: SxProps<Theme> = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(2, 1fr)',
  },
};

// Button group styles
export const buttonGroupStyles: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  mb: 3,
};

// Slider with input styles
export const sliderWithInputStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: 2,
  alignItems: 'center',
};

// Header styles
export const headerStyles: SxProps<Theme> = {
  mb: 4,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

// List container styles
export const listContainerStyles: SxProps<Theme> = {
  flex: 1,
  overflowY: 'auto',
  '& .MuiListItem-root': {
    mb: 1,
    bgcolor: 'background.default',
    borderRadius: 1,
  },
};

// Test section styles
export const testSectionStyles: SxProps<Theme> = {
  mt: 4,
  p: 2,
  bgcolor: 'grey.50',
  borderRadius: 1,
}; 