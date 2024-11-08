let game = document.getElementById('game');
let cvs = game.getContext('2d');

let bird = new Image();
let fg = new Image();
let bg = new Image();
let pipeUp = new Image();
let pipeBottom = new Image();


bird.src = '/img/flappy_bird_bird.png';
fg.src = '/img/flappy_bird_fgpng.png';
bg.src = '/img/flappy_bird_bg.png';
pipeUp.src = '/img/flappy_bird_pipeUp.png';
pipeBottom.src = '/img/flappy_bird_pipeBottom.png';

let hole = 90;
let xPos = 10;
let yPos = 270;
let grav = 1;
let score = 0;

document.addEventListener('keydown', moveUp);
function moveUp(){
  yPos -= 30;
}

let pipe = [];
pipe[0] = {
  x: game.width,
  y: 0
}

function draw() {
 cvs.drawImage(bg, 0, 0)

 for(let i = 0; i < pipe.length; i++) {
     cvs.drawImage(pipeUp, pipe[i].x, pipe[i].y);
     cvs.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + hole);

     pipe[i].x--;

     if(pipe[i].x == 125) {
       pipe.push({
         x: game.width,
         y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
       });
     }
     if (xPos + bird.width >= pipe[i].x && xPos <= pipe[i].x + pipeUp.width && (yPos <= pipe[i].y + pipeUp.height || yPos + bird.height >= pipe[i].y + pipeUp.height + hole) || yPos + bird.height >=  game.height - fg.height){
       location.reload();
       alert('GAVE OVER')
     }
     if(pipe[i].x == 5){
       score++;
     }


 }

 cvs.drawImage(fg, 0, game.height - fg.height);
 cvs.drawImage(bird, xPos, yPos);
 yPos += grav;

    cvs.fillStyle = '#000';
    cvs.font = '20px syns-sherif'
    cvs.filltext = ('Cчет: ' + score, 10, game.height - 20);

 requestAnimationFrame(draw);
}


pipeBottom.onload = draw;