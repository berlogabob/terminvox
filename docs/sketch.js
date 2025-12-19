// Simplified Theremin vox.
// Perceives: hand positions via webcam (ml5 HandPose) - supports two hands
// Decides: pitch based on first hand height; volume based on second hand height (if present) 
// Acts: generates tone (audio + visual feedback)

let video; // Variable to hold the webcam video feed
let handPose; // Variable to hold the hand pose model
let hands = []; // Array to store detected hand positions
let osc;  // Oscillator for sound generation
let prevY = 0;  // Memory: previous y for smoothing pitch
let waveTypes = ['sine', 'triangle', 'square'];  // Supported wave types
let currentWaveIndex = 0;  // Start with sine (index 0)

function preload() {
  handPose = ml5.handPose({ flipped: true }); // Load ml5 hand pose model
}

function gotHands(results) {
  hands = results; // Store detected hand positions
}

function setup() {
  createCanvas(640, 480); // Create canvas for visualization
  video = createCapture(VIDEO, { flipped: true }); // Start webcam
  video. hide(); // Hide video feed
  handPose.detectStart(video, gotHands); // Start hand pose detection
  
  // Sound oscillator (start with sine)
  osc = new p5.Oscillator(waveTypes[currentWaveIndex]); // Initialize oscillator
  osc.amp(0.5);  // Base volume middle (will be overridden)
  
  // Button to cycle waveform types
  let button = createButton('Change Waveform'); // Create button for waveform change
  button. position(10, height + 10);  // Position button below canvas
  button. mousePressed( cycleWaveform ); // Attach event listener
}

function cycleWaveform() {
  // Cycle to next type
  currentWaveIndex = (currentWaveIndex + 1) % waveTypes.length; // Increment index
  let newType = waveTypes[currentWaveIndex]; // Get new waveform type
  osc. setType(newType); // Set oscillator waveform type
  
  // Visual feedback
  console. log('Waveform changed to: ' + newType); // Log change
}

function draw() {
  background(220); // Clear canvas with light gray background
  image(video, 0, 0); // Display webcam feed
  
  // Display current waveform type on canvas
  fill(0); // Set text color to black
  textSize(16); // Set text size
  text('Waveform: ' + waveTypes[currentWaveIndex], 10, 20); // Display waveform type
  
  // Perceive: check for hands (up to 2)
  if (hands. length > 0) { // Check if any hands detected
    // Primary hand (hands[0]) for pitch control
    let hand1 = hands[0]; // Get first hand
    let index1 = hand1. index_ finger_ tip; // Get index finger tip
    let thumb1 = hand1. thumb_ tip; // Get thumb tip
    let x1 = (index1. x + thumb1. x) * 0.5; // Average x position
    let y1 = (index1. y + thumb1. y) * 0.5; // Average y position
    
    // Visualize primary hand
    noStroke(); // No outline
    fill(0, 0, 255, 150);  // Blue dot for pitch hand
    ellipse(x1, y1, 20, 20); // Draw circle for hand
    
    let d1 = dist(index1. x, index1. y, thumb1. x, thumb1. y); // Distance between index and thumb
    
    // Secondary hand (if detected) for volume control
    let vol = 0.5;  // Default volume if only one hand
    if (hands. length > 1) { // Check if second hand detected
      let hand2 = hands[1]; // Get second hand
      let index2 = hand2. index_ finger_ tip; // Get index finger tip
      let thumb2 = hand2. thumb_ tip; // Get thumb tip
      let x2 = (index2. x + thumb2. x) * 0.5; // Average x position
      let y2 = (index2. y + thumb2. y) * 0.5; // Average y position
      
      // Visualize secondary hand
      fill(0, 255, 0, 150);  // Green dot for volume hand
      ellipse(x2, y2, 20, 20); // Draw circle for hand
      
      // Map second hand y (top=loud, bottom=quiet) for volume
      vol = map(y2, 0, height, 0.8, 0.1); // Map y position to volume
    }
    
    // Pinching on primary hand: compute pitch; else stop
    if (d1 < 20) { // Check if pinched
      // Use memory to smooth pitch (average with prevY)
      y1 = (y1 + prevY) / 2; // Smooth pitch
      prevY = y1;  // Update memory
      
      // Map primary y (top=high pitch, bottom=low) - rule-based decision
      let freq = map(y1, 0, height, 880, 220);  // A5 (880Hz) to A3 (220Hz)
      osc. freq(freq); // Set oscillator frequency
      if (!osc. started) osc. start(); // Start oscillator if not running
      
      // Act visually: pulsing circle size based on freq (behavior visualization)
      let pulseSize = map(freq, 220, 880, 50, 100); // Map frequency to size
      fill(255, 0, 0, 100);  // Red pulse on primary hand
      ellipse(x1, y1, pulseSize + sin(frameCount * 0.2) * 20); // Draw pulsing circle
      
      // Set volume (from second hand)
      osc. amp(vol); // Set oscillator amplitude
    } else { // No pinch on primary -> stop sound
      if (osc. started) osc. stop(); // Stop oscillator if running
      prevY = height / 2;  // Reset memory
    }
  } else { // No hands perceived: stop sound
    if (osc. started) osc. stop(); // Stop oscillator if running
  }
}
