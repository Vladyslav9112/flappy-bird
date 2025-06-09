let game = document.getElementById("game");
let cvs = game.getContext("2d");

let bird = new Image();
let fg = new Image();
let bg = new Image();
let pipeUp = new Image();
let pipeBottom = new Image();

bird.src = "img/flappy_bird_bird.png";
fg.src = "img/flappy_bird_fgpng.png";
bg.src = "img/flappy_bird_bg.png";
pipeUp.src = "img/flappy_bird_pipeUp.png";
pipeBottom.src = "img/flappy_bird_pipeBottom.png";

let hole = 90;
let xPos = 10;
let yPos = 270;
let grav = 1;
let score = 0;
let gameOver = false; // <--- прапорець для уникнення багатьох перезавантажень

document.addEventListener("keydown", moveUp);
function moveUp() {
  yPos -= 30;
}

let pipe = [];
pipe[0] = {
  x: game.width,
  y: 0,
};

function draw() {
  if (gameOver) return; // якщо кінець — не малюємо

  cvs.drawImage(bg, 0, 0);

  for (let i = 0; i < pipe.length; i++) {
    cvs.drawImage(pipeUp, pipe[i].x, pipe[i].y);
    cvs.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + hole);

    pipe[i].x--;

    if (pipe[i].x === 125) {
      pipe.push({
        x: game.width,
        y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
      });
    }

    if (
      xPos + bird.width >= pipe[i].x &&
      xPos <= pipe[i].x + pipeUp.width &&
      (yPos <= pipe[i].y + pipeUp.height ||
        yPos + bird.height >= pipe[i].y + pipeUp.height + hole)
    ) {
      endGame();
    }

    if (pipe[i].x === 5) {
      score++;
    }
  }

  // Перевірка на землю
  if (yPos + bird.height >= game.height - fg.height) {
    endGame();
  }

  cvs.drawImage(fg, 0, game.height - fg.height);
  cvs.drawImage(bird, xPos, yPos);
  yPos += grav;

  cvs.fillStyle = "#000";
  cvs.font = "20px sans-serif";
  cvs.fillText("Рахунок: " + score, 10, game.height - 20);

  requestAnimationFrame(draw);
}

function endGame() {
  if (!gameOver) {
    gameOver = true;
    setTimeout(() => {
      alert("GAME OVER");
      location.reload();
    }, 100); // затримка щоб уникнути бага з подвійним викликом
  }
}

// Запуск після завантаження всіх картинок
let imagesToLoad = [bird, fg, bg, pipeUp, pipeBottom];
let imagesLoaded = 0;

imagesToLoad.forEach((img) => {
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === imagesToLoad.length) {
      draw();
    }
  };
});
