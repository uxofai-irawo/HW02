let mCamera;
let handPose;
let hands = [];
let painting;
let px = 0;
let py = 0;
let classifier;
let canvas;
let result;
let confidence;
let mlGuess = 'im not sure what this is?';

function preload() {
  handPose = ml5.handPose({ flipped: true });
  classifier = ml5.imageClassifier("DoodleNet");
}

function gotHands(results) {
  hands = results;
}

function setup() {
  mCamera = createCapture(VIDEO, { flipped: true });
  mCamera.hide();
  
  canvas = createCanvas(640, 480);

  // Create an off-screen graphics buffer for painting
  painting = createGraphics(640, 480);
  painting.clear();

  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  classifier.classifyStart(canvas, gotResult);


  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {

  background(255, 255, 255);
  //image(mCamera, 0, 0);


  // Ensure at least one hand is detected
  if (hands.length > 0) {
    let hand = hands[0];
    let index = hand.index_finger_tip;
    let thumb = hand.thumb_tip;

    // Compute midpoint between index finger and thumb
    let x = (index.x + thumb.x) * 0.5;
    let y = (index.y + thumb.y) * 0.5;

    // Draw only if fingers are close together
    let d = dist(index.x, index.y, thumb.x, thumb.y);
    if (d < 40) {
      painting.stroke(0, 0, 0);
      painting.strokeWeight(3);
      painting.line(px, py, x, y);
    } else {
      noStroke();
      fill(225);
      ellipse(index.x, index.y, 5, 5);
      ellipse(thumb.x, thumb.y, 5, 5);
      fill(0);
    }

    // Update previous position
    px = x;
    py = y;

    // instructions
    textSize(18);
    if(frameCount % 60 == 0){
      mlGuess = 'i think its ' + result + '?';
    }
    text(mlGuess, 20, 400);
    textSize(12);
    text('Put a hand in frame and touch your pointer finger to thumb in order to start drawing', 20, 420);
    text('remove your hand from the screen to clear', 20, 440);
    text('try to see if the ML can guess it right!', 20, 460);

  } else {
    painting.clear();

    // instructions
    textSize(18);
    text('reverse pictionary!', 20, 400);
    textSize(12);
    text('Put a hand in frame and touch your pointer finger to thumb in order to start drawing', 20, 420);
    text('remove your hand from the screen to clear', 20, 440);
    text('try to see if the ML can guess it right!', 20, 460);
  }

  image(painting, 0, 0);

}


function gotResult(results) {
  // The results are in an array ordered by confidence.
  result = results[0].label;
  confidence = results[0].confidence;
  console.log(result + ":" + confidence);
}