let squareX = 950; // Carré vert (point d’attache) 
let squareY = 1000;

let squareSize = 24;


let velocityX = 0;

let velocityY = 0;

const maxSpeed = 3;

const acceleration = 0.05;

const deceleration = 0.05;



let pushForceCurrent = 0;

const pushForceMax = 0.5;

const pushIncreaseRate = 0.01;



const worldSize = (1000, 2000);



let backgroundImage;

let redRectangles = [];
let blueOvals = []; // Tableau pour stocker les propriétés des ovales
let yellowSquares = []; // Tableau pour stocker les carrés jaunes


const rectWidth = 400;

const rectHeight = 200;

checkCollisionWithArtefacts();

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

let ambianceSound;

const returnForce = 0.05; // Force de retour progressive

let collected = false; // Indique si le carré jaune a été récupéré
let artefactGif;
let ventGif;

let transitionRadius = 0; // Rayon du cercle pour la transition
let transitioning = true; // Indique si la transition est en cours


function preload() {

  backgroundImage = loadImage("airworld3.png");
  slimeVert = loadImage("slime_vert.png");
  slimeRose = loadImage("slime_rose.png");
  artefactGif = loadImage("Artefact-air-anime.gif");
  ventGif = loadImage("vent.gif");
  ambianceSound = loadSound("air.mp3");
}
function setup() {  

  // Jouer le son en boucle
  ambianceSound.setLoop(true);
  ambianceSound.play();
  ambianceSound.setVolume(0.2); // Réglage du volume (0.0 à 1.0)

  createCanvas(800, 600);
  redRectangles = [    
    { x: 750,  y: 1150, angle: radians(45),  width: 400, height: 200 },
    { x: 1010, y: 403,  angle: radians(98),  width: 400, height: 200 }, 
    { x: 1650, y: 341,  angle: radians(78 ), width: 400, height: 200 },
    { x: 790,  y: 1517, angle: radians(90),  width: 400, height: 200 }, 
    { x: 1300, y: 1100, angle: radians(156), width: 400, height: 200 }, 
    { x: 1600, y: 50,   angle: radians(32),  width: 400, height: 200 },
    { x: 1400, y: 1650, angle: radians(35),  width: 400, height: 200 }, 
    { x: 375,  y: 1000, angle: radians(48),  width: 400, height: 200 }, 
    { x: 901,  y: 20,   angle: radians(58),  width: 400, height: 200 },
    { x: 1479, y: 800,  angle: radians(5),   width: 400, height: 200 }, 
    { x: 300,  y: 600,  angle: radians(35),  width: 400, height: 200 }, 
    { x: 500,  y: 150,  angle: radians(180), width: 400, height: 200 },
    { x: 100, y: 654,   angle: radians(168), width: 400, height: 200 },
    { x: 0, y: 1600,   angle: radians(168), width: 400, height: 200 },
  ];
  // Initialisation des 8 ovales avec position, dimensions et rotation
  blueOvals = [
    { x: 265, y: 375, width: 300, height: 400, angle: 0 },
    { x: 800, y: 475, width: 600, height: 500, angle: 0 },
    { x: 1500, y: 475, width: 300, height: 600, angle: 0 },
    { x: 1150, y: 1090, width: 325, height: 325, angle: 0 },
    { x: 250, y: 1350, width: 350, height: 400, angle: 0 },
    { x: 750, y: 1525, width: 400, height: 400, angle: 0 },
    { x: 1225, y: 1700, width: 250, height: 400, angle: 0 },
    { x: 1725, y: 1450, width: 400, height: 375, angle: 0 },
  ];
let spawnPoints = [
  { x: 50, y: 1525 }, // Point 1
  { x: 925, y: 200 }, // Point 2
  { x: 850, y: 1300 }, // Point 3
  { x: 1475, y: 1500 }, // Point 4
];
// Sélectionne un seul point de spawn aléatoire
let randomPoint = random(spawnPoints);
yellowSquares.push({ x: randomPoint.x, y: randomPoint.y });
}

