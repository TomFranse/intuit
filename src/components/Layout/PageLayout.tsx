import { ReactNode } from 'react';
import { Box, Container, useTheme } from '@mui/material';

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullHeight?: boolean;
}

export const PageLayout = ({ 
  children, 
  maxWidth = false,
  fullHeight = true 
}: PageLayoutProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: fullHeight ? '100vh' : 'auto',
        width: '100%',
        bgcolor: theme.palette.background.default,
        flex: 1,
        overflow: 'auto'
      }}
    >
      <Container 
        maxWidth={maxWidth}
        disableGutters
        sx={{
          width: '100%',
          maxWidth: '100% !important',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {children}
      </Container>
    </Box>
  );
}; 