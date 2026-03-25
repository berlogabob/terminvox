// Simplified Theremin vox.
// Perceives: hand positions via webcam (ml5 HandPose) - supports two hands
// Decides: pitch based on first hand height; volume based on second hand height (if present)
// Acts: generates tone (audio + visual feedback)

let video;
let handPose;
let hands = [];
let osc; // Oscillator for sound
let prevY = 0; // Memory: previous y for smoothing pitch
let waveTypes = ["sine", "triangle", "square"]; // Supported wave types
let waveIconFiles = ["batch_Wave_type_sin.svg", "batch_Wave_type_Tri.svg", "batch_Wave_type_Sq.svg"]; // SVG icon files
let currentWaveIndex = 0; // Start with sine (index 0)
let waveButtons = []; // Array to store waveform buttons
let currentFreq = 0; // Track current pitch frequency
let currentVolume = 0; // Track current volume

function preload() {
  handPose = ml5.handPose({ flipped: true });
}

function gotHands(results) {
  hands = results;
}

function setup() {
  // Calculate canvas size accounting for top and bottom bars
  let topBarHeight = 80; // Approximate height of top bar
  let bottomBarHeight = 40; // Approximate height of bottom bar
  let canvasHeight = windowHeight - topBarHeight - bottomBarHeight;
  
  let canvas = createCanvas(windowWidth, canvasHeight);
  canvas.parent('canvas-container');
  
  video = createCapture(VIDEO, { flipped: true });
  video.hide();
  handPose.detectStart(video, gotHands);

  // Sound oscillator (start with sine)
  osc = new p5.Oscillator(waveTypes[currentWaveIndex]);
  osc.amp(0.5); // Base volume middle (will be overridden)

  // Create waveform selection buttons
  createWaveformButtons();
}

function windowResized() {
  // Recalculate canvas size on window resize
  let topBarHeight = 80;
  let bottomBarHeight = 40;
  let canvasHeight = windowHeight - topBarHeight - bottomBarHeight;
  resizeCanvas(windowWidth, canvasHeight);
}

function createWaveformButtons() {
  // Create a button for each waveform type
  for (let i = 0; i < waveTypes.length; i++) {
    // Create button with SVG icon and text
    let buttonHTML = '<img src="' + waveIconFiles[i] + '" class="wave-icon" alt="' + waveTypes[i] + '">' + 
                     '<span class="wave-name">' + waveTypes[i].toUpperCase() + '</span>';
    let btn = createButton(buttonHTML);
    btn.class('wave-btn');
    btn.id('wave-btn-' + i);
    btn.parent('waveform-buttons-container');
    btn.mousePressed(() => selectWaveform(i));
    waveButtons.push(btn);
  }
  // Set initial active button
  updateButtonStates();
}

function selectWaveform(index) {
  currentWaveIndex = index;
  let newType = waveTypes[index];
  osc.setType(newType);
  updateButtonStates();
  console.log("Waveform changed to: " + newType);
}

function updateButtonStates() {
  // Update visual state of buttons
  for (let i = 0; i < waveButtons.length; i++) {
    if (i === currentWaveIndex) {
      waveButtons[i].addClass('active');
    } else {
      waveButtons[i].removeClass('active');
    }
  }
}

function cycleWaveform() {
  // Cycle to next type
  currentWaveIndex = (currentWaveIndex + 1) % waveTypes.length;
  selectWaveform(currentWaveIndex);
}

function updateMeters() {
  // Update pitch meter (220-880 Hz range)
  let pitchPercent = map(currentFreq, 220, 880, 0, 100);
  pitchPercent = constrain(pitchPercent, 0, 100);
  document.getElementById('pitch-meter').style.height = pitchPercent + '%';
  document.getElementById('pitch-value').textContent = Math.round(currentFreq) + ' Hz';
  
  // Update volume meter (0-0.8 range, shown as percentage)
  let volumePercent = map(currentVolume, 0, 0.8, 0, 100);
  volumePercent = constrain(volumePercent, 0, 100);
  document.getElementById('volume-meter').style.height = volumePercent + '%';
  document.getElementById('volume-value').textContent = Math.round(volumePercent) + '%';
}


