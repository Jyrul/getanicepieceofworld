let player = {
    x: 400,
    y: 400,
    size: 40,
    
    gravityEffects: true,
    gravityForce: 3,
    
    acceleration: 2,
    addImpulseAcceleration: 0.2,
    running: false,
    grounded: false,

    jumped: false,
    jumpAnimation: false,
    jumpHeight: 10,
    iterationJump: 15,
};

let actor = {
    x: 50,
    y: 0,
    size: 40,
    
    velocityX: 0,
    velocityY: 0,
    damping: 0.99,

    gravityForce: -2,

    /*
    accelerationNormal: 2,
    accelerationHigh: 4,
    */

    distanceOfPlayer: 140,
};

let apple = [
    [500, 440, true, 64, "teteoiseau"],
    [1200, 200, true, 64, "corpsoiseau"],
    [600, 300, true, 64, "tetechien"],
    [400, 200, true, 64, "corpschien"],
]; //x, y, appear, size, name

//Scene
let leftBorder = false;
let rightBorder = false;
let cinemactic = false;

//Background
let background;
let posBackground;

//Animation
let greenSlimIdle;
let greenSlimRun;
let roseSlimIdle;

let assembleTotem;
let artefact;

//Totem
let teteOiseau;
let corpsOiseau;
let teteChien;
let corpsChien;

//Integer
let score = 4;
let chrono = 0;

function preload() {
    background = loadImage("background.png");

    greenSlimIdle = loadImage("vert_enclum_idle.gif");
    greenSlimRun = loadImage("vert_enclum_mouv.gif");
    roseSlimIdle = loadImage("rose_bulle_idle.gif");

    assembleTotem = loadImage("assemble_totem.gif");
    artefact = loadImage("artefact_terre.gif");

    teteOiseau = loadImage("tete_doiseau.png");
    corpsOiseau = loadImage("corps_doiseau.png");
    teteChien = loadImage("tete_chien.png");
    corpsChien = loadImage("corps_chien.png");
}

function setup() {
    createCanvas(800, 600);

    posBackground = {
        x: -1000,
        y: 0,
    };

    //Background
    background.resize(1800, 600);

    //Slime
    greenSlimIdle.resize(player.size, player.size);
    greenSlimIdle.pause();

    greenSlimRun.resize(player.size, player.size);
    greenSlimRun.pause();

    roseSlimIdle.resize(player.size, player.size);
    roseSlimIdle.pause();

    //Totem
    teteOiseau.resize(20, 20);
    corpsOiseau.resize(20, 20);
    teteChien.resize(20, 20);
    corpsChien.resize(20, 20);
}

function draw() {
    //Background
    fill(200);
    rect(0, 0, width - 50, height);
    image(background, posBackground.x, posBackground.y);


    ////// //////


    //Link
    noFill();
    stroke(3);
    line(player.x + player.size / 2, player.y + player.size / 2, actor.x + actor.size / 2, actor.y+ actor.size / 2);
    

    ////// //////


    //Apples
    apple.forEach((item, index, apple) => {
        apples(apple[index][0], apple[index][1], apple[index][2], apple[index][3], index, apple[index][4])
    });

    //Score
    text(score, 10, 20);


    ////// //////


    //Check for Cinematic
    if (player.x <= 300 && score >= 4) {
        cinemactic = true;
    }

    //Control Player
    if (cinemactic == false) {
        if (keyIsDown(LEFT_ARROW) === true){
            //Action de déplacement
            if(posBackground.x <= 0 && rightBorder == false){
                posBackground.x += player.acceleration;
            }else{
                player.x -= player.acceleration;
                leftBorder = true;
            }
            
            //Vérifier le statue libre
            if(player.x >= width/2){
                leftBorder = false;
            }else{
                leftBorder = true;
            }

            if (player.x <= width / 2 && rightBorder) {
                rightBorder = false;
            }

            push();                    // Sauvegarde le contexte de transformation
            scale(-1, 1);               // Applique une mise à l'échelle négative en X (flip horizontal)
            image(greenSlimRun, -player.x - player.size, player.y); // Compense le flip en ajustant la position en X
            pop();

            greenSlimIdle.pause();
            greenSlimRun.play();

            player.running = true;
        }

        else if (keyIsDown(RIGHT_ARROW) === true){
            //Action de déplacement
            if(posBackground.x >= -1000 && leftBorder == false){
                posBackground.x -= player.acceleration;
            }else{
                player.x += player.acceleration;
                rightBorder = true;
            }

            if (player.x >= width / 2 && leftBorder) {
                leftBorder = false;
            }

            image(greenSlimRun, player.x, player.y);
            
            greenSlimIdle.pause();
            greenSlimRun.play();
            
            player.running = true;
        }

        else{
            image(greenSlimIdle, player.x, player.y);
            greenSlimRun.pause();
            greenSlimIdle.play();
            
            player.running = false;
        }
    }else{
        endCinematic();
    }
    
    //Actor
    actor.x = player.x;
    actor.y = player.y - 100;

    image(roseSlimIdle, actor.x, actor.y);
    roseSlimIdle.play();


    ////// //////


    //Gravity Player
    if(player.grounded == false && player.gravityEffects == true){
        player.y += player.gravityForce;
    }


    ////// //////


    //Ground colision Player
    if(player.y + player.size > 480){
        player.grounded = true;
    }

    //Jump
    if (cinemactic == false) {
        jump();
    }
}

