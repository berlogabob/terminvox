# Simplified Theremin (Terminvox) Recreation

A modern, interactive recreation of the classic Theremin instrument using hand gestures detected via webcam. This project leverages p5.js for canvas rendering and audio synthesis, ml5.js for real-time hand pose estimation. It allows users to control pitch and volume with one or two hands, creating an intuitive, contactless musical experience.
[PLAY HERE](berlogabob.github.io/terminvox/)
## Project Overview

This is a simplified digital version of the original Theremin (also known as Terminvox), an electronic musical instrument invented in 1920 by Leon Theremin. Instead of antennas, it uses computer vision to track hand positions and gestures. The system acts as an intelligent agent that perceives hand movements, decides on audio parameters based on rules, and acts by generating sound and some visual feedback.

- **Perception**: Detects hands via webcam using ml5.js HandPose model.
- **Decision**: Maps hand height to pitch/volume with smoothing (memory-based) to avoid jitter; triggers sound on pinch gesture.
- **Action**: Produces audio tones via p5.sound oscillator; provides visual cues (dots and pulsing aura).

No physical hardware required—just a webcam-enabled device.

## Features

- **Single-Hand Mode**: Use one hand to control pitch. Pinch to play; move up/down for higher/lower tones.
- **Dual-Hand Mode**: First detected hand controls pitch; second controls volume (higher position = louder).
- **Gesture Control**: Pinch thumb and index finger to start/stop playing.
- **Visual Feedback**:
  - Purple dot appears when a hand is detected.
  - Pulsating aura (oreol) around the dot when pinching and playing.
- **Waveform Switching**: Button to cycle between sine, triangle, and square waves for different timbres.
- **Tech Integration**: Built with p5.js for core functionality, ml5.js for AI-driven hand tracking.

## How to Use

1. **Setup**:
   - Open the project in a browser (e.g., Chrome for best webcam support).
   - Allow camera access when prompted.

2. **Playing the Instrument**:
   - Place your hand in the camera view. A purple dot will appear on the detected hand position.
   - Pinch your thumb and index fingers together to start playing. You'll see a pulsating aura (oreol) around the dot.
   - Move the first detected hand up and down:
     - Up: Increases pitch (higher frequency).
     - Down: Decreases pitch (lower frequency).
   - If using a second hand, move it up and down:
     - Up: Increases volume (louder).
     - Down: Decreases volume (quieter).
   - Release the pinch to stop the sound.

3. **Change Waveform**:
   - Click the "Change Waveform" button below the canvas to cycle through sine (smooth), triangle (bright), and square (harsh) tones.

4. **Tips**:
   - Ensure good lighting for accurate hand detection.
   - The system smooths pitch changes for a more musical feel.
   - On touchscreens, tap the button to change waveforms.

## Technologies Used

- **p5.js**: Core library for canvas drawing, audio generation (via p5.sound), and interactive elements.
- **ml5.js**: Machine learning library for hand pose detection, enabling gesture-based input.
- **Browser APIs**: Webcam access via `getUserMedia` for real-time input.

## Credits and Inspiration

- Inspired by the original Theremin instrument and computational artists like Vera Molnar (structured patterns) and Manolo Gamboa Naón (organic flows).
- Built as part of an AI course assessment (Task 2: Agents, Behavior & Emergence), demonstrating a reactive agent with perception-decision-action cycle.

## License

MIT License. Feel free to remix and extend!

For questions or contributions, contact me with GitHub issues.

## References

- **Theremin Instrument History**: Background on the original Theremin invention and its operation.  
  [Theremin - Wikipedia](https://en.wikipedia.org/wiki/Theremin)  
  [HISTORY - THE NY THEREMIN SOCIETY](https://www.nythereminsociety.org/history-2)  
  [The Soviet Spy Who Invented the First Major Electronic Instrument - Smithsonian](https://www.smithsonianmag.com/smart-news/theremin-100-years-anniversary-instrument-music-history-180976437/)

- **Coding Train (Hand Pose Detection Tutorial)**: Tutorial and video on using ml5.js HandPose with p5.js for gesture detection.  
  [Hand Pose Detection with ml5.js - The Coding Train](https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose/)  
  [Hand Pose Detection with ml5.js - YouTube](https://www.youtube.com/watch?v=vfNHdVbE-l4)

- **p5.js Official Documentation**: Core reference for p5.js functions, including setup, draw, and interaction basics.  
  [p5.js Reference](https://p5js.org/reference/)

- **ml5.js Official Documentation (HandPose)**: Documentation for ml5.js library, including HandPose model for hand tracking.  
  [ml5.js Reference](https://docs.ml5js.org/)  
  [Hand Pose Detection with ml5.js - The Coding Train](https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose/)

- **Base Example Sketch**: The foundational p5.js sketch using ml5 HandPose for pinch-based interaction, adapted for this Theremin recreation. Titled "HandPose Pinch Painting" by ima_ml; it demonstrates gesture detection for drawing, which was remixed here for audio control.  
  [HandPose Pinch Painting - p5.js Web Editor](https://editor.p5js.org/ima_ml/sketches/v1x7MSdLW)


- **p5.sound Documentation (Oscillator)**: Reference for audio synthesis in p5.js, used for generating tones.  
  [p5.Oscillator - p5.js Reference](https://p5js.org/reference/p5.sound/p5.Oscillator/)