function draw() {

  let camX = 12 + squareX - width / 2;
  let camY = 80 + squareY - height / 2;

  translate(-camX, -camY);

  image(backgroundImage, 0, 0, 2000, 2000);

  drawMapBorders();
  drawRedRectangles();
  drawBlueOvals();

  // Dessiner l'image du slime vert
  image(slimeVert, squareX, squareY, squareSize, squareSize);

  handleSquareMovement();
  checkCollisions();
  
  // Vérifier si le carré rose touche un carré jaune
  checkCollisionWithYellowSquares();

  squareX = constrain(squareX + velocityX, 0, worldSize - squareSize);
  squareY = constrain(squareY + velocityY, 0, worldSize - squareSize);

  updatePinkSquare(); // Mettre à jour la physique du carré rose
  drawRopeAndPinkSquare(); // Dessiner la corde et le carré rose

  for (let square of yellowSquares) {
    image(artefactGif, square.x, square.y, 30, 30); // Affiche le GIF
    
  }

  checkCollisionsWithOvals(); // Vérifie et applique le rebond avec les ovales bleus
  // Afficher "je l'ai" si un carré jaune a été récupéré
  if (collected) {
    redirectToNextPage();
    }
}

function drawRopeAndPinkSquare() {

  stroke(200);

  line(squareX + squareSize / 2, squareY + squareSize / 2, pinkX + squareSize / 2, pinkY + squareSize / 2);

  // Dessiner l'image du slime rose
  image(slimeRose, pinkX, pinkY+5, squareSize, squareSize);
  console.log(`Distance: ${dist(pinkX, pinkY, square.x, square.y)}`);
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
    // Obtenir les coins du rectangle rouge après rotation
    let corners = getRotatedRectangleCorners(
      rectObj.x + rectObj.width / 2,
      rectObj.y + rectObj.height / 2,
      rectObj.width,
      rectObj.height,
      rectObj.angle
    );

    // Vérifier la collision entre le carré vert et le rectangle rouge
    if (checkRectangleCollision(squareX, squareY, squareSize, squareSize, corners)) {
      isColliding = true;

      // Calculer la direction de la poussée selon l'angle du rectangle
      let angle = rectObj.angle;
      let pushX = cos(angle);
      let pushY = sin(angle);

      // Appliquer la poussée
      velocityX += pushX * pushForceMax * 0.5;
      velocityY += pushY * pushForceMax * 0.5;

      break;
    }
  }

  if (!isColliding) {
    // Réinitialiser la force de poussée si pas de collision
    pushForceCurrent = 0;
  }
}

function checkRotatedRectangleCollision(sx, sy, sw, sh, rx, ry, rw, rh, angle) {
  // Déplacer et pivoter le système pour aligner le rectangle avec l'axe
  let cosA = cos(-angle);
  let sinA = sin(-angle);

  // Calculer la position du carré dans le repère du rectangle
  let localX = cosA * (sx - (rx + rw / 2)) - sinA * (sy - (ry + rh / 2)) + rw / 2;
  let localY = sinA * (sx - (rx + rw / 2)) + cosA * (sy - (ry + rh / 2)) + rh / 2;

  // Vérifier les collisions dans le repère aligné
  return (
    localX < rw &&
    localX + sw > 0 &&
    localY < rh &&
    localY + sh > 0
  );
}



function updatePinkSquare() {
  // Gravité appliquée au poids
  pinkVelocityY += gravity;

  // Calcul de la vitesse relative entre le ballon et le poids
  let relativeVelocityX = velocityX - pinkVelocityX;
  let relativeVelocityY = velocityY - pinkVelocityY;

  // Mise à jour de la position du poids en fonction de sa vélocité
  pinkX += pinkVelocityX;
  pinkY += pinkVelocityY;

  // Calcul de la distance et de l'angle entre le ballon (carré vert) et le poids (carré rose)
  let dx = pinkX - squareX;
  let dy = pinkY - squareY;
  let distance = sqrt(dx * dx + dy * dy);

  // Appliquer une force inertielle qui tend à "tirer" le poids dans la direction opposée au mouvement du ballon
  pinkVelocityX += relativeVelocityX * 0.1; // La valeur 0.1 ajuste la réactivité (tu peux l'ajuster)
  pinkVelocityY += relativeVelocityY * 0.1;

  // Si la distance dépasse la longueur de la corde, réajuster la position du poids
  if (distance > ropeLength) {
    let angle = atan2(dy, dx);

    // Réajuster la position pour respecter la longueur de la corde
    pinkX = squareX + cos(angle) * ropeLength;
    pinkY = squareY + sin(angle) * ropeLength;

    // Simuler la tension de la corde
    pinkVelocityX -= cos(angle) * (distance - ropeLength) * 0.1; // Réaction à la tension
    pinkVelocityY -= sin(angle) * (distance - ropeLength) * 0.1;

    // Appliquer un amortissement pour éviter des oscillations infinies
    pinkVelocityX *= damping;
    pinkVelocityY *= damping;
  }
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
  // Couleur semi-transparente pour les bordures
  fill(255, 255, 255, 255); // Noir avec 150 de transparence (valeurs entre 0 et 255)
  noStroke(); // Pas de bordures visibles

  // Bords ajustés pour une apparence plus visible
  rect(-200, -200, worldSize + 400, 200); // Bord supérieur
  rect(-200, worldSize, worldSize + 400, 200); // Bord inférieur
  rect(-200, 0, 200, worldSize); // Bord gauche
  rect(worldSize, 0, 200, worldSize); // Bord droit
}



