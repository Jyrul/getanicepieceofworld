let player = {
    x: 300,
    y: 0,
    size: 20,
    
    gravityEffects: true,
    gravityForce: 3,
    
    acceleration: 2,
    addImpulseAcceleration: 1,
    grounded: false,

    jumped: false,
    jumpAnimation: false,
    jumpHeight: 10,
    iterationJump: 10,
};

let actor = {
    x: 250,
    y: 0,
    size: 20,
    
    accelerationNormal: 2,
    accelerationHigh: 4,
    gravityEffects: true,
    gravityForce: -1,

    distanceOfPlayer: 120,
};

let apple = [
    [200, 200, true, 10],
    [300, 200, true, 10],
    [500, 200, true, 10],
    [450, 150, true, 10],
]; //x, y, appear, size

let score = 0;
let chrono = 0;
let keepDataLastFrame = 0;

function setup() {
    createCanvas(800, 600);
}

function draw() {
    //Map
        //background
    noStroke();
    fill(200);
    rect(0, 0, width, height);
    
        //ground
    fill(100);
    rect(0, height / 2, width, height);

    ////// //////

    //Player
    fill(0);
    square(player.x, player.y, player.size);
    noFill();
    stroke(3);
    circle(player.x + player.size / 2, player.y  + player.size / 2, actor.distanceOfPlayer);

    //Actor
    fill(0);
    square(actor.x, actor.y, actor.size);

    //Link
    noFill();
    stroke(3);
    line(player.x + player.size / 2, player.y + player.size / 2, actor.x + actor.size / 2, actor.y+ actor.size / 2);
    

    ////// //////


    //Apples
    apple.forEach((item, index, apple) => {
        apples(apple[index][0], apple[index][1], apple[index][2], apple[index][3], index)
    });


    //Score
    text(score, 10, 20);


    ////// //////


    //Control
    if (keyIsDown(LEFT_ARROW) === true){
        player.x -= player.acceleration;
    }
    if (keyIsDown(RIGHT_ARROW) === true){
        player.x += player.acceleration;
    }


    ////// //////


    //Gravity Player
    if(player.grounded == false && player.gravityEffects == true){
        player.y += player.gravityForce;
    }

    //Gravity Actor
    actor.y += actor.gravityForce;


    ////// //////


    //Contraints Actor
    let distance = dist(player.x + player.size, player.y + player.size, actor.x + actor.size, actor.y + actor.size);
    
    if(distance >= actor.distanceOfPlayer){
        accelerationActor(actor.accelerationHigh);
    }else if(distance >= actor.distanceOfPlayer / 2){
        accelerationActor(actor.accelerationNormal);
    }


    ////// //////


    //Ground colision Player
    if(player.y + player.size > height / 2){
        player.grounded = true;
    }

    //Ground colision Actor
    if(actor.y + actor.size > height / 2){
        actor.grounded = true;
    }

    //Colision Between Player and Actor
    if(player.x < actor.x + actor.size &&
        player.x + player.size > actor.x &&
        player.y < actor.y + actor.size &&
        player.y - player.size > actor.y + actor.size
    ){
        player.gravityForce = actor.gravityForce;
        player.jumped = false;
    }

    console.log(
        player.x < actor.x + actor.size,
        player.x + player.size > actor.x,
        player.y < actor.y + actor.size,
    );

    //Saut
    jump();
}

function apples(x, y, appear, size, index) {
    //Affichage
    if(appear == true){
        fill(255, 0, 0);
        noStroke();
        rect(x, y, size, size);

        //Intéraction
        if (x + size / 2 > actor.x &&
            y + size / 2 > actor.y &&
            x + size / 2 < actor.x + actor.size &&
            y + size / 2 < actor.y + actor.size
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

        //Conserver la dernière position
         keepDataLastFrame = player.x;

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

function accelerationActor(a) {
    //Condition in X
        //right
    if(actor.x + actor.size <= player.x + player.size){
        actor.x += a;
    }
        //left
    if(actor.x + actor.size > player.x + player.size){
        actor.x -= a;
    }

    //Condition in Y
        //up
    if(actor.y + actor.size <= player.y + player.size){
        actor.y += a;
    }
        //down
    if(actor.y + actor.size > player.y + player.size){
        actor.y -= a;
    }
}