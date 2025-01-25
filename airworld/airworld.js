let squareX = 2500; // Carré vert (point d’attache)
let squareY = 2500;
let squareSize = 24;

let velocityX = 0;
let velocityY = 0;
const maxSpeed = 3;
const acceleration = 0.05;
const deceleration = 0.05;

let pushForceCurrent = 0;
const pushForceMax = 0.5;
const pushIncreaseRate = 0.01;

const worldSize = 5000;

let backgroundImage;
let redRectangles = [];
const rectWidth = 150;
const rectHeight = 50;

let currentHorizontalKey = null;
let currentVerticalKey = null;

// 🔴 Carré rose (attaché à une corde)
let ropeLength = 100; // Longueur fixe de la corde
let pinkX = squareX; // Position du carré rose
let pinkY = squareY + ropeLength; 
let pinkVelocityX = 0;
let pinkVelocityY = 0;
const gravity = 0.1; // Gravité appliquée au carré rose
const damping = 0.99; // Atténuation du mouvement (frottements)
const swingStrength = 0.02; // Force de balancement 

const returnForce = 0.05; // Force de retour progressive

function preload() {
  backgroundImage = loadImage("airworld.png");
}

function setup() {
  createCanvas(800, 600);
}

function draw() {
  let camX = 12 + squareX - width / 2;
  let camY = 80 + squareY - height / 2;
  translate(-camX, -camY);

  image(backgroundImage, 0, 0, worldSize, worldSize);

  drawMapBorders();
  drawRedRectangles();

  fill(0, 255, 0);
  rect(squareX, squareY, squareSize, squareSize);

  handleSquareMovement();
  checkCollisions();

  squareX = constrain(squareX + velocityX, 0, worldSize - squareSize);
  squareY = constrain(squareY + velocityY, 0, worldSize - squareSize);

  updatePinkSquare(); // Mettre à jour la physique du carré rose
  drawRopeAndPinkSquare(); // Dessiner la corde et le carré rose
}

function handleSquareMovement() {
  if (currentHorizontalKey === LEFT_ARROW) {
    velocityX = max(velocityX - acceleration, -maxSpeed);
  } else if (currentHorizontalKey === RIGHT_ARROW) {
    velocityX = min(velocityX + acceleration, maxSpeed);
  } else {
    if (velocityX > 0) velocityX = max(velocityX - deceleration, 0);
    if (velocityX < 0) velocityX = min(velocityX + deceleration, 0);
  }

  if (currentVerticalKey === UP_ARROW) {
    velocityY = max(velocityY - acceleration, -maxSpeed);
  } else if (currentVerticalKey === DOWN_ARROW) {
    velocityY = min(velocityY + acceleration, maxSpeed);
  } else {
    if (velocityY > 0) velocityY = max(velocityY - deceleration, 0);
    if (velocityY < 0) velocityY = min(velocityY + deceleration, 0);
  }
}

function checkCollisions() {
  let isColliding = false;

  for (let rectObj of redRectangles) {
    if (
      squareX < rectObj.x + rectWidth &&
      squareX + squareSize > rectObj.x &&
      squareY < rectObj.y + rectHeight &&
      squareY + squareSize > rectObj.y
    ) {
      isColliding = true;
      break;
    }
  }

  if (isColliding) {
    pushForceCurrent = min(pushForceCurrent + pushIncreaseRate, pushForceMax);
    velocityX += pushForceCurrent;
  } else {
    pushForceCurrent = 0;
  }
}

function updatePinkSquare() {
  // Appliquer la gravité
  pinkVelocityY += gravity;

  // Mettre à jour les positions du carré rose
  pinkX += pinkVelocityX;
  pinkY += pinkVelocityY;

  // Calculer la distance entre le carré vert et le carré rose
  let dx = pinkX - squareX;
  let dy = pinkY - squareY;
  let distance = sqrt(dx * dx + dy * dy);

  // Si la distance dépasse la longueur de la corde
  if (distance > ropeLength) {
    let angle = atan2(dy, dx);

    // Réajuster la position pour rester dans la longueur de la corde
    pinkX = squareX + cos(angle) * ropeLength;
    pinkY = squareY + sin(angle) * ropeLength;

    // Appliquer la tension de la corde
    pinkVelocityX *= damping;
    pinkVelocityY *= damping;

    // Simuler le balancement basé sur le mouvement du carré vert
    pinkVelocityX += velocityX * swingStrength * cos(angle + HALF_PI);
    pinkVelocityY += velocityY * swingStrength * sin(angle + HALF_PI);
  }

  // Retour progressif au point d'attache si le carré vert est immobile
  if (velocityX === 0 && velocityY === 0) {
    let targetX = squareX;
    let targetY = squareY + ropeLength;

    pinkX = lerp(pinkX, targetX, returnForce);
    pinkY = lerp(pinkY, targetY, returnForce);

    pinkVelocityX *= 0.9;
    pinkVelocityY *= 0.9;
  }
}


function drawRopeAndPinkSquare() {
  stroke(200);
  line(squareX + squareSize / 2, squareY + squareSize / 2, pinkX + squareSize / 2, pinkY + squareSize / 2);

  fill(255, 105, 180);
  noStroke();
  rect(pinkX, pinkY, squareSize, squareSize);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    if (currentHorizontalKey === null) {
      currentHorizontalKey = keyCode;
    }
  }

  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    if (currentVerticalKey === null) {
      currentVerticalKey = keyCode;
    }
  }
}

function keyReleased() {
  if (keyCode === currentHorizontalKey) {
    currentHorizontalKey = null;
  }

  if (keyCode === currentVerticalKey) {
    currentVerticalKey = null;
  }
}

function drawMapBorders() {
  fill(0);
  noStroke();
  rect(-50, -50, worldSize + 100, 50);
  rect(-50, worldSize, worldSize + 100, 50);
  rect(-50, 0, 50, worldSize);
  rect(worldSize, 0, 50, worldSize);
}

function drawRedRectangles() {
  fill(255, 0, 0);
  noStroke();
  for (let rectObj of redRectangles) {
    rectMode(CORNER);
    rect(rectObj.x, rectObj.y, rectWidth, rectHeight);
  }
}
