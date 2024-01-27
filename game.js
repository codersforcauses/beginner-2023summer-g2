const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 710

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0
        this.opacity = 1

        const image = new Image()
        image.src = './img/spaceship.png'
        image.onload = () => {
            const scale = 0.15
            this.image = image
            //50?
            this.width = image.width * scale
            this.height = image.height * scale

            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }

        this.damage = 1;
        this.health = 30;
        this.immune = false;
        this.immunityDuration = 300; // 3 seconds in frames
    }
    draw() {
        c.save()
        c.globalAlpha = this.opacity

        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        c.rotate(this.rotation)
        c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)
        
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        c.restore()
    }
    update() {
        if (this.image){
            this.draw()
            this.position.x += this.velocity.x
        }

        if (this.immune) {
            this.immunityDuration--; 
            if (this.immunityDuration <= 0) {
                this.immune = false;
                this.immunityDuration = 300;
            }
        }
    }     
}

class Projectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 4
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle {
    constructor({position, velocity, radius, color, fades}){
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades

    }
    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.fades){
            this.opacity -= 0.005
        }
        
    }
}

class InvaderProjectile {
    constructor({position}){
        this.position = position

        if (score >= 1000) {
            this.velocity = {
                x: 0,
                y: 4
            }
        } else {
            this.velocity = {
                x: 0,
                y: 3
            }
        }

        this.width = 3
        this.height = 10

    }
    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (game.active) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class Invader {
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image()
        image.src = './img/invader.png'
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            }
        }
        //invader health increases after certain bosses
        if (ancientCount >= 1) {
            this.health = 2
        } else {
            this.health = 1
        }
        
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update({velocity}) {
        if (this.image){
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }   
    }     
    shoot(invaderProjectiles) {
        invaderProjectiles.push(
            new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            }
            
        })
        )
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = []
        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)
        this.width = columns * 30

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({position: {
                    x: x * 30,
                    y: y * 30
                        }
                    })
                )
            }
        }
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (game.active){
            if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
                this.velocity.x = -this.velocity.x
                this.velocity.y = 30
            } 
        } else if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
        }

    }
}

