let game = document.getElementById("game");
let cvs = game.getContext("2d");

// Зображення
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

// Константи
let hole = 130;
let xPos = 50;
let yPos = game.height / 2 - 25;
let grav = 1.5;
let jump = 35;
let score = 0;
let gameOver = false;

// Рух вгору
document.addEventListener("keydown", moveUp);
function moveUp() {
  yPos -= jump;
}

// Отримати випадкову висоту верхньої труби
function getRandomTopHeight() {
  const maxTop = game.height - fg.height - hole - 100; // щоб нижня труба не була надто маленькою
  return Math.floor(Math.random() * maxTop) + 20;
}

// Труби
let pipe = [];
pipe[0] = {
  x: game.width,
  topHeight: getRandomTopHeight(),
};

function draw() {
  if (gameOver) return;

  // Фон
  cvs.drawImage(bg, 0, 0, game.width, game.height);

  for (let i = 0; i < pipe.length; i++) {
    let pipeX = pipe[i].x;
    let topHeight = pipe[i].topHeight;

    // Верхня труба (приклеєна до верху)
    cvs.drawImage(pipeUp, pipeX, 0, pipeUp.width, topHeight);

    // Нижня труба (приклеєна до низу)
    let bottomY = game.height - fg.height;
    let bottomPipeY = topHeight + hole;
    let bottomPipeHeight = bottomY - bottomPipeY;
    cvs.drawImage(
      pipeBottom,
      pipeX,
      bottomY - bottomPipeHeight,
      pipeBottom.width,
      bottomPipeHeight
    );

    // Рух труб
    pipe[i].x -= 2;

    // Створення нової труби
    if (pipe[i].x === 200) {
      pipe.push({
        x: game.width,
        topHeight: getRandomTopHeight(),
      });
    }

    // Перевірка зіткнення
    if (
      xPos + bird.width >= pipeX &&
      xPos <= pipeX + pipeUp.width &&
      (yPos <= topHeight || yPos + bird.height >= bottomY - bottomPipeHeight)
    ) {
      endGame();
    }

    // Рахунок
    if (pipe[i].x + pipeUp.width < xPos && !pipe[i].scored) {
      score++;
      pipe[i].scored = true;
    }
  }

  // Перевірка на землю
  if (yPos + bird.height >= game.height - fg.height) {
    endGame();
  }

  // Земля
  cvs.drawImage(fg, 0, game.height - fg.height, game.width, fg.height);

  // Пташка
  cvs.drawImage(bird, xPos, yPos);

  // Гравітація
  yPos += grav;

  // Рахунок
  cvs.fillStyle = "#000";
  cvs.font = "28px sans-serif";
  cvs.fillText("Рахунок: " + score, 20, game.height - 30);

  requestAnimationFrame(draw);
}

function endGame() {
  if (!gameOver) {
    gameOver = true;

    // Отримуємо рекорд з localStorage
    let bestScore = localStorage.getItem("bestScore") || 0;
    bestScore = Math.max(bestScore, score);

    // Зберігаємо оновлений рекорд
    localStorage.setItem("bestScore", bestScore);

    setTimeout(() => {
      alert(
        `GAME OVER\nВаш рахунок: ${score}\nНайкращий рахунок: ${bestScore}`
      );
      location.reload();
    }, 100);
  }
}

// Завантаження зображень
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
