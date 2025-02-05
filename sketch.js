let mCamera;
let handPose;
let hands = [];
let painting;
let px = 0;
let py = 0;
let correct = false;
let classifier;
let canvas;
let drawThis = "sheep";
let result;
let confidence;

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

  classifier.classifyStart(canvas, gotResult);

  // Create an off-screen graphics buffer for painting
  painting = createGraphics(640, 480);
  painting.clear();

  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);

  // pick thing to draw
  let words = ["cat", "broccoli", "sweater", "lightning", "sheep"];
  drawThis = random(words);
}

function draw() {
  if (correct) {
    background(0, 128, 0, 255);
    image(painting, 0, 0);
    textSize(24);
    fill(255);
    text('yay you drew ' + drawThis +'!', 20, 400); // prompt
    text('refresh page to play again', 20, 400); // prompt

  } else {
    image(mCamera, 0, 0);
    background(255, 255, 255, 180);

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
      if (d < 20) {
        painting.stroke(0, 0, 0);
        painting.strokeWeight(5);
        painting.line(px, py, x, y);
      }

      // Update previous position
      px = x;
      py = y;

      // instructions
      textSize(18);
      text('your word is: ' + drawThis, 20, 400); // prompt
      textSize(12);
      text('Put a hand in frame and touch your pointer finger to thumb in order to start drawing', 20, 420);
      text('remove your hand from the screen to clear', 20, 440);
      text('try to accuratley draw what the ML model is looking for', 20, 460);

    } else {
      painting.clear();

      // instructions
      textSize(18);
      text('reverse pictionary!', 20, 400);
      textSize(12);
      text('Put a hand in frame and touch your pointer finger to thumb in order to start drawing', 20, 420);
      text('remove your hand from the screen to clear', 20, 440);
      text('try to accuratley draw what the ML model is looking for', 20, 460);
    }

    image(painting, 0, 0);
  }

  if (result == drawThis && confidence > 0.5) {

  }

}


function gotResult(results) {
  // The results are in an array ordered by confidence.
  
  result = results[0].label;
  confidence = results[0].confidence;
  console.log(result + ":" + confidence);
}