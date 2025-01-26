let img;
let ambianceSound;

// Coordonnées du bouton "Jouer"
let jouerX = 288;
let jouerY = 480;
let jouerWidth = 220;
let jouerHeight = 45;

function preload() {
    img = loadImage("temple.gif");  // Charger l'animation GIF
    ambianceSound = loadSound("hub.mp3");
}

function setup() {
    createCanvas(800, 600);

    img.resize(800, 600);

    cursor(ARROW); 

    // Jouer le son en boucle
    ambianceSound.setLoop(true);
    ambianceSound.play();
    ambianceSound.setVolume(0.1);
}

function draw() {    
    image(img, 0, 0);  // Afficher l'animation du temple

    // Vérification de la position de la souris pour changer le curseur
    if (isMouseInsideJouer()) {
        cursor(HAND);
    } else {
        cursor(ARROW);
    }
}

// Fonction déclenchée lors d'un clic de souris
function mousePressed() {
    if (isMouseInsideJouer()) {
        redirectToNextPage();
    }
}

// Vérifie si la souris est à l'intérieur du bouton "Jouer"
function isMouseInsideJouer() {
    return mouseX > jouerX && mouseX < jouerX + jouerWidth &&
           mouseY > jouerY && mouseY < jouerY + jouerHeight;
}

// Fonction de redirection
function redirectToNextPage() {
    window.location.href = "/hub/index.html";
}
