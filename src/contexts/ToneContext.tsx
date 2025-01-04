import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import * as Tone from 'tone';

interface ToneContextType {
  isInitialized: boolean;
  initializeAudio: () => Promise<void>;
  cleanupAudio: () => Promise<void>;
}

const ToneContext = createContext<ToneContextType | undefined>(undefined);

export const ToneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const cleanupInProgressRef = useRef(false);

  const cleanupAudio = useCallback(async () => {
    if (cleanupInProgressRef.current) return;
    cleanupInProgressRef.current = true;

    try {
      // Stop all active audio
      Tone.Transport.stop();
      
      // Get all active audio nodes
      const context = Tone.getContext();
      const activeNodes = Array.from(context._activeSourceNodes);
      
      // Disconnect and dispose all active nodes
      activeNodes.forEach(node => {
        try {
          if (node && !node.disposed) {
            node.disconnect();
            node.dispose();
          }
        } catch (error) {
          console.warn('Error disposing node:', error);
        }
      });

      // Wait a small amount of time for cleanup to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error during audio cleanup:', error);
    } finally {
      cleanupInProgressRef.current = false;
    }
  }, []);

  const initializeAudio = useCallback(async () => {
    try {
      await Tone.start();
      // Start Transport with default settings
      Tone.Transport.bpm.value = 120;
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  }, []);

  return (
    <ToneContext.Provider value={{ isInitialized, initializeAudio, cleanupAudio }}>
      {children}
    </ToneContext.Provider>
  );
};

export const useTone = () => {
  const context = useContext(ToneContext);
  if (context === undefined) {
    throw new Error('useTone must be used within a ToneProvider');
  }
  return context;
}; 