function drawRedRectangles() {
  for (let rectObj of redRectangles) {
    push(); // Sauvegarde l'état de transformation actuel

    // Place au centre du rectangle
    translate(rectObj.x + rectObj.width / 2, rectObj.y + rectObj.height / 2);
    rotate(rectObj.angle); // Applique la rotation

    // Affiche la zone de poussée en rouge semi-transparent
    fill(255, 255, 255, 20); // Rouge avec opacité à 40 %
    noStroke(); // Pas de bordures
    rectMode(CENTER); // Définit le mode de dessin (centré)
    rect(0, 0, rectObj.width, rectObj.height); // Dessine le rectangle

    // Optionnel : Ajoute un contour visible pour mieux identifier les bords
    stroke(255, 255, 255, 0); // Contour rouge vif
    strokeWeight(2); // Épaisseur du contour
    noFill(); // Pas de remplissage
    rect(0, 0, rectObj.width, rectObj.height); // Dessine le 
   
    // Applique une transformation pour inverser horizontalement
    scale(-1, 1); // Miroir horizontal
    imageMode(CENTER); // Définit le mode d'image (centré)
   
    // Affiche le GIF à la place du rectangle
    imageMode(CENTER); // Définit le mode d'image (centré)
    image(ventGif, 400, 140, 1800, 2700); // Affiche le GIF

    pop(); // Restaure l'état de transformation précédent
  }
}

function getRotatedRectangleCorners(centerX, centerY, width, height, angle) {
  let halfWidth = width / 2;
  let halfHeight = height / 2;

  // Coins du rectangle avant rotation
  let corners = [
    { x: -halfWidth, y: -halfHeight }, // Coin haut-gauche
    { x: halfWidth, y: -halfHeight },  // Coin haut-droit
    { x: halfWidth, y: halfHeight },   // Coin bas-droit
    { x: -halfWidth, y: halfHeight },  // Coin bas-gauche
  ];

  // Appliquer la rotation et la translation à chaque coin
  return corners.map(corner => {
    let rotatedX = corner.x * cos(angle) - corner.y * sin(angle);
    let rotatedY = corner.x * sin(angle) + corner.y * cos(angle);
    return {
      x: centerX + rotatedX,
      y: centerY + rotatedY,
    };
  });
}

function checkRectangleCollision(squareX, squareY, squareSize, squareSize, rectCorners) {
  // Obtenir les coins du carré vert
  let squareCorners = [
    { x: squareX, y: squareY },
    { x: squareX + squareSize, y: squareY },
    { x: squareX + squareSize, y: squareY + squareSize },
    { x: squareX, y: squareY + squareSize },
  ];

  // Vérifier la collision via la méthode SAT (Separating Axis Theorem)
  return SATCollision(squareCorners, rectCorners);
}

function SATCollision(shape1Corners, shape2Corners) {
  // Fonction pour obtenir les axes à tester
  function getAxes(corners) {
    let axes = [];
    for (let i = 0; i < corners.length; i++) {
      let p1 = corners[i];
      let p2 = corners[(i + 1) % corners.length]; // Coin suivant
      let edge = { x: p2.x - p1.x, y: p2.y - p1.y };
      axes.push({ x: -edge.y, y: edge.x }); // Normale à l'arête
    }
    return axes;
  }

  // Fonction pour projeter une forme sur un axe
  function projectShape(corners, axis) {
    let min = Infinity;
    let max = -Infinity;
    for (let corner of corners) {
      let projection = corner.x * axis.x + corner.y * axis.y;
      if (projection < min) min = projection;
      if (projection > max) max = projection;
    }
    return { min, max };
  }

  // Vérifier les projections sur tous les axes des deux formes
  let axes = [...getAxes(shape1Corners), ...getAxes(shape2Corners)];
  for (let axis of axes) {
    let shape1Projection = projectShape(shape1Corners, axis);
    let shape2Projection = projectShape(shape2Corners, axis);

    // Si les projections ne se chevauchent pas, il n'y a pas collision
    if (
      shape1Projection.max < shape2Projection.min ||
      shape2Projection.max < shape1Projection.min
    ) {
      return false;
    }
  }

  // Si toutes les projections se chevauchent, il y a collision
  return true;
}

