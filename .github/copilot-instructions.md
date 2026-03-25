# Copilot Instructions for Terminvox

## Project Overview

Terminvox is a web-based Theremin recreation using hand gesture control via webcam. It's a reactive agent system that implements a perception-decision-action cycle:

- **Perception**: ml5.js HandPose detects hand positions from webcam
- **Decision**: Maps hand positions to audio parameters (pitch/volume) with smoothing to reduce jitter
- **Action**: Generates audio via p5.sound oscillator and provides visual feedback

The project uses p5.js v2.0.5 with compatibility shims to maintain v1.x behavior.

## Architecture

### Core Files Structure

All source code lives in `docs/` (for GitHub Pages hosting):

- `sketch.js` - Main application logic (agent perception-decision-action cycle)
- `index.html` - Entry point with CDN library imports and UI structure (top/bottom bars)
- `style.css` - Responsive layout styling for full-window canvas with fixed header/footer
- `preload.js` - p5.js 2.0 compatibility layer for preload() support
- `shapes.js` - p5.js 2.0 compatibility layer for v1.x shape drawing
- `data.js` - p5.js 2.0 compatibility layer for v1.x data/touch functions
- `p5.min.js`, `p5.sound.min.js`, `ml5.min.js` - Local library copies

### Page Layout

The application uses a responsive full-window layout:

- **Top Bar** (fixed): Title and emoji-based instructions (👌 Pinch, ✋ Pitch, 🤚 Volume)
- **Canvas Area** (flex): Full-window video/canvas that adapts to window size
- **Bottom Bar** (fixed): Student attribution information
- **Waveform Controls** (fixed): Button and label centered above bottom bar

Canvas dynamically resizes via `windowResized()` function, accounting for fixed bar heights.

### Agent Architecture Pattern

The code follows a reactive agent model:

```javascript
// Perception: detect hands
if (hands.length > 0) {
  // Decision: map hand position to audio parameters
  let freq = map(y1, 0, height, 880, 220);
  
  // Action: generate sound + visuals
  osc.freq(freq);
  osc.start();
}
```

**Primary hand** (first detected, `hands[0]`): Controls pitch via vertical position
**Secondary hand** (second detected, `hands[1]`): Controls volume via vertical position

### Smoothing and Memory

The system maintains `prevY` as memory to smooth pitch changes and prevent jitter:

```javascript
y1 = (y1 + prevY) / 2;  // Average current with previous position
prevY = y1;              // Update memory
```

Always preserve this smoothing mechanism when modifying pitch control logic.

## Key Conventions

### Hand Detection

- Hands are detected continuously by ml5.js HandPose via `gotHands()` callback
- `hands` array is updated asynchronously - always check `hands.length` before accessing
- Hand keypoints used: `index_finger_tip` and `thumb_tip` for pinch detection
- Pinch threshold: `dist() < 20` pixels between thumb and index finger

### Audio Control

- Oscillator instance (`osc`) is created once in `setup()` and reused
- Always check `osc.started` before calling `osc.start()` or `osc.stop()` to avoid multiple starts
- Default frequency range: 220Hz (A3) to 880Hz (A5)
- Default volume range: 0.1 (quiet) to 0.8 (loud)
- Supported waveforms: `"sine"`, `"triangle"`, `"square"`

### Visual Feedback Conventions

- **Blue dot (80px)**: Primary hand (pitch control)
- **Green dot (80px)**: Secondary hand (volume control)  
- **Red pulsing circle (160-200px)**: Active sound generation (appears on pinch)
- Pulse size varies with frequency to visualize pitch changes
- Pulse animation amplitude: 60px (scaled from original 20px)

### Coordinate Mapping

- **Higher Y position** (top of screen, y→0) = Higher pitch / Louder volume
- **Lower Y position** (bottom of screen, y→height) = Lower pitch / Quieter volume

When modifying mappings, maintain this natural "higher = more" convention.

## p5.js Version Compatibility

This project uses **p5.js 2.0.5** but maintains backward compatibility with v1.x behavior through compatibility addons (`preload.js`, `shapes.js`, `data.js`). These files implement:

- `preload()` function support (2.0 uses async/await patterns)
- `bezierVertex()`, `curveVertex()`, `endShape()` v1.x signatures
- Touch event mapping to mouse events
- `append()`, `arrayCopy()` v1.x array utilities

**Do not remove or modify these compatibility files** unless upgrading all code to pure p5.js 2.0 patterns.

## Development Workflow

### Local Testing

Open `docs/index.html` in a web browser with webcam access. For best results:

```bash
# Use a local server to avoid CORS issues with webcam
python3 -m http.server 8000
# Navigate to http://localhost:8000/docs/
```

Or use VS Code Live Server extension.

### Browser Requirements

- Chrome/Edge (recommended - best webcam support)
- Firefox (works but may have slower hand detection)
- Safari (works but requires explicit camera permissions)
- HTTPS required in production (getUserMedia API restriction)

### Debugging Tips

- Check browser console for ml5.js model loading messages
- Hand detection may fail in low light - ensure good lighting
- High CPU usage is normal (real-time video + ML inference)
- Audio issues: check browser autoplay policies (user interaction may be required)

## Common Tasks

### Modifying Frequency Range

Edit the `map()` call in the pinch detection block:

```javascript
let freq = map(y1, 0, height, MAX_FREQ, MIN_FREQ);
```

Note: Inverted min/max because lower Y = higher pitch.

### Adding New Waveforms

1. Add to `waveTypes` array: `let waveTypes = ["sine", "triangle", "square", "sawtooth"];`
2. The existing `cycleWaveform()` function will automatically include it in rotation

### Adjusting Pinch Sensitivity

Modify the distance threshold:

```javascript
if (d1 < THRESHOLD) {  // Current: 20 pixels
```

Larger values = easier to trigger, but may cause false positives.

### Changing Visual Feedback

Visual elements are drawn in the main `draw()` loop after hand detection. Modify the `ellipse()` and `fill()` calls for different colors, sizes, or effects. Pulsing animation uses `sin(frameCount * SPEED)` - adjust `SPEED` for faster/slower pulses.

## Deployment

The project is deployed via **GitHub Pages** from the `docs/` folder. Any changes pushed to `main` branch automatically update the live site at:

https://berlogabob.github.io/terminvox/

No build process required - changes are immediately reflected.
