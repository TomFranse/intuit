import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define custom theme options
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#646cff',
      light: '#747bff',
      dark: '#535bf2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1a1a1a',
      light: '#424242',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#213547',
      secondary: '#666666',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.2,
      marginBottom: '1rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
      marginBottom: '0.75rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
      marginBottom: '0.5rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
          padding: '0.6em 1.2em',
          transition: 'all 0.25s',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '& .MuiSlider-thumb': {
            width: 14,
            height: 14,
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
};

// Create and export the theme
export const theme = createTheme(themeOptions); 