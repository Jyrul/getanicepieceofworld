let img;
let greenslim;
let greenslimX = 330;
let greenslimY = 500;
let roseslimX = -467;
let roseslimY = 500;
let roseslim;
let slimsize = 64;
let artefactAirX = 168;
let artefactAirY = 377;
let artefactTerreX = 565;
let artefactTerreY = 377;
let fadeAmount = 255;  // Départ entièrement noir pour le fade "reverse"
let fading = true;  // Démarrer directement avec le fade
let fadeCompleted = false; // Variable pour vérifier si le fade est terminé
let fadeType = "start";  // start, end, artefact
let circleSize = 0; // Taille initiale du cercle pour le fade en cercle

let ambianceSound;

// Coordonnées et dimensions du rectangle
let rectX = 298;
let rectY = 238;
let rectWidth = 201;
let rectHeight = 216;
let isHovering = false; // Variable pour suivre l'état de la souris

// Texte à afficher
let message = `L’apport du nouveau.
Mener la mission de,
Ces peuples morts et disparus,
À peu d’importance.
Agir pour le bien, 
une quête luxuriante,

Pourtant, vous devez agir, car,
Ce monde a besoin de vous.
La doctrine ne dit pas que,
Dieu doit le détruire.
La fin est proche.
`;

function preload() {
    img = loadImage("temple.png");
    greenslim = loadImage("greenslim_idle.gif");
    roseslim = loadImage("roseslim_idle.gif");
    artefactAir = loadImage("Artefact-air.png");
    artefactTerre = loadImage("Artefact-terre.png");
    customFont = loadFont("FT88-Regular.ttf");
    ambianceSound = loadSound("hub.mp3");
}

function setup() {
    createCanvas(800, 600);
    
    img.resize(800, 600);

    greenslim.resize(slimsize, slimsize);
    greenslim.pause();

    roseslim.resize(slimsize, slimsize);
    roseslim.pause();

    artefactAir.resize(slimsize, slimsize);
    artefactTerre.resize(slimsize, slimsize);

    textFont(customFont);
    textSize(10);
    textAlign(CENTER, TOP);

    cursor(ARROW); 

    // Jouer le son en boucle
    ambianceSound.setLoop(true);
    ambianceSound.play();
    ambianceSound.setVolume(0.5); // Réglage du volume (0.0 à 1.0)

    circleSize = max(width, height) * 1.5;    
}

function draw() {    
    if (!fadeCompleted) {
        image(img, 0, 0);

        image(greenslim, greenslimX, greenslimY);
        greenslim.play();

        push();                    
        scale(-1, 1);  
        image(roseslim, roseslimX, roseslimY);
        pop();  
        roseslim.play();

        image(artefactAir, artefactAirX, artefactAirY);
        image(artefactTerre, artefactTerreX, artefactTerreY);
    }

    // Gestion du fade-out selon le type sélectionné
    if (fading) {
        if (fadeType === "end") {
            fadeToBlack();
        } else if (fadeType === "artefact") {
            fadeWithCircle(greenslimX+32, greenslimY+32);
        } else if (fadeType === "start") {
            fadeReverse();
        }
    }

    fill(0);  // Texte en blanc, ajuste selon l'arrière-plan
    noStroke();
    // Vérification de la collision souris-rectangle uniquement si le fade n'est pas en cours
    let padding = 10;
    text(message, rectX + padding, rectY + padding, rectWidth - 2 * padding, rectHeight - 2 * padding);

}

// Fonction de fondu au noir progressif (classique)
function fadeToBlack() {
    if (fadeAmount < 255) {
        fadeAmount += 5;  
    } else {
        fadeCompleted = true;
        redirectToNextPage();
    }
    fill(0, fadeAmount);
    rect(0, 0, width, height);
}

// Fonction de fondu inverse (révèle progressivement l'écran)
function fadeReverse() {
    if (fadeAmount > 0) {
        fadeAmount -= 2;
    } else {
        fading = false; // Arrêter le fade une fois terminé
    }
    fill(0, fadeAmount);
    rect(0, 0, width, height);
}


function fadeWithCircle(posX, posY) {
    if (circleSize > 0) {
        circleSize -= 20;  // Réduction progressive de la taille du cercle
    } else {
        fadeCompleted = true;
        //redirectToNextPage();  // Redirection si nécessaire
    }

    // Création d'un masque
    let mask = createGraphics(width, height);
    mask.fill(0);  // Fond noir du masque
    mask.rect(0, 0, width, height);

    // Dessiner le cercle transparent dans le masque
    mask.erase();  // Active le mode effacement (transparent)
    mask.ellipse(posX, posY, circleSize, circleSize);
    mask.noErase();  // Désactive le mode effacement

    // Appliquer le masque à un rectangle noir couvrant l'écran
    image(mask, 0, 0);
}


// Vérifie si la souris est à l'intérieur du rectangle
function isMouseInsideRectangle() {
    return mouseX > rectX && mouseX < rectX + rectWidth &&
           mouseY > rectY && mouseY < rectY + rectHeight;
}

// Fonction de redirection après le fade
function redirectToNextPage() {
    setTimeout(() => {
        window.location.href = "/end/index.html";
    }, 500);
}

// Fonction pour démarrer un fade selon le type choisi
function startFade(type) {
    fading = true;
    fadeType = type;
    fadeAmount = type === "start" ? 255 : 0;  // Commencer le fade inverse à 255
    cursor(WAIT);  
}
