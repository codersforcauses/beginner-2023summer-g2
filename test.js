const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

const size = 20;
const speed = 10;
let speedX = 0;
let speedY = 0;
let pressedKeys = new Set(); // Set to store currently pressed keys

let lastShotTime = 0;
const shootingInterval = 500; // 1 second in milliseconds

let bullets = [];

let enemiesX = 50;
let enemiesY = 50;
const enemiesWidth = 30;
const enemiesHeight = 20;
let enemyColor = 'red';
let collisionTimeout = null; // Timeout variable for delaying the color reset

// Set initial position for the blue triangle at the bottom middle
let x = (canvas.width - size) / 2;
let y = canvas.height - size;


function drawTriangle(x, y, size, color) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size / 2, y - size);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawTriangle(x, y, size, 'blue'); // Draw a blue triangle for the square
    ctx.fillStyle = enemyColor;
    ctx.fillRect(enemiesX, enemiesY, enemiesWidth, enemiesHeight);
    
    // Draw bullets
    ctx.fillStyle = 'blue';
    for (const bullet of bullets) {
      ctx.fillRect(bullet.x, bullet.y, 5, 5);
    }
  }


function handleKeyDown(event) {
  // Add the pressed key to the Set
  pressedKeys.add(event.keyCode);

  // Check for diagonal movement
  if (pressedKeys.has(37) && pressedKeys.has(38)) {
    // Up and left
    speedX = -speed;
    speedY = -speed;
  } else if (pressedKeys.has(37) && pressedKeys.has(40)) {
    // Down and left
    speedX = -speed;
    speedY = speed;
  } else if (pressedKeys.has(39) && pressedKeys.has(38)) {
    // Up and right
    speedX = speed;
    speedY = -speed;
  } else if (pressedKeys.has(39) && pressedKeys.has(40)) {
    // Down and right
    speedX = speed;
    speedY = speed;
  } else {
    // Handle non-diagonal movement
    speedX = 0;
    speedY = 0;

    if (pressedKeys.has(37)) {
    // Left arrow
    speedX = -speed;
    } else if (pressedKeys.has(39)) {
    // Right arrow
    speedX = speed;
    }

    if (pressedKeys.has(38)) {
    // Up arrow
    speedY = -speed;
    } else if (pressedKeys.has(40)) {
    // Down arrow
    speedY = speed;
    }
  }

  x = Math.max(0, Math.min(x + speedX, canvas.width - size));
  y = Math.max(0, Math.min(y + speedY, canvas.height - size));
  draw();
}

function handleKeyUp(event) {
  // Remove the released key from the Set
  pressedKeys.delete(event.keyCode);

  // Reset speed if no arrow keys are pressed
  if (pressedKeys.size === 0) {
    speedX = 0;
    speedY = 0;
  }
}

function shootBullet() {
    const currentTime = new Date().getTime();
  
    // Check if enough time has passed since the last shot
    if (currentTime - lastShotTime >= shootingInterval) {
      bullets.push({
        x: x + size / 2 - 2.5,
        y: y,
        speed: 8
      });
  
      lastShotTime = currentTime; // Update the last shot time
    }
  }


  function checkCollisions() {
    // Check collisions with bullets
    for (const bullet of bullets) {
      if (
        bullet.x < enemiesX + enemiesWidth &&
        bullet.x + 5 > enemiesX &&
        bullet.y < enemiesY + enemiesHeight &&
        bullet.y + 5 > enemiesY
      ) {
        enemyColor = 'black'; // Change enemy color to black on collision with a bullet
  
        // Set a timeout to reset the enemy color after a certain time (e.g., 500 milliseconds)
        clearTimeout(collisionTimeout);
        collisionTimeout = setTimeout(() => {
          enemyColor = 'red'; // Reset enemy color to red
        }, 200);
      }
    }
  
    // Check collision with square
    if (
      x < enemiesX + enemiesWidth &&
      x + size > enemiesX &&
      y < enemiesY + enemiesHeight &&
      y + size > enemiesY
    ) {
      enemyColor = 'grey';
    }
    
  }

// Add event listeners for keydown and keyup
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Add event listener for shooting (spacebar)
document.addEventListener('keydown', (event) => {
    if (event.keyCode === 32) {
      shootBullet();
    }
  });
  
// Game loop
function gameLoop() {
    // Update bullet positions
    for (const bullet of bullets) {
      bullet.y -= bullet.speed;
  
      // Check if the bullet is out of the canvas
      if (bullet.y < 0) {
        bullets.shift(); // Remove the first bullet (FIFO)
      }
    }
    
    checkCollisions(); // Check collisions with bullets and square
    draw(); // Redraw the scene
    requestAnimationFrame(gameLoop); // Continue the game loop
  }
  
  // Initial draw
  draw();
  
  // Start the game loop
  gameLoop();

