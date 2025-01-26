let img;
let greenslim, roseslim;
let greenslimX = 330, greenslimY = 500;
let roseslimX = -467, roseslimY = 500;
let slimsize = 64;
let artefactAir, artefactTerre;
let artefactAirX = 168, artefactAirY = 365;
let artefactTerreX = 565, artefactTerreY = 365;
let fadeAmount = 255;  // Départ entièrement noir pour le fade "reverse"
let fading = true;  // Démarrer directement avec le fade
let fadeCompleted = false; // Variable pour vérifier si le fade est terminé
let fadeType = "start";  // start, end, artefact
let circleSize = 0; // Taille initiale du cercle pour le fade en cercle
let backbutton;

let ambianceSound;

// Position du bouton retour
let backbuttonX = 730;
let backbuttonY = 530;
let backbuttonSize = 64;

// Coordonnées et dimensions du rectangle
let rectX = 298, rectY = 238;
let rectWidth = 201, rectHeight = 216;

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
    artefactAir = loadImage("Artefact-air.gif");
    artefactTerre = loadImage("Artefact-terre.gif");
    customFont = loadFont("FT88-Regular.ttf");
    ambianceSound = loadSound("end.mp3");
    backbutton = loadImage("backbutton.gif");
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
    backbutton.resize(backbuttonSize, backbuttonSize);

    textFont(customFont);
    textSize(10);
    textAlign(CENTER, TOP);

    cursor(ARROW); 

    // Jouer le son en boucle
    ambianceSound.setLoop(true);
    ambianceSound.play();
    ambianceSound.setVolume(0.3);

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
        artefactAir.play();

        image(artefactTerre, artefactTerreX, artefactTerreY);
        artefactTerre.play();

        image(backbutton, backbuttonX, backbuttonY);
    }

    // Gestion du fade-out selon le type sélectionné
    if (fading) {
        if (fadeType === "end") {
            fadeToBlack();
        } else if (fadeType === "artefact") {
            fadeWithCircle(backbuttonX + backbuttonSize / 2, backbuttonY + backbuttonSize / 2);
        } else if (fadeType === "start") {
            fadeReverse();
        }
    }

    fill(0);  // Texte en blanc, ajuste selon l'arrière-plan
    noStroke();
    // Vérification de la collision souris-rectangle uniquement si le fade n'est pas en cours
    let padding = 10;
    text(message, rectX + padding, rectY + padding, rectWidth - 2 * padding, rectHeight - 2 * padding);

    // Vérifier si la souris est sur le bouton retour
    if (isMouseInsideBackbutton()) {
        cursor(HAND);
    } else {
        cursor(ARROW);
    }
}


// Vérifie si la souris est à l'intérieur du bouton retour
function isMouseInsideBackbutton() {
    return mouseX > backbuttonX && mouseX < backbuttonX + backbuttonSize &&
           mouseY > backbuttonY && mouseY < backbuttonY + backbuttonSize;
}

// Fonction déclenchée lors d'un clic de souris
function mousePressed() {
    if (isMouseInsideBackbutton()) {
        startFade("artefact");
    }
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
        fading = false;
    }
    fill(0, fadeAmount);
    rect(0, 0, width, height);
}

function fadeWithCircle(posX, posY) {
    if (circleSize > 0) {
        circleSize -= 20;
    } else {
        fadeCompleted = true;
        redirectToNextPage();
    }

    let mask = createGraphics(width, height);
    mask.fill(0);
    mask.rect(0, 0, width, height);

    mask.erase();  
    mask.ellipse(posX, posY, circleSize, circleSize);
    mask.noErase();

    image(mask, 0, 0);
}

// Fonction de redirection après le fade
function redirectToNextPage() {
    window.location.href = "/start/index.html";
}

// Fonction pour démarrer un fade selon le type choisi
function startFade(type) {
    fading = true;
    fadeType = type;
    fadeAmount = type === "start" ? 255 : 0;  
    cursor(WAIT);  
}
