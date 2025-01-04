import React from 'react';
import { ThemeProvider } from '@mui/material';
import { ToneProvider } from './contexts/ToneContext';
import { theme } from './theme';
import ToneCreator from './pages/ToneCreator/ToneCreator';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ToneProvider>
        <ToneCreator />
      </ToneProvider>
    </ThemeProvider>
  );
};

export default App;
