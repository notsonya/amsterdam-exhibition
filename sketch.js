let video;
let hands = [];
let previousFingertipPositions = [];
let fingertipPaths = [];
let lastFingertipPositions = [];
let asciiSymbols = ['*', '#', '%', '@', '+']; // List of ASCII symbols
let trailLength = 30; // Number of symbols in the trail


function preload() {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(2560 x 1664);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0, width, height);

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    let fingertipIndices = [4, 8, 12, 16, 20];

    for (let j = 0; j < fingertipIndices.length; j++) {
      let keypoint = hand.keypoints[fingertipIndices[j]];
      let fingertipPos = createVector(keypoint.x, keypoint.y);

      if (!fingertipPaths[i]) {
        fingertipPaths[i] = [];
      }
      if (!lastFingertipPositions[i]) {
        lastFingertipPositions[i] = [];
      }
      if (!fingertipPaths[i][j]) {
        fingertipPaths[i][j] = [];
      }
      if (!lastFingertipPositions[i][j]) {
        lastFingertipPositions[i][j] = fingertipPos.copy();
      }

      let smoothPos = p5.Vector.lerp(lastFingertipPositions[i][j], fingertipPos, 0.1); // Adjust 0.1 for smoother/slower transition
      fingertipPaths[i][j].push(smoothPos);

      if (fingertipPaths[i][j].length > trailLength) {  
        fingertipPaths[i][j].shift(); 
      }

      // Draw the ASCII trail
      for (let k = 0; k < fingertipPaths[i][j].length; k++) {
        let current = fingertipPaths[i][j][k];
        
        // Randomly select a symbol from the list
        let symbol = random(asciiSymbols);
        
        // Make the symbol pink
        fill(255, 105, 180); // Pink color
        noStroke();
        
        // Draw the symbol at the current position
        textSize(24); // Size of the ASCII symbol
        text(symbol, current.x, current.y);
      }

      // Update last position for the next frame
      lastFingertipPositions[i][j] = fingertipPos.copy();
    }
  }
}


// Ease in-out function for smoother transitions
function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Only update the hands array if results are valid
  if (results && results.length > 0) {
    hands = results;
  }
}
