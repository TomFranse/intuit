App Overview
The app is a real-time audio generation and synthesis tool designed for the web, with potential future release on the Play Store. Users can create, modify, and layer tones with interactive tools. The app must offer immediate feedback and maintain low-latency performance.

Pages and Functionalities
1. Tone Creator
Purpose: Allow users to generate tones with granular control over frequency, amplitude, phase, and harmonic content.
Core Controls (Sliders):
Frequency (Hz): Adjustable via a slider or input box.
Amplitude (0–1): Slider to set overall tone loudness.
Phase (Degrees or Radians): Slider to adjust the starting phase of the tone.
Harmonics:
Spacing/Harmonicity: Slider to adjust overtone spacing (harmonic vs. inharmonic).
Amplitude (Per Harmonic): Slider or list of sliders for overtone amplitudes.
Phase (Per Harmonic): Slider for each harmonic phase adjustment.
Additional Features:
Visualization: Include real-time waveform visualization and frequency spectrum display.
Advanced Mode: Future option for a more interactive, visual overtone editor (e.g., drag-and-drop overtones on a frequency grid).
Dependencies:
Tone.js: For audio synthesis and real-time feedback.
D3.js or P5.js: For visualization of waveforms and harmonics.

2. Note Builder
Purpose: Transform tones into playable notes by layering multiple tones and adding envelope controls.
Core Features:
Tone Layering:
Import tones from the Tone Library
Layer multiple tones with individual controls
Adjust relative amplitudes and phases
Envelope Controls:
Drawing Area: Canvas-based interface for envelope creation
ADSR parameters for each tone layer
Real-time preview of the combined sound
Additional Features:
Save notes as presets
Export notes to the Tone Library
Visualization of the combined waveform
Dependencies:
Tone.js: For audio synthesis and envelope control
React-canvas or P5.js: For envelope drawing interface

3. Tone Library
Purpose: Store and manage user-created tones and notes for reuse in other parts of the app.
Core Features:
Library Categories:
Tones: Basic sound building blocks
Notes: Tones with envelopes and layering
List Features:
Display with name, description, and playback button
CRUD Operations for both tones and notes
Import/Export functionality for sharing
Dependencies:
IndexedDB (or localStorage): For persistent storage
Tone.js: For tone and note playback

4. Loop Builder
Purpose: Enable users to arrange and layer notes from their library into a timeline for testing combinations.
Core Features:
Timeline Interface:
Drag-and-drop notes onto a timeline
Adjustable start time, duration, and looping
Playback Controls:
Play, pause, stop, and loop options
Note References:
Link directly from the tone library
Visualization:
Display waveform previews in timeline
Advanced Features:
Volume Automation per note
Multi-layer playback with accurate timing
Dependencies:
Tone.js: For timeline-based playback and synchronization
React-dnd: For timeline arrangement

High-Level Architecture
Frontend:
React VITE v6.0.6: Core framework for the user interface.
Tone.js: For audio synthesis and playback.
Canvas Libraries: For visualization (e.g., P5.js, React-canvas).
Backend (Optional for Future Syncing):
No backend required initially. Use IndexedDB or localStorage for saving tones and loops.
Optionally integrate with Firebase for cross-device syncing.
Performance Considerations:
Optimize for real-time feedback with efficient use of Tone.js.
Use debouncing for slider inputs to avoid performance bottlenecks.
Preload assets and minimize memory usage for mobile compatibility.
Repository structure

audio-generator-app/
├── src/
│   ├── components/   # Reusable UI components (e.g., sliders, knobs, visualizers)
│   ├── pages/        # Pages (ToneCreator, EnvelopeDrawer, etc.)
│   ├── assets/       # Images, icons, or other static assets
│   ├── styles/       # CSS or SCSS files
│   ├── App.jsx       # Main React component
│   ├── main.jsx      # Entry point
│   └── utils/        # Helper functions (e.g., Tone.js setup)
├── public/           # Public static files
├── package.json      # Project metadata and dependencies
├── vite.config.js    # Vite configuration
└── README.md         # Project documentation


Development Steps
Set Up Tone.js: Implement the base tone generator with sliders for fundamental and overtone parameters.
Add Visualization: Use a library like D3.js to show real-time waveforms and harmonic content.
Develop Envelope Drawer: Create a canvas-based drawing area and link it to dynamic envelope shaping.
Implement Tone Library: Build CRUD operations for storing tones and integrate playback functionality.
Build Loop Builder: Create the timeline interface, drag-and-drop functionality, and playback engine.

Key Deliverables
Fully functional web app with low-latency tone generation.
User-friendly interfaces for tone creation, envelope drawing, tone management, and loop building.
Scalable architecture for potential future mobile app deployment.