class MoonGlaivesRight {
    constructor({position}){
        this.position = position

        this.velocity = {
            x: 0,
            y: 5
        }

        this.width = 20
        this.height = 100

    }
    draw() {
        
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (game.active) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class MoonGlaivesLeft {
    constructor({position}){
        this.position = position

        this.velocity = {
            x: 0,
            y: 5
        }

        this.width = 20
        this.height = 100

    }
    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (game.active) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class LucentBeam {
    constructor({position}){
        this.position = position

        this.velocity = {
            x: 0,
            y: 9
        }

        this.width = 50
        this.height = 150

    }
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (game.active) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class Eclipse {
    constructor({position}){
        this.position = position

        this.velocity = {
            x: 0,
            y: 6
        }

        this.width = 35
        this.height = 120

    }
    draw() {
        c.fillStyle = 'grey'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (game.active) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class Luna {
    constructor() {
        this.velocity = {
            x: 2,
            y: 0
        }

        const image = new Image()
        image.src = './img/boss1.png'
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = 333
            this.height = 111
            this.position = {
                x: canvas.width / 2,
                y: 0
            }
        }
        //Boss health
        this.health = 500
        this.cd = 0
        this.ecd = 0
        this.mrcd = 0
        this.mlcd = 0
        this.cscd = 35000
        
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        
    }
    update() {

        if (this.image){
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y

            if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
                this.velocity.x = -this.velocity.x
            }   
        }  
        this.cd++;
        this.ecd++;
        this.mrcd++;
        this.mlcd++;
        this.cscd--;
        
    } 

    shoot(projectiles, type) {
        switch (type) {
            case "LucentBeam":
                projectiles.push(
                    new LucentBeam({
                        position: {
                            x: this.position.x + this.width / 2,
                            y: this.position.y
                        }
                    })
                );
                break;
            case "Eclipse":
                projectiles.push(
                    new Eclipse({
                        position: {
                            x: Math.random() * canvas.width,
                            y: 0
                        }
                    })
                );
                break;
            case "MoonGlaivesRight":
                projectiles.push(
                    new MoonGlaivesRight({
                        position: {
                            x: this.position.x + this.width * 0.66,
                            y: this.position.y + this.height
                        }
                    })
                )
                break;
            case "MoonGlaivesLeft":
                projectiles.push(
                    new MoonGlaivesLeft({
                        position: {
                            x: this.position.x + this.width * 0.33,
                            y: this.position.y + this.height
                        }
                    })
                )
        }
    }
}

class ArcaneOrb {
    constructor({position}){
        this.position = position

        this.velocity = {
            x: 0,
            y: 3
        }

        this.width = 100
        this.height = 100

    }
    draw() {
        c.fillStyle = 'cyan'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (game.active) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class EssenceFlux {
    constructor({position}){
        this.position = position

        this.velocity = {
            x: 0,
            y: 5
        }

        this.width = 10
        this.height = 25

    }
    draw() {
        c.fillStyle = 'grey'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (game.active) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class SanitysEclipse {
    constructor({position}){
        this.position = position

        this.velocity = {
            x: 0,
            y: 2
        }

        this.width = 500
        this.height = 200

    }
    draw() {
        c.fillStyle = 'yellow'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (game.active) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class Harbinger {
    constructor() {
        this.velocity = {
            x: 1,
            y: 0
        }

        const image = new Image()
        image.src = './img/boss2.png'
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = 400
            this.height = 150
            this.position = {
                x: canvas.width / 2,
                y: 0
            }
        }
        //Boss health and cooldown
        this.health = 500
        this.efcd = 0
        this.aocd = 0
        this.secd = 0
        this.cscd = 35000
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (this.image){
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y

            if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
                this.velocity.x = -this.velocity.x
            }   
        }  
        this.efcd++;
        this.aocd++;
        this.secd++;
        this.cscd--;
        
    } 
    shoot(projectiles, type) {
        switch (type) {
            case "ArcaneOrb":
                projectiles.push(
                    new ArcaneOrb({
                        position: {
                            x: this.position.x + this.width / 2,
                            y: this.position.y + this.height
                        }
                    })
                );
                break;
            case "EssenceFlux":
                projectiles.push(
                    new EssenceFlux({
                        position: {
                            x: this.position.x + this.width * Math.random(),
                            y: this.position.y + this.height
                        }
                    })
                );
                break;
            case "SanitysEclipse":
                projectiles.push(
                    new SanitysEclipse({
                        position: {
                            x: canvas.width / 2 - 250,
                            y: 0
                        }
                    })
                )
                break;
        }
    }
}

class MidnightPulse {
    constructor({position}){
        this.position = position

        this.velocity = {
            x: 0,
            y: Math.random() * 4 + 2
        }

        this.width = 6
        this.height = 10

    }
    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (game.active) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class MaleficeRight {
    constructor({position}){
        this.position = position

        this.velocity = {
            x: 0,
            y: Math.random() * 4 + 3
        }

        this.width = 33
        this.height = 200

    }
    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (game.active) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class MaleficeLeft {
    constructor({position}){
        this.position = position

        this.velocity = {
            x: 0,
            y: Math.random() * 4 + 3
        }

        this.width = 33
        this.height = 200

    }
    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (game.active) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class Enigma {
    constructor() {
        this.velocity = {
            x: 1,
            y: 0
        }

        const image = new Image()
        image.src = './img/boss3.png'
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = 400
            this.height = 150
            this.position = {
                x: canvas.width / 2,
                y: 0
            }
        }
        //Boss health
        this.health = 500
        this.mpcd = 0
        this.mrcd = 0
        this.mlcd = 0
        this.cscd = 35000
        
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {

        if (this.image){
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y

            if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
                this.velocity.x = -this.velocity.x
            }   
        }  
        this.mpcd++;
        this.mrcd++;
        this.mlcd++;
        this.cscd--;
        
    } 

    shoot(projectiles, type) {
        switch (type) {
            case "MidnightPulse":
                projectiles.push(
                    new MidnightPulse({
                        position: {
                            x: canvas.width * Math.random(),
                            y: 0
                        }
                    })
                );
                break;
            case "MaleficeRight":
                projectiles.push(
                    new MaleficeRight({
                        position: {
                            x: this.position.x + this.width * 0.7,
                            y: 0
                        }
                    })
                );
                break;
            case "MaleficeLeft":
                projectiles.push(
                    new MaleficeLeft({
                        position: {
                            x: this.position.x + this.width * 0.3,
                            y: 0
                        }
                    })
                )
                break;
        }
    }
}

class Ancient {
    constructor() {
        this.velocity = {
            x: 1.5,
            y: 0
        }

        const image = new Image()
        image.src = './img/boss4.png'
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = 400
            this.height = 150
            this.position = {
                x: canvas.width / 2,
                y: 0
            }
        }
        //Boss health and cooldown
        this.health = 500
        this.cd1 = 0
        this.cd2 = 0
        this.cd3 = 0
        this.cd4 = 0
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (this.image){
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y

            if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
                this.velocity.x = -this.velocity.x
            }   
        }  
        this.cd1++;
        this.cd2++;
        this.cd3++;
        this.cd4++;
        
    } 
    shoot(projectiles, type) {
        switch (type) {
            case "ArcaneOrb":
                projectiles.push(
                    new ArcaneOrb({
                        position: {
                            x: this.position.x + this.width / 2,
                            y: this.position.y + this.height
                        }
                    })
                );
                break;
            case "EssenceFlux":
                projectiles.push(
                    new EssenceFlux({
                        position: {
                            x: this.position.x + this.width * Math.random(),
                            y: this.position.y + this.height
                        }
                    })
                );
                break;
            case "MidnightPulse":
                projectiles.push(
                    new MidnightPulse({
                        position: {
                            x: canvas.width * Math.random(),
                            y: 0
                        }
                    })
                )
                break;
        }
    }
}

class Primordial {
    constructor() {
        this.velocity = {
            x: 1.5,
            y: 0
        }

        const image = new Image()
        image.src = './img/boss5.1.png'
        
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = 400
            this.height = 200
            this.position = {
                x: canvas.width / 2,
                y: 0
            }
        }
        //Boss health and cooldown
        this.health = 500
        this.cd1 = 0
        this.cd2 = 0
        this.cd3 = 0
        this.cd4 = 0
        this.cd5 = 0
        this.cd6 = 0
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        
        if (this.image){
            // Check if health is below 300 and image hasn't been changed
            if (this.health < 300 && this.image.src !== './img/boss5.2.png') {
                const newImage = new Image();
                newImage.src = './img/boss5.2.png';
                // Optionally, you can also update width and height if they are different for the new image
                newImage.onload = () => {
                    this.image = newImage; // Change the image source
                    this.width = 400; // Set the new width
                    this.height = 200; // Set the new height
                    if (this.velocity.x >= 1) {
                        this.velocity.x = 2; // Change the velocity
                    } else {
                        this.velocity.x = -2;
                    }
                    
                };
                
        }

            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y

            if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
                this.velocity.x = -this.velocity.x
            }   
        }  
        
    
    
        this.cd1++;
        this.cd2++;
        this.cd3++;
        this.cd4++;
        this.cd5++;
        this.cd6++;
        
    } 
    shoot(projectiles, type) {
        switch (type) {
            case "EssenceFlux":
                projectiles.push(
                    new EssenceFlux({
                        position: {
                            x: this.position.x + this.width * Math.random(),
                            y: this.position.y + this.height
                        }
                    })
                );
                break;
            case "MidnightPulse":
                projectiles.push(
                    new MidnightPulse({
                        position: {
                            x: canvas.width * Math.random(),
                            y: 0
                        }
                    })
                )
                break;
            case "MaleficeRight":
                projectiles.push(
                    new MaleficeRight({
                        position: {
                            x: this.position.x + this.width * 0.7,
                            y: 0
                        }
                    })
                );
                break;
            case "MaleficeLeft":
                projectiles.push(
                    new MaleficeLeft({
                        position: {
                            x: this.position.x + this.width * 0.3,
                            y: 0
                        }
                    })
                )
                break;
            case "LucentBeam":
                projectiles.push(
                    new LucentBeam({
                        position: {
                            x: this.position.x + this.width / 2,
                            y: this.position.y
                        }
                    })
                );
                break;
            case "Eclipse":
                projectiles.push(
                    new Eclipse({
                        position: {
                            x: Math.random() * canvas.width,
                            y: 0
                        }
                    })
                );
                break;
        }
    }
}

const luna = new Luna()
const od = new Harbinger()
const enigma = new Enigma()
const ancient = new Ancient()
const primordial = new Primordial()

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles =[]
const particles = []
const keys = {
    a:{
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }    
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
let game = {
    over: false,
    active: false
}
let score = 0

for (let i = 0; i < 100; i++){

    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 1
        },
        radius: Math.random() * 2,
        color: 'white'
    }))
}

function createParticles({object, color, fades }) {
    for (let i = 0; i<15; i++){

        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3
            },
            radius: Math.random() * 3,
            color: color || 'blue',
            fades
        }))
    }
}

