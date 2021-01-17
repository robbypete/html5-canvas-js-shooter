var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleHit = false;

var rightPressed = false;
var leftPressed = false;
var fireButtonPressed = false;
var spacebarLock = false;

var enemyHeight = 40;
var enemyWidth = 100;
var enemyYPos = 30;
var enemySpeed = 2;
var enemyX = (canvas.width - enemyWidth) / 2;
var enemyHit = false;

var score = 0;
var lives = 3;

var bullets = [];
var bulletSpeed = 3;
var bulletHeight = 8;
var bulletWidth = 3;

var enemyBullets = [];
var ENEMY_BULLET_MAX_TIMER = 500;
var enemyBulletCounter = 0;

var bulletCooling = false;

const BULLET_COOLDOWN = 10;
var bulletCooldownCounter = BULLET_COOLDOWN;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  } else if (e.key == " ") {
    if (!spacebarLock) {
      fireButtonPressed = true;
      spacebarLock = true;
    }
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  } else if (e.key == " ") {
    spacebarLock = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function mouseDownHandler() {
  fireButtonPressed = true;
}

function drawEnemy() {
  ctx.beginPath();
  ctx.rect(enemyX, enemyYPos, enemyWidth, enemyHeight);
  if (enemyHit) {
    ctx.fillStyle = "#FFFF00";
    enemyHit = false;
  } else {
    ctx.fillStyle = "#DD6300";
  }

  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  if (paddleHit) {
    ctx.fillStyle = "#FFFF00";
  } else {
    ctx.fillStyle = "#0095DD";
  }

  ctx.fill();
  ctx.closePath();
}

function drawBullets() {
  for (const bullet of bullets) {
    ctx.beginPath();
    ctx.rect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    ctx.fillStyle = "#333333";
    ctx.fill();
    ctx.closePath();
  }

  for (const bullet of enemyBullets) {
    ctx.beginPath();
    ctx.rect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    ctx.fillStyle = "#DD6300";
    ctx.fill();
    ctx.closePath();
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawEnemy();
  drawBullets();
  drawPaddle();
  drawScore();
  drawLives();

  // Enemy movement
  if (
    enemyX + enemySpeed + enemyWidth > canvas.width ||
    enemyX + enemySpeed < 0
  ) {
    enemySpeed = -enemySpeed;
  }

  // Paddle movement
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  if (fireButtonPressed) {
    if (!bulletCooling) {
      bulletCooling = true;
      bulletCooldownCounter = BULLET_COOLDOWN;
      bullets.push({
        x: paddleX + paddleWidth / 2,
        y: canvas.height - paddleHeight,
      });
    }
    fireButtonPressed = false;
  }

  bullets = bullets.reduce(function (res, bullet) {
    bullet.y -= bulletSpeed;

    // Checking for bullet collision
    if (
      bullet.x > enemyX &&
      bullet.x < enemyX + enemyWidth &&
      bullet.y > enemyYPos &&
      bullet.y < enemyYPos + enemyHeight
    ) {
      score++;
      if (score == 10) {
        alert("You win");
        document.location.reload();
      }
      enemyHit = true;
    } else {
      // Check if out of bounds
      if (bullet.y > 0) {
        res.push(bullet);
      }
    }
    return res;
  }, []);

  enemyBulletCounter += 1;
  if (Math.floor(Math.random() * ENEMY_BULLET_MAX_TIMER) < enemyBulletCounter) {
    enemyBullets.push({
      x: Math.floor(Math.random() * enemyWidth + enemyX),
      y: enemyYPos,
    });
    enemyBulletCounter = 0;
  }

  enemyBullets = enemyBullets.reduce(function (res, bullet) {
    bullet.y += bulletSpeed;

    // Checking for bullet collision
    if (
      bullet.x > paddleX &&
      bullet.x < paddleX + paddleWidth &&
      bullet.y > canvas.height - paddleHeight
    ) {
      lives--;
      if (lives < 0) {
        alert("You lose");
        document.location.reload();
      }
      paddleHit = true;
    } else {
      // Check if out of bounds
      if (bullet.y < canvas.height) {
        res.push(bullet);
      }
    }
    return res;
  }, []);

  bulletCooldownCounter -= 1;
  if (bulletCooldownCounter == 0) {
    bulletCooling = false;
  }

  enemyX += enemySpeed;
  requestAnimationFrame(draw);
}

draw();