function apples(x, y, appear, size, index, name) {
    //Affichage
    if(appear == true){
        if(apple[index][4] == "tetechien"){
            image(teteChien, posBackground.x + x, y, size, size);
        }else if(apple[index][4] == "corpschien"){
            image(corpsChien, posBackground.x + x, y, size, size);
        }else if(apple[index][4] == "teteoiseau"){
            image(teteOiseau, posBackground.x + x, y, size, size);
        }else if(apple[index][4] == "corpsoiseau"){
            image(corpsOiseau, posBackground.x + x, y, size, size);
        }
        
        //Intéraction
        if (x + size + posBackground.x > actor.x + 20 &&
            y + size - 20 > actor.y &&
            x + posBackground.x - 20 < actor.x + actor.size &&
            y < actor.y + 20 + actor.size
        ) {
            apple[index][2] = false;
            score += 1;
        }
    }
}

function jump() {
    if(keyIsDown(UP_ARROW) === true && player.jumped == false){
        player.jumped = true;
        player.jumpAnimation = true;
        player.grounded = false;

        player.gravityForce = 3;
    }

    if(player.jumpAnimation == true && player.jumped == true){
        //Augmenter la position du joueur de peut chaque frame
        player.y -= player.jumpHeight;
        
        //Avancer le chrono de 1
        chrono += 1;

        //Créer un effet d'acceleration
        player.acceleration += player.addImpulseAcceleration;

        //Revenir à un état de chute libre à la fin de l'animation
        if (chrono >= player.iterationJump){
            player.jumpAnimation = false;
            player.gravityEffects = true;
            chrono = 0;
            player.acceleration = 2;
        }
    }

    //Can jump while grounded
    if(player.grounded == true){
        player.jumped = false;
    }
}

function endCinematic() {
    push();                    // Sauvegarde le contexte de transformation
    scale(-1, 1);               // Applique une mise à l'échelle négative en X (flip horizontal)
    image(greenSlimIdle, - player.x - player.size, player.y); // Compense le flip en ajustant la position en X
    pop();

    greenSlimIdle.play();
    greenSlimRun.pause();

    chrono += 1;

    if (chrono >= 100 && chrono <= 300) {
        image(assembleTotem, 115, 250, 250, 250);
    }

    if (chrono == 230) {
        assembleTotem.pause();
    }

    if(chrono > 300){
        image(artefact, 120, 410, 50, 50);
    }

    if (chrono >= 350) {
        player.x -= 0.7;
    }

    if (chrono >= 550) {
        redirectToNextPage();
    }
}

function redirectToNextPage() {
    window.location.href = "/airworld/index.html";
}