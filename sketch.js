let mCamera;

function preload() {
  mCamera = createCapture(VIDEO, { flipped: true });
  mCamera.hide();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(180, 200, 255);
  image(mCamera, 0, 0);
}
