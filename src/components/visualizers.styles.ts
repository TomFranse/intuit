import { SxProps, Theme } from '@mui/material';

export const visualizerStyles = {
  canvas: {
    width: '100%',
    height: 'auto',
    display: 'block',
    margin: '0 auto',
  },
  colors: (theme: Theme) => ({
    background: theme.palette.background.paper,
    grid: theme.palette.divider,
    text: theme.palette.text.secondary,
    waveform: theme.palette.primary.main,
    combined: theme.palette.secondary.main,
    harmonicGradient: {
      start: theme.palette.primary.light,
      end: theme.palette.primary.main,
    },
  }),
} satisfies Record<string, SxProps<Theme> | ((theme: Theme) => any)>; 