function animate(){
    requestAnimationFrame(animate)
    
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    
    player.update()

    particles.forEach((particle, i) => {

        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)    
        } else {
            particle.update()
        }
    })

    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else invaderProjectile.update()

        //projectile hits player
        if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y && 
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x + 5 &&
            invaderProjectile.position.x <= player.position.x + player.width - 5 &&
            !player.immune) {

                invaderProjectiles.splice(index, 1)
                player.immune = true
                player.health--;
                //console.log(player.health)
                if (player.health === 0){
                    setTimeout(() => {
                        game.over = true
                        showGameOverScreen(true);
                        Ecount = 0;
                    }, 2000)
    
                    setTimeout(() => {
                        invaderProjectiles.splice(index, 1)
                        game.active = false
                        player.opacity = 0
                        
                    }, 0)
                }
                
                createParticles({
                    object: player,
                    color: 'white',
                    fades: true
                })
        }

    })

    //player projectiles
    projectiles.forEach((projectile, index) => {

        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
            
        } else{
            projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()

        //spawn projectiles
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }

        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity})

            //projectiles hit enemy
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height && 
                    projectile.position.x + projectile.radius >= invader.position.x && 
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y) {

                    setTimeout(() => {
                        const invaderFound = grid.invaders.find((invader2) => invader2 === invader)
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)

                        // remove invader and projectile upon collision
                        
                        if (invaderFound && projectileFound){
                            
                            createParticles({
                                object: invader,
                                color: 'purple',
                                fades: true
                            })
                            projectiles.splice(j,1)
                            invader.health -= player.damage;

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                                grid.position.x = firstInvader.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }

                            if (invader.health <= 0) {
                                grid.invaders.splice(i, 1)
                                score += 100
                                scoreEl.innerHTML = score
                            }
                        }
                    }, 0)
                }
            })
        })
    })

    if (game.active) {
        //moving logic
        if (keys.a.pressed && player.position.x >= 0 && !keys.d.pressed) {
            player.velocity.x = -5
            player.rotation = -0.15

        } else if (keys.d.pressed && player.position.x + player.width <= canvas.width && !keys.a.pressed)
        {
            player.velocity.x = 5
            player.rotation = 0.15
        }
       else {
            player.velocity.x = 0
            player.rotation = 0
        }

        //shooting logic
        if (keys.space.pressed) {
            if (canShoot) {
                projectiles.push(new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y
                    },
                    velocity: {
                        x: 0,
                        y: -10
                    }
                }));

                canShoot = false;
                setTimeout(resetCooldown, fireCooldown);
            }
        }
    } 

    //spawn enemies
    if (startCount >= 1){
        if (frames % randomInterval === 0) {
            
            if (bosstimer >= 1 && lunaCount <= 0) {

                grids.push(new Grid())
                console.log(bosstimer)
                console.log('first loop')

            } else if (lunaCount <= 0) {

                console.log(bosstimer)
                console.log('luna loop')

                lunaSpawned = true;

            } else if (bosstimer >= 1 && lunaCount === 1) {

                grids.push(new Grid())
                console.log(bosstimer)
                console.log('second loop')

            } else if (odCount <= 0) {

                console.log(bosstimer)
                console.log('od loop')

                harbingerSpawned = true;

            } else if (bosstimer >= 1 && odCount === 1) {

                grids.push(new Grid())
                console.log(bosstimer)
                console.log('third loop')

            } else if (enigmaCount <= 0) {

                console.log(bosstimer)
                console.log('enigma loop')

                enigmaSpawned = true;

            } else if (bosstimer >= 1 && enigmaCount === 1) {

                grids.push(new Grid())
                console.log(bosstimer)
                console.log('fourth loop')

            } else if (ancientCount <= 0) {

                console.log(bosstimer)
                console.log('ancient loop')

                ancientSpawned = true;

            } else if (bosstimer >= 1 && ancientCount === 1) {

                grids.push(new Grid())
                console.log(bosstimer)
                console.log('fifth loop')

            } else {

                console.log(bosstimer)
                console.log('primordial loop')

                primordialSpawned = true;
            }
            randomInterval = Math.floor(Math.random() * 400 + 700)
            frames = 0
        }

        // Bosses Attacks
        if (lunaSpawned) {
            luna.update();
            if (game.active){
                if (luna.cd === 250){
                    luna.shoot(invaderProjectiles, "LucentBeam");
                    luna.cd = 0;
                }
                
                if (luna.ecd === 80){
                    luna.shoot(invaderProjectiles, "Eclipse");
                    luna.ecd = 0;
                }
                
                if (luna.mrcd >= 40 && luna.velocity.x <= 1 && luna.health < 250){
                    luna.shoot(invaderProjectiles, "MoonGlaivesRight")
                    luna.mrcd = 0;
                    
                }
    
                if (luna.mlcd >= 40 && luna.velocity.x >= 1 && luna.health < 250){
                    luna.shoot(invaderProjectiles, "MoonGlaivesLeft")
                    luna.mlcd = 0;
                    
                }
                if (luna.cscd <= 0) {
                    grids.push(new Grid())
                    luna.cscd = 3000;
                }
            }
            
            //player hits Luna
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= luna.position.y + luna.height && 
                    projectile.position.x + projectile.radius >= luna.position.x && 
                    projectile.position.x - projectile.radius <= luna.position.x + luna.width &&
                    projectile.position.y + projectile.radius >= luna.position.y) {

                    setTimeout(() => {
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)

                        // remove invader and projectile upon collision
                        
                        if (projectileFound){
                            projectiles.splice(j,1)
                            luna.health -= player.damage;
                            //console.log(luna.health)
                            createParticles({
                                object: luna,
                                color: 'grey',
                                fades: true
                            })

                            if (luna.health <= 0) {
                                lunaSpawned = false
                                lunaCount++;
                                score += 10000
                                scoreEl.innerHTML = score
                                console.log(frames)
                                bosstimer = Math.floor(Math.random () * 4000 + 20000)
                                //player.health = 10

                            }
                        }
                    }, 0)
                }
            })
        }

        if (harbingerSpawned) {
            od.update();
            if (game.active){
            if (od.aocd === 200){
                od.shoot(invaderProjectiles, "ArcaneOrb");
                od.aocd = 0;
            }
            
            if (od.efcd === 20){
                od.shoot(invaderProjectiles, "EssenceFlux");
                od.efcd = 0;
            }
            
            if (od.secd === 2000){
                od.shoot(invaderProjectiles, "SanitysEclipse")
                od.secd = 0;
            }

            if (od.cscd <= 0) {
                grids.push(new Grid())
                od.cscd = 3333;
            }
        }
            //player hits OD
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= od.position.y + od.height && 
                    projectile.position.x + projectile.radius >= od.position.x && 
                    projectile.position.x - projectile.radius <= od.position.x + od.width &&
                    projectile.position.y + projectile.radius >= od.position.y) {

                    setTimeout(() => {
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)

                        // remove invader and projectile upon collision
                        
                        if (projectileFound){
                            projectiles.splice(j,1)
                            od.health -= player.damage;
                            //console.log(od.health)
                            createParticles({
                                object: od,
                                color: 'purple',
                                fades: true
                            })
                            if (od.health <= 0) {
                                harbingerSpawned = false
                                odCount++;
                                score += 10000
                                scoreEl.innerHTML = score
                                console.log(frames)
                                bosstimer = Math.floor(Math.random () * 4000 + 20000)
                                
                            }
                        }
                    }, 0)
                }
            }) 
        }

        if (enigmaSpawned) {
            enigma.update();
            if (game.active){

            if (enigma.mpcd === 13){
                enigma.shoot(invaderProjectiles, "MidnightPulse");
                enigma.mpcd = 0;
            }
            
            if (enigma.mrcd === 333){
                enigma.shoot(invaderProjectiles, "MaleficeRight");
                enigma.mrcd = 0;
            }
            
            if (enigma.mlcd === 333){
                enigma.shoot(invaderProjectiles, "MaleficeLeft")
                enigma.mlcd = 0;
            }

            if (enigma.cscd <= 0) {
                grids.push(new Grid())
                enigma.cscd = 3333;
            }
        }
            
            //player hits enigma
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= enigma.position.y + enigma.height && 
                    projectile.position.x + projectile.radius >= enigma.position.x && 
                    projectile.position.x - projectile.radius <= enigma.position.x + enigma.width &&
                    projectile.position.y + projectile.radius >= enigma.position.y) {

                    setTimeout(() => {
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)

                        // remove invader and projectile upon collision
                        
                        if (projectileFound){
                            projectiles.splice(j,1)
                            enigma.health -= player.damage;
                            //console.log(enigma.health)
                            createParticles({
                                object: enigma,
                                color: 'red',
                                fades: true
                            })
                            if (enigma.health <= 0) {
                                enigmaSpawned = false
                                enigmaCount++;
                                score += 10000
                                scoreEl.innerHTML = score
                                console.log(frames)
                                bosstimer = Math.floor(Math.random () * 4000 + 20000)

                            }
                        }
                    }, 0)
                }
            }) 
        }

        if (ancientSpawned) {
            ancient.update();
            if (game.active){

            if (ancient.cd1 === 12){
                ancient.shoot(invaderProjectiles, "MidnightPulse");
                ancient.cd1 = 0;
            }
            
            if (ancient.cd2 === 22){
                ancient.shoot(invaderProjectiles, "EssenceFlux");
                ancient.cd2 = 0;
            }
            
            if (ancient.cd3 === 333){
                ancient.shoot(invaderProjectiles, "ArcaneOrb")
                ancient.cd3 = 0;
            }

            if (ancient.cd4 <= 0) {
                grids.push(new Grid())
                ancient.cd4 = 3333;
            }
        }
            
            //player hits ancient
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= ancient.position.y + ancient.height && 
                    projectile.position.x + projectile.radius >= ancient.position.x && 
                    projectile.position.x - projectile.radius <= ancient.position.x + ancient.width &&
                    projectile.position.y + projectile.radius >= ancient.position.y) {

                    setTimeout(() => {
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)

                        // remove invader and projectile upon collision
                        
                        if (projectileFound){
                            projectiles.splice(j,1)
                            ancient.health -= player.damage;
                            createParticles({
                                object: ancient,
                                color: 'cyan',
                                fades: true
                            })
                            if (ancient.health <= 0) {
                                ancientSpawned = false
                                ancientCount++;
                                score += 10000
                                scoreEl.innerHTML = score
                                console.log(frames)
                                bosstimer = Math.floor(Math.random () * 4000 + 20000)

                            }
                        }
                    }, 0)
                }
            }) 
        }
        if (primordialSpawned) {
            primordial.update();
            if (game.active){

            if (primordial.cd1 === 13){
                primordial.shoot(invaderProjectiles, "MidnightPulse");
                primordial.cd1 = 0;
            }
            
            if (primordial.cd2 === 23){
                primordial.shoot(invaderProjectiles, "EssenceFlux");
                primordial.cd2 = 0;
            }
            
            if (primordial.cd3 === 343){
                primordial.shoot(invaderProjectiles, "MaleficeRight")
                primordial.cd3 = 0;
            }

            if (primordial.cd4 === 343) {
                primordial.shoot(invaderProjectiles, "MaleficeLeft")
                primordial.cd4 = 0;
            }

            if (primordial.cd5 >= 253 && primordial.health <= 300){
                primordial.shoot(invaderProjectiles, "LucentBeam")
                primordial.cd5 = 0;
            }

            if (primordial.cd6 >= 83 && primordial.health <= 300){
                primordial.shoot(invaderProjectiles, "Eclipse")
                primordial.cd6 = 0;
            }
            if (primordial.cd7 <= 0) {
                grids.push(new Grid())
                if (primordial.health <= 300){
                    primordial.cd7 = 4333;
                } else {
                    primordial.cd7 = 3333;
                }
            }
        }
            
            //player hits primordial
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= primordial.position.y + primordial.height && 
                    projectile.position.x + projectile.radius >= primordial.position.x && 
                    projectile.position.x - projectile.radius <= primordial.position.x + primordial.width &&
                    projectile.position.y + projectile.radius >= primordial.position.y) {

                    setTimeout(() => {
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)
                        
                        if (projectileFound){
                            projectiles.splice(j,1)
                            primordial.health -= player.damage;
                            createParticles({
                                object: primordial,
                                color: 'red',
                                fades: true
                            })
                            if (primordial.health <= 0) {
                                primordialSpawned = false
                                score += 10000
                                scoreEl.innerHTML = score
                                console.log(frames)
                                bosstimer = Math.floor(Math.random () * 4000 + 20000)

                            }
                        }
                    }, 0)
                }
            }) 
        }
    }
    frames++
    bosstimer--

}
let lunaSpawned = false;
let harbingerSpawned = false;
let enigmaSpawned = false;
let ancientSpawned = false;
let primordialSpawned = false;