function drawBlueOvals() {
  for (let oval of blueOvals) {
    push(); // Sauvegarde le contexte de dessin
    translate(oval.x, oval.y); // Place l'ovale à la position spécifiée
    rotate(oval.angle); // Applique la rotation
    noStroke(); // Pas de contour
    fill(91, 181, 9, 50); // Bleu avec 5% de transparence (255 * 0.05 = 13)
    ellipse(0, 0, oval.width, oval.height); // Dessine l'ellipse
    pop(); // Restaure le contexte de dessin
  }
}

function drawYellowSquares() {
  fill(255, 255, 0); // Couleur jaune
  noStroke();
  console.log(`Distance: ${dist(pinkX, pinkY, square.x, square.y)}`);
  for (let i = yellowSquares.length - 1; i >= 0; i--) {
    let square = yellowSquares[i];

    // Vérifier la collision entre le carré rose et le carré jaune
    if (
      pinkX < square.x + 24 &&
      pinkX + squareSize > square.x &&
      pinkY < square.y + 24 &&
      pinkY + squareSize > square.y
    ) {
      yellowSquares.splice(i, 1); // Supprimer le carré jaune
      collected = true; // Marquer comme récupéré
    } else {
      // Dessiner le carré jaune uniquement s'il n'est pas récupéré
      rect(square.x, square.y, 24, 24);
    }
  }
}

// Fonction pour vérifier et appliquer ralentissement/poussée dans un ovale
function checkAndPushFromOval(squareX, squareY, velocityX, velocityY, oval) {
  let dx = squareX - oval.cx; // Distance X au centre de l'ovale
  let dy = squareY - oval.cy; // Distance Y au centre de l'ovale

  // Calcul de la distance relative au centre de l'ovale
  let distanceRatio = (dx * dx) / (oval.a * oval.a) + (dy * dy) / (oval.b * oval.b);

  if (distanceRatio <= 1) {
    // Le carré est dans l'ovale

    // Ralentir les vitesses
    velocityX *= 0.1; // Réduction drastique de la vitesse
    velocityY *= 0.1;

    // Calcul de la direction de la poussée (vers l'extérieur de l'ovale)
    let angle = atan2(dy, dx); // Angle du carré par rapport au centre de l'ovale
    let pushStrength = 0.5; // Force de poussée (modifiable)

    // Ajouter une poussée à la vitesse
    velocityX += cos(angle) * pushStrength;
    velocityY += sin(angle) * pushStrength;
  }

  return { x: squareX, y: squareY, velocityX, velocityY };
}

function checkCollisionsWithOvals() {
  for (let oval of blueOvals) {
    // Calculer la distance entre le centre du carré vert et le centre de l'ovale
    let dx = squareX + squareSize / 2 - oval.x;
    let dy = squareY + squareSize / 2 - oval.y;

    // Rayon de l'ovale en X et Y (moitié de la largeur et de la hauteur)
    let rx = oval.width / 2;
    let ry = oval.height / 2;

    // Vérification de collision via l'équation d'un ovale
    let distanceRatio = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);

    if (distanceRatio <= 1) {
      // Collision détectée
      let angle = atan2(dy, dx); // Angle du carré par rapport au centre de l'ovale

      // Appliquer une légère poussée (rebond)
      velocityX = cos(angle) * 1; // Force de rebond dans la direction opposée
      velocityY = sin(angle) * 1;
    }
  }
}

function redirectToNextPage() {
  setTimeout(() => {
      window.location.href = "/end/index.html";
  }, 500);
}

function checkCollisionWithArtefacts() {
  for (let i = 0; i < yellowSquares.length; i++) {
    let square = yellowSquares[i];

    // Vérifier la distance entre le carré rose et l'artefact
    let distance = dist(pinkX, pinkY, square.x, square.y);

    // Si la distance est inférieure à un seuil (par exemple, 20 pixels), considérer qu'il y a collision
    if (distance < squareSize / 2) {
      collected = true; // Marquer l'artefact comme récupéré
      yellowSquares.splice(i, 1); // Retirer l'artefact du tableau
      break;
    }
  }
}

function checkCollisionWithYellowSquares() {
  for (let i = yellowSquares.length - 1; i >= 0; i--) {
    let yellow = yellowSquares[i];
    let dx = pinkX - yellow.x;
    let dy = pinkY - yellow.y;
    let distance = sqrt(dx * dx + dy * dy);

    if (distance < squareSize) { // Vérifie si le centre du carré rose est proche du carré jaune
      collected = true; // Met la variable à true
      yellowSquares.splice(i, 1); // Retire le carré jaune du tableau
      break;
    }
  }
}