function draw() {
  background(220);
  
  // Calculate video scaling/positioning variables
  let videoAspect, canvasAspect;
  let drawWidth, drawHeight, drawX, drawY;
  let scaleX, scaleY; // Scale factors for hand coordinate transformation
  
  // Draw video with proper aspect ratio (cover mode)
  if (video && video.width > 0) {
    videoAspect = video.width / video.height;
    canvasAspect = width / height;
    
    if (canvasAspect > videoAspect) {
      // Canvas is wider - fit to width
      drawWidth = width;
      drawHeight = width / videoAspect;
      drawX = 0;
      drawY = (height - drawHeight) / 2;
    } else {
      // Canvas is taller - fit to height
      drawWidth = height * videoAspect;
      drawHeight = height;
      drawX = (width - drawWidth) / 2;
      drawY = 0;
    }
    
    // Calculate scale factors for coordinate transformation
    scaleX = drawWidth / video.width;
    scaleY = drawHeight / video.height;
    
    image(video, drawX, drawY, drawWidth, drawHeight);
  } else {
    // Fallback while video is loading
    drawX = 0;
    drawY = 0;
    scaleX = width / (video.width || 640);
    scaleY = height / (video.height || 480);
    image(video, 0, 0, width, height);
  }
  
  // Perceive: check for hands (up to 2)
  if (hands.length > 0) {
    // Primary hand (hands[0]) for pitch control
    let hand1 = hands[0];
    let index1 = hand1.index_finger_tip;
    let thumb1 = hand1.thumb_tip;
    
    // Transform coordinates to match displayed video
    let x1 = (index1.x * scaleX + thumb1.x * scaleX) * 0.5 + drawX;
    let y1 = (index1.y * scaleY + thumb1.y * scaleY) * 0.5 + drawY;

    // Visualize primary hand (increased size from 20 to 80)
    noStroke();
    fill(0, 0, 255, 150); // Blue dot for pitch hand
    ellipse(x1, y1, 80, 80);

    let d1 = dist(index1.x, index1.y, thumb1.x, thumb1.y);
    
    // Calculate canvas offset on screen for coordinate system conversion
    let canvasContainer = document.getElementById('canvas-container');
    let canvasRect = canvasContainer.getBoundingClientRect();
    
    // Convert canvas coordinates to screen coordinates for button collision detection
    let screenX1 = x1 + canvasRect.left;
    let screenY1 = y1 + canvasRect.top;
    
    // Check for gesture-based waveform selection (pinch in left panel zone)
    checkGestureSelection(screenX1, screenY1, d1);

    // Secondary hand (if detected) for volume control
    let vol = 0.5; // Default volume if only one hand
    if (hands.length > 1) {
      let hand2 = hands[1];
      let index2 = hand2.index_finger_tip;
      let thumb2 = hand2.thumb_tip;
      
      // Transform coordinates to match displayed video
      let x2 = (index2.x * scaleX + thumb2.x * scaleX) * 0.5 + drawX;
      let y2 = (index2.y * scaleY + thumb2.y * scaleY) * 0.5 + drawY;

      // Visualize secondary hand (increased size from 20 to 80)
      fill(0, 255, 0, 150); // Green dot for volume hand
      ellipse(x2, y2, 80, 80);

      // Map second hand y (top=loud, bottom=quiet) for volume
      // Use original y coordinate for pitch/volume mapping
      vol = map(index2.y, 0, video.height, 0.8, 0.1);
    }

    // Pinching on primary hand: compute pitch; else stop
    if (d1 < 20) {
      // Use memory to smooth pitch (average with prevY)
      // Use original video coordinate for pitch calculation
      let y1_original = (index1.y + thumb1.y) * 0.5;
      y1_original = (y1_original + prevY) / 2;
      prevY = y1_original; // Update memory

      // Map primary y (top=high pitch, bottom=low) - rule-based decision
      // Use original video height for consistent pitch mapping
      let freq = map(y1_original, 0, video.height, 880, 220); // A5 (880Hz) to A3 (220Hz)
      osc.freq(freq);
      currentFreq = freq; // Track for meters
      if (!osc.started) osc.start();

      // Act visually: pulsing circle size based on freq (scaled from 50-100 to 160-200)
      let pulseSize = map(freq, 220, 880, 160, 200);
      fill(255, 0, 0, 100); // Red pulse on primary hand
      ellipse(x1, y1, pulseSize + sin(frameCount * 0.2) * 60);

      // Set volume (from second hand)
      currentVolume = vol; // Track for meters
      osc.amp(vol);
    } else {
      // No pinch on primary -> stop sound
      if (osc.started) osc.stop();
      prevY = video.height / 2; // Reset memory to middle of video
      currentFreq = 0; // Reset meter
      currentVolume = 0;
    }
  } else {
    // No hands perceived: stop sound
    if (osc.started) osc.stop();
    currentFreq = 0; // Reset meters
    currentVolume = 0;
  }
  
  // Update meter displays
  updateMeters();
}

function checkGestureSelection(handX, handY, pinchDist) {
  // Check if hand is pinching over any button in the left panel
  if (pinchDist < 50) { // Increased threshold from 20 to 50 for easier pinching
    // Get actual button elements and their positions
    for (let i = 0; i < waveButtons.length; i++) {
      let btn = waveButtons[i].elt; // Get DOM element
      let rect = btn.getBoundingClientRect();
      
      // Expand collision zone by 20px in all directions for easier targeting
      let expandZone = 20;
      
      // Check if hand is within expanded button area
      if (handX > rect.left - expandZone && handX < rect.left + rect.width + expandZone &&
          handY > rect.top - expandZone && handY < rect.top + rect.height + expandZone) {
        // Only switch if different from current
        if (i !== currentWaveIndex) {
          console.log("Gesture detected! Selecting wave type: " + waveTypes[i] + " (hand at " + Math.round(handX) + "," + Math.round(handY) + ", button at " + Math.round(rect.left) + "," + Math.round(rect.top) + ")");
          selectWaveform(i);
        }
        break;
      }
    }
  }
}