let lunaCount = 0;
let odCount = 0;
let enigmaCount = 0;
let ancientCount = 0;

let bosstimer = Math.floor(Math.random () * 4000 + 20000)
randomInterval = 500

function showGameOverScreen(show) {
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.style.display = show ? 'block' : 'none';
}

let Ecount = 0

window.addEventListener('keydown', ({ key }) => {
    if (key === 'Enter' && Ecount <= 0) {
        Ecount++;
        resetGame();
    }
});

// Fire rate logic, set the desired fire rate in milliseconds 
const fireCooldown = 100; 
let canShoot = true;

function resetCooldown() {
    canShoot = true;
}

let startCount = 0

function resetGame() {
    showGameOverScreen(false);
    showStartScreen(false); // Add this line to hide the start screen
    startCount = 1
    // Reset Bosses
    lunaSpawned = false;
    harbingerSpawned = false;
    enigmaSpawned = false;
    ancientSpawned = false;
    primordialSpawned = false;
    lunaCount = 0;
    odCount = 0;
    enigmaCount = 0;
    ancientCount = 0;
    bosstimer = Math.floor(Math.random () * 4000 + 20000)
    // Reset any game-related variables or states here
    game.over = false;
    game.active = true; // Set to true to restart the game
    player.opacity = 1;
    player.position = {
        x: canvas.width / 2 - player.width / 2,
        y: canvas.height - player.height - 20
    };
    invaderProjectiles.length = 0
    projectiles.length = 0; // Clear projectiles array
    grids.length = 0; // Clear grids array
    score = 0;
    scoreEl.innerHTML = score;
    player.health = 100;
    frames = 0;
    
}

window.addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'a':
        case 'ArrowLeft':
            keys.a.pressed = true
            break
        case 'd':
        case 'ArrowRight':
            keys.d.pressed = true
            break
        case ' ':
            keys.space.pressed = true
            break    
    }
})

window.addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
        case 'ArrowLeft':
            keys.a.pressed = false
            break
        case 'd':
        case 'ArrowRight':
            keys.d.pressed = false
            break
        case ' ':
            keys.space.pressed = false
            break
    }
})


function showStartScreen(show) {
    const startScreen = document.getElementById('startScreen');
    startScreen.style.display = show ? 'block' : 'none';
}
/*
showStartScreen(true); 
*/
animate();
