# Simplified Theremin (Terminvox) Recreation

A modern, interactive recreation of the classic Theremin instrument using hand gestures detected via webcam. This project leverages p5.js for canvas rendering and audio synthesis, ml5.js for real-time hand pose estimation. It allows users to control pitch and volume with one or two hands, creating an intuitive, contactless musical experience.

[PLAY HERE](https://berlogabob.github.io/terminvox/)

## Project Overview

This is a simplified digital version of the original Theremin (also known as Terminvox), an electronic musical instrument invented in 1920 by Leon Theremin. Instead of antennas, it uses computer vision to track hand positions and gestures. The system acts as an intelligent agent that perceives hand movements, decides on audio parameters based on rules, and acts by generating sound and visual feedback.

- **Perception**: Detects hands via webcam using ml5.js HandPose model.
- **Decision**: Maps hand height to pitch/volume with smoothing (memory-based) to avoid jitter; triggers sound on pinch gesture.
- **Action**: Produces audio tones via p5.sound oscillator; provides visual cues (dots and pulsing aura).

No physical hardware required—just a webcam-enabled device.

## Features

- **Single-Hand Mode**: Use one hand to control pitch. Pinch to play; move up/down for higher/lower tones.
- **Dual-Hand Mode**: First detected hand controls pitch; second controls volume (higher position = louder).
- **Gesture Control**: 
  - Pinch thumb and index finger to start/stop playing
  - Pinch over wave type buttons to switch waveforms
- **Waveform Selection**:
  - Three waveform options: Sine, Triangle, Square
  - Click buttons to select (left panel)
  - Pinch gesture support with enlarged activation zone
  - Visual icons for each waveform type
- **Real-Time Metering**:
  - Pitch meter showing frequency (220-880 Hz range)
  - Volume meter showing amplitude (0-100%)
  - Vertical bar visualization with color gradient
  - Live updates synchronized with hand position
- **Visual Feedback**:
  - Blue dot appears when a hand is detected
  - Green dot for second hand (volume control)
  - Pulsating red aura around pitch hand when playing
  - Responsive canvas that adapts to window size
- **Professional UI**:
  - Glass-morphism design with blur effects
  - Grayscale color scheme
  - Symmetrical left (controls) and right (meters) panels
  - Top and bottom attribution bars
  - Mobile-responsive layout

## How to Use

### Setup
- Open the project in a browser (Chrome/Firefox recommended for webcam support)
- Allow camera access when prompted
- Ensure good lighting for accurate hand detection

### Playing the Instrument

1. **Hand Detection**:
   - Place your hand in the camera view
   - A blue dot will appear on the detected hand position

2. **Control Pitch** (Primary Hand):
   - Pinch your thumb and index fingers together to start playing
   - You'll see a red pulsating aura around the dot
   - Move hand up and down:
     - **Up**: Increases pitch (higher frequency)
     - **Down**: Decreases pitch (lower frequency)
   - Watch the pitch meter on the right side for real-time frequency feedback
   - Release pinch to stop sound

3. **Control Volume** (Secondary Hand - Optional):
   - Raise a second hand into the camera view
   - Move it up and down:
     - **Up**: Increases volume (louder)
     - **Down**: Decreases volume (quieter)
   - Volume meter on right shows current level

4. **Change Waveform**:
   - Three buttons on left panel: Sine, Triangle, Square
   - **Click method**: Click buttons to select waveform
   - **Pinch method**: Pinch over desired waveform button to select
   - Active button has frosted glass appearance
   - SVG icons clearly indicate waveform type

### Tips for Best Results
- **Lighting**: Ensure good, even lighting around your hand
- **Distance**: Position hand 1-2 feet from webcam
- **Smooth Movement**: Move slowly for musical control
- **Pitch Smoothing**: System smooths pitch changes for a polished sound
- **Button Targeting**: Enlarged pinch zones make gesture selection easier
- **Meter Feedback**: Watch meters to understand gesture impact

## UI Layout

```
┌─────────────────────────────────────────┐
│         [TOP BAR - TITLE]               │
├──────────────────────────────────────────┤
│ [PITCH  ]  ┌─────────────────┐ [METERS]│
│ [VOLUME ]  │  CANVAS VIDEO   │ PITCH▲ │
│ [Wave Type]│  THEREMIN HERE  │ VOL▲  │
│ • SINE  → │                 │        │
│ • TRI   → │                 │        │
│ • SQUARE→ │                 │        │
├──────────────────────────────────────────┤
│     [BOTTOM BAR - STUDENT CREDIT]        │
└─────────────────────────────────────────┘
```

## Technologies Used

- **p5.js v1.11.10**: Canvas rendering, audio synthesis, interactive elements
- **p5.sound**: Oscillator for tone generation
- **ml5.js**: Machine learning for real-time hand pose detection
- **Browser APIs**: Webcam access via `getUserMedia`
- **CSS3**: Glass-morphism effects, responsive design
- **SVG**: Vector icons for waveform types

## Design System

- **Color Scheme**: Grayscale with black, white, and gray tones
- **Glass-Morphism**: Frosted glass effect with blur and transparency
- **Responsive**: Adapts to any window size
- **Accessibility**: High contrast text, clear visual hierarchy
- **Performance**: Optimized for real-time hand tracking

## Responsive Features

- Full-window canvas that scales with viewport
- Coordinate transformation handles video aspect ratio
- Hand detection works at any resolution
- UI panels centered and symmetrical
- Touch-friendly button sizing for mobile/tablet use

## Hand Detection Specifications

- **Pitch Range**: 220 Hz (A3) to 880 Hz (A5)
- **Volume Range**: 0% to 80% amplitude
- **Pinch Threshold**: Fingers closer than 50px apart
- **Gesture Zone**: +20px buffer around buttons for easier targeting
- **Detection Rate**: Real-time (~30fps) hand position updates

## Credits and Inspiration

- Inspired by the original Theremin instrument and computational artists like Vera Molnar and Manolo Gamboa Naón
- Built as part of an AI course assessment demonstrating reactive agent with perception-decision-action cycle
- Enhanced with modern UI/UX principles and gesture-based control

## Student Information

- **Student**: Andrey Dyakov
- **Program**: IADE Creative Computing and Artificial Intelligence

## License

MIT License. Feel free to remix and extend!

## References

- **Theremin Instrument History**:
  - [Theremin - Wikipedia](https://en.wikipedia.org/wiki/Theremin)
  - [History - NY Theremin Society](https://www.nythereminsociety.org/history-2)
  - [The Theremin - Smithsonian Magazine](https://www.smithsonianmag.com/smart-news/theremin-100-years-anniversary-instrument-music-history-180976437/)

- **Hand Pose Detection**:
  - [Hand Pose with ml5.js - Coding Train](https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose/)
  - [ml5.js Documentation](https://docs.ml5js.org/)

- **p5.js & Audio**:
  - [p5.js Reference](https://p5js.org/reference/)
  - [p5.Oscillator Reference](https://p5js.org/reference/p5.sound/p5.Oscillator/)

- **Base Code**:
  - "HandPose Pinch Painting" by ima_ml - adapted for audio control
  - [p5.js Web Editor - HandPose Example](https://editor.p5js.org/ima_ml/sketches/v1x7MSdLW)
