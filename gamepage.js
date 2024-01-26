const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d")

const canvasWidth = 110
const canvasHeight = 80


//character position
let x = 70
let y = 70
//character size
let size = 5

function character(){

    //draw character
    ctx.fillStyle ='white'
    ctx.fillRect(x, y, size, size)

}
function moveCharacter(key) {
    // Adjust character position based on arrow keys
    switch (key.keyCode) {
      case 37: // Left arrow key
        if (x > 0) x -= 2;
        break;
      case 38: // Up arrow key
        if (y > 0) y -= 2;
        break;
      case 39: // Right arrow key
        if (x < canvasWidth - size) x += 2;
        break;
      case 40: // Down arrow key
        if (y < canvasHeight - size) y += 2;
        break;
    }
    key.preventDefault();
  }

  // Event listener for arrow key input
  window.addEventListener("keydown", moveCharacter,false);

// enemies position
let enemiesX = 20
let enemiesY = 20
//enemies size
const enemiesWidth = 10
const enemiesHeight = 10


function enemies(){
    ctx.fillStyle ='red'
    ctx.fillRect(enemiesX,enemiesY,enemiesWidth,enemiesHeight)
}


function draw(){
    ctx.fillStyle ='grey'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    enemies()
    character()

    window.requestAnimationFrame(draw);

}

draw()
