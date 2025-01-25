let img;
let greenslim;
let roseslim;
let slimsize = 64;
let fadeAmount = 0;  // Niveau d'opacité du fade (0 = transparent, 255 = opaque)
let fading = false;  // Variable pour activer le fade
let fadeCompleted = false; // Variable pour vérifier si le fade est terminé

// Coordonnées et dimensions du rectangle
let rectX = 298;
let rectY = 238;
let rectWidth = 201;
let rectHeight = 216;
let isHovering = false; // Variable pour suivre l'état de la souris

// Texte à afficher
let message = `La fin est proche.
Dieu doit le détruire.
La doctrine ne dit pas que,
Ce monde a besoin de vous.
Pourtant, vous devez agir, car,

Agir pour le bien, 
une quête luxuriante,
À peu d’importance.
Ces peuples morts et disparus,
Mener la mission de,
L’apport du nouveau. `;

function preload() {
    img = loadImage("temple.png");
    greenslim = loadImage("greenslim_idle.gif");
    roseslim = loadImage("roseslim_idle.gif");
    customFont = loadFont("FT88-Regular.ttf");
}

function setup() {
    createCanvas(800, 600);
    
    img.resize(800, 600);

    greenslim.resize(slimsize, slimsize);
    greenslim.pause();

    roseslim.resize(slimsize, slimsize);
    roseslim.pause();

    textFont(customFont);
    textSize(10);
    textAlign(CENTER, TOP);

    cursor(ARROW); 
}

function draw() {    
    if (!fadeCompleted) {
        image(img, 0, 0);

        // Vérification de la collision souris-rectangle uniquement si le fade n'est pas en cours
        if (!fading) {
            if (isMouseInsideRectangle()) {
                isHovering = true;
                cursor(HAND);  // Change le curseur en main uniquement si pas de fade
                fill(0);  // Texte en noir

                let padding = 10;
                text(message, rectX + padding, rectY + padding, rectWidth - 2 * padding, rectHeight - 2 * padding);
            } else {
                isHovering = false;
                cursor(ARROW);
            }
        }

        // Affichage des slimes
        image(greenslim, 330, 500);
        greenslim.play();

        push();                    
        scale(-1, 1);  
        image(roseslim, -467, 500);
        pop();  
        roseslim.play();
    }

    // Gestion du fade-out
    if (fading) {
        fadeToBlack();
    }
}

// Fonction pour démarrer le fade-out
function startFade() {
    fading = true;
    cursor(WAIT);  // Change immédiatement le curseur en mode attente (loading)
}

// Fonction de fondu au noir progressif
function fadeToBlack() {
    if (fadeAmount < 255) {
        fadeAmount += 5;  // Incrément progressif de l'opacité
    } else {
        fading = false;
        fadeCompleted = true;  // Une fois l'écran noir, terminer le fade
        //noCursor();  // Cacher le curseur une fois le fade terminé
    }
    fill(0, fadeAmount);
    rect(0, 0, width, height);
}

// Vérifie si la souris est à l'intérieur du rectangle
function isMouseInsideRectangle() {
    return mouseX > rectX && mouseX < rectX + rectWidth &&
           mouseY > rectY && mouseY < rectY + rectHeight;
}

// Désactiver les clics souris après le fade
function mousePressed() {
    if (fadeCompleted) return; // Empêche de cliquer si le fade est terminé

    if (isMouseInsideRectangle()) {
        onRectangleClick();
    }
}

// Fonction déclenchée lorsqu'on clique dans le rectangle
function onRectangleClick() {    
    startFade();  // Déclencher le fondu au noir
}
