import React, { createContext, useContext, useState, useCallback } from 'react';
import * as Tone from 'tone';

interface ToneContextType {
  isInitialized: boolean;
  initializeAudio: () => Promise<void>;
}

const ToneContext = createContext<ToneContextType | undefined>(undefined);

export const ToneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

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
    <ToneContext.Provider value={{ isInitialized, initializeAudio }}>
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