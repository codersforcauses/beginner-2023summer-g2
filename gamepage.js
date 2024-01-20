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
// enemies position
let enemiesX = 20
let enemiesY = 20
//enemies size
const enemiesWidth = 10
const enemiesHeight = 5


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
