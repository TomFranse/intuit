import React from 'react';
import { Box, Typography, Grid as MuiGrid } from '@mui/material';
import { useTone } from '../../contexts/ToneContext';
import { AudioInitModal } from '../../components/AudioInitModal/AudioInitModal';
import { OscillatorControls } from '../../components/OscillatorControls/OscillatorControls';
import { VisualizerGroup } from '../../components/VisualizerGroup/VisualizerGroup';
import { PhaseTestSection } from '../../components/PhaseTestSection/PhaseTestSection';
import { useOscillator, DEFAULT_OSCILLATOR_STATE } from '../../hooks/useOscillator';
import { toneCreatorStyles } from './ToneCreator.styles';

const ToneCreator: React.FC = () => {
  const { isInitialized, initializeAudio } = useTone();
  const [showControls, setShowControls] = React.useState(false);

  // Create two oscillators
  const oscillator1 = useOscillator(DEFAULT_OSCILLATOR_STATE);
  const oscillator2 = useOscillator({
    ...DEFAULT_OSCILLATOR_STATE,
    frequency: 660,
  });

  // Initialize controls after audio context is ready
  React.useEffect(() => {
    if (isInitialized && !showControls) {
      setShowControls(true);
    }
  }, [isInitialized]);

  // Get oscillator units for visualizers
  const getOscillatorUnits = () => {
    const analyzer1 = oscillator1.getAnalyzer();
    const analyzer2 = oscillator2.getAnalyzer();
    
    if (!analyzer1 || !analyzer2) return [];

    return [
      { oscillator: analyzer1, gainNode: analyzer1 },
      { oscillator: analyzer2, gainNode: analyzer2 },
    ];
  };

  return (
    <Box sx={toneCreatorStyles.container}>
      <Typography variant="h4" gutterBottom sx={toneCreatorStyles.title}>
        Tone Creator
      </Typography>

      <AudioInitModal 
        open={!isInitialized} 
        onInitialize={initializeAudio} 
      />
      
      {showControls && (
        <>
          <MuiGrid container spacing={4}>
            <MuiGrid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Oscillator 1
              </Typography>
              <OscillatorControls
                state={oscillator1.state}
                onUpdate={oscillator1.updateParameters}
                onTogglePlay={oscillator1.togglePlay}
              />
              {oscillator1.getAnalyzer() && (
                <VisualizerGroup
                  oscillator={oscillator1.getAnalyzer()!}
                  gainNode={oscillator1.getAnalyzer()!}
                />
              )}
            </MuiGrid>

            <MuiGrid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Oscillator 2
              </Typography>
              <OscillatorControls
                state={oscillator2.state}
                onUpdate={oscillator2.updateParameters}
                onTogglePlay={oscillator2.togglePlay}
              />
              {oscillator2.getAnalyzer() && (
                <VisualizerGroup
                  oscillator={oscillator2.getAnalyzer()!}
                  gainNode={oscillator2.getAnalyzer()!}
                />
              )}
            </MuiGrid>
          </MuiGrid>

          <PhaseTestSection
            oscillators={getOscillatorUnits()}
            onUpdateOscillator={(index, updates) => {
              if (index === 0) {
                oscillator1.updateParameters(updates);
              } else {
                oscillator2.updateParameters(updates);
              }
            }}
            onTogglePlay={(index) => {
              if (index === 0) {
                oscillator1.togglePlay();
              } else {
                oscillator2.togglePlay();
              }
            }}
          />
        </>
      )}
    </Box>
  );
};

export default ToneCreator; 