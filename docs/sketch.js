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
let currentWaveIndex = 0; // Start with sine (index 0)

function preload() {
  handPose = ml5.handPose({ flipped: true });
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();
  handPose.detectStart(video, gotHands);

  // Sound oscillator (start with sine)
  osc = new p5.Oscillator(waveTypes[currentWaveIndex]);
  osc.amp(0.5); // Base volume middle (will be overridden)

  // Button to cycle waveform types
  let button = createButton("Change Waveform");
  button.position(10, height + 10); // Below canvas
  button.mousePressed(cycleWaveform);
}

function cycleWaveform() {
  // Cycle to next type
  currentWaveIndex = (currentWaveIndex + 1) % waveTypes.length;
  let newType = waveTypes[currentWaveIndex];
  osc.setType(newType);

  // Visual feedback
  console.log("Waveform changed to: " + newType);
}

function draw() {
  background(220);
  image(video, 0, 0);

  // Display current waveform type on canvas
  fill(0);
  textSize(16);
  text("Waveform: " + waveTypes[currentWaveIndex], 10, 20);

  // Perceive: check for hands (up to 2)
  if (hands.length > 0) {
    // Primary hand (hands[0]) for pitch control
    let hand1 = hands[0];
    let index1 = hand1.index_finger_tip;
    let thumb1 = hand1.thumb_tip;
    let x1 = (index1.x + thumb1.x) * 0.5;
    let y1 = (index1.y + thumb1.y) * 0.5;

    // Visualize primary hand
    noStroke();
    fill(0, 0, 255, 150); // Blue dot for pitch hand
    ellipse(x1, y1, 20, 20);

    let d1 = dist(index1.x, index1.y, thumb1.x, thumb1.y);

    // Secondary hand (if detected) for volume control
    let vol = 0.5; // Default volume if only one hand
    if (hands.length > 1) {
      let hand2 = hands[1];
      let index2 = hand2.index_finger_tip;
      let thumb2 = hand2.thumb_tip;
      let x2 = (index2.x + thumb2.x) * 0.5;
      let y2 = (index2.y + thumb2.y) * 0.5;

      // Visualize secondary hand
      fill(0, 255, 0, 150); // Green dot for volume hand
      ellipse(x2, y2, 20, 20);

      // Map second hand y (top=loud, bottom=quiet) for volume
      vol = map(y2, 0, height, 0.8, 0.1);
    }

    // Pinching on primary hand: compute pitch; else stop
    if (d1 < 20) {
      // Use memory to smooth pitch (average with prevY)
      y1 = (y1 + prevY) / 2;
      prevY = y1; // Update memory

      // Map primary y (top=high pitch, bottom=low) - rule-based decision
      let freq = map(y1, 0, height, 880, 220); // A5 (880Hz) to A3 (220Hz)
      osc.freq(freq);
      if (!osc.started) osc.start();

      // Act visually: pulsing circle size based on freq (behavior visualization)
      let pulseSize = map(freq, 220, 880, 50, 100);
      fill(255, 0, 0, 100); // Red pulse on primary hand
      ellipse(x1, y1, pulseSize + sin(frameCount * 0.2) * 20);

      // Set volume (from second hand)
      osc.amp(vol);
    } else {
      // No pinch on primary -> stop sound
      if (osc.started) osc.stop();
      prevY = height / 2; // Reset memory
    }
  } else {
    // No hands perceived: stop sound
    if (osc.started) osc.stop();
  }
}
