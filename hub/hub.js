let img;
let greenslim;
let roseslim;
let slimsize = 64;

// Load the image.
function preload() {
    img = loadImage("temple.png");
    greenslim = loadImage("greenslim_idle.gif");
    roseslim = loadImage("roseslim_idle.gif");
  }

function setup() {
    createCanvas(800, 600);
    
    img.resize(800, 600);

    greenslim.resize(slimsize, slimsize);
    greenslim.pause();

    roseslim.resize(slimsize, slimsize);
    roseslim.pause();
}


function draw() {    
    image(img, 0, 0);

    image(greenslim, 330, 500);
    greenslim.play();

    //image(roseslim, 403, 500);
    // Flipping horizontal pour roseslim
    push();                    // Sauvegarde le contexte de transformation
    scale(-1, 1);               // Applique une mise à l'échelle négative en X (flip horizontal)
    image(roseslim, -467, 500); // Compense le flip en ajustant la position en X
    pop();  
    roseslim.play();
}
