const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");

let playerPosition = 130;
let score = 0;
let gameInterval;
let blockInterval;
let isGameRunning = false;

// Move player
document.addEventListener("keydown", (e) => {
  if (!isGameRunning) return;

  if (e.key === "ArrowLeft" && playerPosition > 0) {
    playerPosition -= 20;
  } 
  else if (e.key === "ArrowRight" && playerPosition < 260) {
    playerPosition += 20;
  }

  player.style.left = playerPosition + "px";
});

// Start game
startBtn.addEventListener("click", startGame);

function startGame() {
  if (isGameRunning) return;

  isGameRunning = true;
  score = 0;
  scoreDisplay.textContent = score;
  startBtn.disabled = true;

  // Clear old blocks
  document.querySelectorAll(".block").forEach(b => b.remove());

  gameInterval = setInterval(() => {
    score++;
    scoreDisplay.textContent = score;
  }, 1000);

  blockInterval = setInterval(createBlock, 800);
}

// Create falling block
function createBlock() {
  if (!isGameRunning) return;

  const block = document.createElement("div");
  block.classList.add("block");
  block.style.left = Math.floor(Math.random() * 260) + "px";
  gameArea.appendChild(block);

  let blockTop = 0;

  const fallInterval = setInterval(() => {
    if (!isGameRunning) {
      clearInterval(fallInterval);
      return;
    }

    blockTop += 5;
    block.style.top = blockTop + "px";

    // 🚨 COLLISION DETECTION
    if (isColliding(player, block)) {
      clearInterval(fallInterval);
      endGame();
    }

    // Remove block if out of bounds
    if (blockTop > 400) {
      block.remove();
      clearInterval(fallInterval);
    }

  }, 30);
}

// Collision function (Bounding Box)
function isColliding(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

// End game
function endGame() {
  isGameRunning = false;
  clearInterval(gameInterval);
  clearInterval(blockInterval);
  startBtn.disabled = false;

  alert("💥 Game Over! Your Score: " + score);
}
