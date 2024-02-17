const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const Start = document.getElementById('Start');
const GameOver = document.getElementById('GameOver');
const Pause = document.getElementById('Pause');

const BossAlert1 = document.getElementById('BossAlert1');
const BossAlert2 = document.getElementById('BossAlert2');
const BossDie = document.getElementById('BossDie');
const BossSpawn = document.getElementById('BossSpawn');

const EnemyShootSFX = document.getElementById('EnemyShoot');
const ShootSFX = document.getElementById('Shoot');
const EnemyDieSFX = document.getElementById('EnemyDie');
const PlayerHitSFX = document.getElementById('PlayerHit');

const Flak = document.getElementById('Flak');
const Reload = document.getElementById('Reload');

const Overcharge = document.getElementById('Overcharge');
const OverchargeCD = document.getElementById('OverchargeCD');

const Shield = document.getElementById('Shield');
const ShieldCD = document.getElementById('ShieldCD');

const Heal = document.getElementById('Heal');
const HealCD = document.getElementById('HealCD');

const BossHit1 = document.getElementById('BossHit1');
const BossHit2 = document.getElementById('BossHit2');
const BossHit3 = document.getElementById('BossHit3');
const BossHit4 = document.getElementById('BossHit4');

const Boss5SFX = document.getElementById('Boss5SFX');

canvas.width = 1024
canvas.height = 675

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
            //const scale = 0.15
            this.image = image
            //67.5 x 37.75 2:1 ratio
            this.width = 60//image.width * scale
            this.height = 30//image.height * scale

            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 5
            }
        }
        this.damage = 1;
        this.health = 10;
        this.immune = false;
        this.immunityDuration = 300; // 2.5 seconds in frames
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
    shoot() {
        const numProjectiles = 5;
        const angleStep = Math.PI / 20; // Adjust the angle step as needed
        for (let i = 0; i < numProjectiles; i++) {
            const angleOffset = (i - (numProjectiles - 1) / 2) * angleStep;
            const projectileVelocity = {
                x: Math.sin(angleOffset) * -10,
                y: Math.cos(angleOffset) * -10
            };
            projectiles.push(new Projectile({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y
                },
                velocity: projectileVelocity
            }));
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

class ProtectiveRectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.position = { 
            x: canvas.width / 2 - this.width / 2 + 150,
            y: canvas.height - this.height + 20 };
    }
    draw() {
        if (this.isActive) {
            // Draw the rectangle using the canvas API
            const halfWidth = this.width / 2;
            const halfHeight = this.height / 2;

            c.beginPath();
            c.globalAlpha = 0.5; // Adjust transparency as needed
            c.fillStyle = 'blue'; // Change color as needed
            c.fillRect(this.position.x - halfWidth, this.position.y - 100, this.width, this.height);
            c.globalAlpha = 1; // Reset transparency
            c.closePath();
        }
    }
    update() {
        this.draw();
    }
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}

const shield = new ProtectiveRectangle(300, 20);

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
        if (enigmaCount >= 1) {
            this.velocity = {
                x: 0,
                y: 5
            }
        } else if (harbingerCount >= 1){
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
        if (primordialCount >= 2) {
            this.health = 3
        } else if (ancientCount >= 1) {
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
        const rows = Math.floor(Math.random() * 5 + 3)
        this.width = columns * 30
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({
                    position: {
                        x: x * 30,
                        y: y * 30
                    },
                    isSpliced: false
                }))
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

class EliteProjectile {
    constructor({position}){
        this.position = position
        if (primordialCount >= 1) {
            this.velocity = {
                x: 0,
                y: 6
            }
        } else if (lunaCount >= 1) {
            this.velocity = {
                x: 0,
                y: 5
            }
        } else {
            this.velocity = {
                x:0,
                y:4
            }
        }
        this.width = 10
        this.height = 30
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

class Elite {
    constructor() {
        this.velocity = {
            x: 3,
            y: 0
        }
        const image = new Image()
        image.src = './img/elite.png'
        image.onload = () => {
            //const scale = 1
            this.image = image
            this.width = 100
            this.height = 70
            this.position = {
                x: canvas.width / 2,
                y: 180
            }
        }
        this.health = 100
        this.cd = 100
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
        this.cd--;
    }     
    shoot(invaderProjectiles) {
        invaderProjectiles.push(
            new EliteProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            }
            
        })
        )
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
            this.height = 150
            this.position = {
                x: canvas.width / 2,
                y: 0
            }
        }
        //Boss health and cooldowns
        this.health = 600
        this.cd = 0
        this.ecd = 0
        this.mrcd = 0
        this.mlcd = 0
        this.cscd = 20000
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
        this.health = 1500
        this.efcd = 0
        this.aocd = 0
        this.secd = 0
        this.cscd = 25000
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
        this.health = 2500
        this.mpcd = 0
        this.mrcd = 0
        this.mlcd = 0
        this.cscd = 30000
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
        this.health = 3000
        this.cd1 = 0
        this.cd2 = 0
        this.cd3 = 0
        this.cd4 = 35000
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
        this.cd4--;
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
        this.health = 5000
        this.cd1 = 0
        this.cd2 = 0
        this.cd3 = 0
        this.cd4 = 0
        this.cd5 = 0
        this.cd6 = 0
        this.cd7 = 40000
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (this.image){
            // Check if health is below 300 and image hasn't been changed
            if (this.health < 2000 && this.image.src !== './img/boss5.2.png') {
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
        this.cd7--;
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
const harbinger = new Harbinger()
const enigma = new Enigma()
const ancient = new Ancient()
const primordial = new Primordial()
const elite = new Elite()

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles =[]
const particles = []
const keys = {
    a:{pressed: false},
    d: {pressed: false},
    space: {pressed: false},
    q: { pressed: false},
    w: { pressed: false},
    e: { pressed: false},
    r: { pressed: false}
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
    if (!animationPaused) {
        requestAnimationFrame(animate);
    } 
    //requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    shield.update()

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
        // enemy projectile hits player
        if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y + 2 && 
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x + 5 &&
            invaderProjectile.position.x <= player.position.x + player.width - 5 &&
            !player.immune) {
                invaderProjectiles.splice(index, 1)
                player.immune = true
                player.health--;
                gameState.hearts = player.health
                updateHearts(player.health);
                if (player.health === 0){
                    setTimeout(() => {
                        game.over = true
                        gameState.gameover = true;
                        showGameOverScreen(true);
                        hideBossWarning();
                        Ecount = 0;
                        myGameGlobals.Score = score
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
        // enemy projectile hits shield
        if (shield.isActive) {
            if (invaderProjectile.position.y + invaderProjectile.height >= shield.position.y - 100 && 
                invaderProjectile.position.x + invaderProjectile.width >= shield.position.x - 150 &&
                invaderProjectile.position.x <= shield.position.x + 150) {
                    invaderProjectiles.splice(index, 1)                
                    createParticles({
                        object: invaderProjectile,
                        color: 'blue',
                        fades: true
                    })
            }
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
    // Invaders logic
    grids.forEach((grid, gridIndex) => {
        grid.update()
        //spawn enemy projectiles at random
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }        

        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity})
            //player projectile hits enemy
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
                                invader.isSpliced = true
                                score += 100
                                scoreEl.innerHTML = score
                            }
                        }
                    }, 0)
                }
            })
        })
        if (game.active) {
            // Game over if invader hits the bottom screen
            if (grid.invaders.some(invader => invader.position.y + invader.height >= canvas.height && !invader.isSpliced)) {
                // Trigger game over logic here
                setTimeout(() => {
                    game.over = true
                    gameState.gameover = true;
                    showGameOverScreen(true);
                    hideBossWarning();
                    Ecount = 0;
                    myGameGlobals.Score = score
                }, 2000)
                setTimeout(() => {
                    game.active = false
                    player.opacity = 0
                }, 0)
                createParticles({
                    object: player,
                    color: 'white',
                    fades: true
                })
            }
        }
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
        //player shooting logic
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
    if (startCount >= 1 && game.active){
        if (frames % randomInterval === 0) {
            if (bosstimer >= 1 && lunaCount <= 0) {

                grids.push(new Grid())

            } else if (lunaCount <= 0 && bossNumber === 1) {

                lunaSpawned = true;
                hideBossWarning();

            } else if (bosstimer >= 1 && lunaCount === 1) {

                grids.push(new Grid())

            } else if (harbingerCount <= 0 && bossNumber === 2) {

                harbingerSpawned = true;
                hideBossWarning();

            } else if (bosstimer >= 1 && harbingerCount === 1) {

                grids.push(new Grid())

            } else if (enigmaCount <= 0 && bossNumber === 3) {

                enigmaSpawned = true;
                hideBossWarning();

            } else if (bosstimer >= 1 && enigmaCount === 1) {

                grids.push(new Grid())

            } else if (ancientCount <= 0 && bossNumber === 4) {

                ancientSpawned = true;
                hideBossWarning();

            } else if (bosstimer >= 1 && ancientCount === 1) {

                grids.push(new Grid())

            } else if (bossNumber >= 5){

                primordialSpawned = true;
                hideBossWarning();

            }

            if (lunaCount >= 1) {
                randomInterval = Math.floor(Math.random() * 400 + 500)
            } else {
                randomInterval = Math.floor(Math.random() * 500 + 700)
            }

            frames = 0
            if (elitetimer <= 0 && !lunaSpawned && !harbingerSpawned && !enigmaSpawned && !ancientSpawned && !primordialSpawned) {
                if (primordialCount >= 2) {
                    elite.health = 300
                } else if (primordialCount >= 1) {
                    elite.health = 250
                } else if (ancientCount >= 1) {
                    elite.health = 200
                } else if (harbingerCount >= 1){
                    elite.health = 150
                } else if (lunaCount >= 1) {
                    elite.health = 120
                } else {
                    elite.health = 100
                }
                eliteSpawned = true;
                elitetimer = Math.floor(Math.random () * 1000 + 5500)
            }            
        }
        if (eliteSpawned) {
            elite.update();
            if (game.active){
                if (elite.cd <= 0){
                    elite.shoot(invaderProjectiles);
                    elite.cd = Math.random() * 20 + 100;
                }
            }
            //player hits Elite Invader
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= elite.position.y + elite.height && 
                    projectile.position.x + projectile.radius >= elite.position.x && 
                    projectile.position.x - projectile.radius <= elite.position.x + elite.width &&
                    projectile.position.y + projectile.radius >= elite.position.y) {
                    setTimeout(() => {
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)
                        // remove invader and projectile upon collision
                        if (projectileFound){
                            projectiles.splice(j,1)
                            elite.health -= player.damage;
                            createParticles({
                                object: elite,
                                color: 'red',
                                fades: true
                            })
                            if (elite.health <= 0) {
                                eliteSpawned = false
                                score += 1000
                                scoreEl.innerHTML = score
                            }
                        }
                    }, 0)
                }
            })
        }
        // Bosses Attacks
        if (lunaSpawned) {
            luna.update();
            if (game.active){
                if (luna.cd >= 250){
                    luna.shoot(invaderProjectiles, "LucentBeam");
                    luna.cd = 0;
                }
                if (luna.ecd >= 80){
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
                    luna.cscd = 2000;
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
                        // reduce health and remove projectile upon collision
                        if (projectileFound){
                            projectiles.splice(j,1)
                            luna.health -= player.damage;
                            console.log(luna.health)
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
                                bosstimer = Math.floor(Math.random () * 2000 + 14000)                                
                                player.health = 10
                                gameState.hearts = player.health;
                                updateHearts(player.health)

                            }
                        }
                    }, 0)
                }
            })
        }
        if (harbingerSpawned) {
            harbinger.update();
            if (game.active){
            if (harbinger.aocd >= 170){
                harbinger.shoot(invaderProjectiles, "ArcaneOrb");
                harbinger.aocd = 0;
            }
            if (harbinger.efcd >= 17){
                harbinger.shoot(invaderProjectiles, "EssenceFlux");
                harbinger.efcd = 0;
            }
            if (harbinger.secd >= 1700){
                harbinger.shoot(invaderProjectiles, "SanitysEclipse")
                harbinger.secd = 0;
            }
            if (harbinger.cscd <= 0) {
                grids.push(new Grid())
                harbinger.cscd = 2000;
            }
        }
            //player hits Harbinger
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= harbinger.position.y + harbinger.height && 
                    projectile.position.x + projectile.radius >= harbinger.position.x && 
                    projectile.position.x - projectile.radius <= harbinger.position.x + harbinger.width &&
                    projectile.position.y + projectile.radius >= harbinger.position.y) {
                    setTimeout(() => {
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)
                        // reduce health and remove projectile upon collision
                        if (projectileFound){
                            projectiles.splice(j,1)
                            harbinger.health -= player.damage;
                            console.log(harbinger.health)
                            createParticles({
                                object: harbinger,
                                color: 'purple',
                                fades: true
                            })
                            if (harbinger.health <= 0) {
                                harbingerSpawned = false
                                harbingerCount++;
                                score += 20000
                                scoreEl.innerHTML = score
                                bosstimer = Math.floor(Math.random () * 2000 + 14000) 
                                player.health = 10
                                gameState.hearts = player.health;
                                updateHearts(player.health)

                            }
                        }
                    }, 0)
                }
            }) 
        }
        if (enigmaSpawned) {
            enigma.update();
            if (game.active){
            if (enigma.mpcd === 12){
                enigma.shoot(invaderProjectiles, "MidnightPulse");
                enigma.mpcd = 0;
            }
            if (enigma.mrcd === 300){
                enigma.shoot(invaderProjectiles, "MaleficeRight");
                enigma.mrcd = 0;
            }
            if (enigma.mlcd === 300){
                enigma.shoot(invaderProjectiles, "MaleficeLeft")
                enigma.mlcd = 0;
            }
            if (enigma.cscd <= 0) {
                grids.push(new Grid())
                enigma.cscd = 2500;
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
                        // reduce health and remove projectile upon collision
                        if (projectileFound){
                            projectiles.splice(j,1)
                            enigma.health -= player.damage;
                            console.log(enigma.health)
                            createParticles({
                                object: enigma,
                                color: 'red',
                                fades: true
                            })
                            if (enigma.health <= 0) {
                                enigmaSpawned = false
                                enigmaCount++;
                                score += 30000
                                scoreEl.innerHTML = score
                                bosstimer = Math.floor(Math.random () * 2000 + 14000)
                                player.health = 10
                                gameState.hearts = player.health;
                                updateHearts(player.health)
                                
                            }
                        }
                    }, 0)
                }
            }) 
        }
        if (ancientSpawned) {
            ancient.update();
            if (game.active){
            if (ancient.cd1 >= 12){
                ancient.shoot(invaderProjectiles, "MidnightPulse");
                ancient.cd1 = 0;
            }
            if (ancient.cd2 >= 22){
                ancient.shoot(invaderProjectiles, "EssenceFlux");
                ancient.cd2 = 0;
            }
            if (ancient.cd3 >= 300){
                ancient.shoot(invaderProjectiles, "ArcaneOrb")
                ancient.cd3 = 0;
            }
            if (ancient.cd4 <= 0) {
                grids.push(new Grid())
                ancient.cd4 = 3000;
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
                        // reduce health and remove projectile upon collision
                        if (projectileFound){
                            projectiles.splice(j,1)
                            ancient.health -= player.damage;
                            console.log(ancient.health)
                            createParticles({
                                object: ancient,
                                color: 'cyan',
                                fades: true
                            })
                            if (ancient.health <= 0) {
                                ancientSpawned = false
                                ancientCount++;
                                score += 40000
                                scoreEl.innerHTML = score
                                bosstimer = Math.floor(Math.random () * 2000 + 14000)
                                player.health = 10
                                gameState.hearts = player.health;
                                updateHearts(player.health)

                            }
                        }
                    }, 0)
                }
            }) 
        }
        if (primordialSpawned) {
            primordial.update();
            if (game.active){
            if (primordial.cd1 >= 12){
                primordial.shoot(invaderProjectiles, "MidnightPulse");
                primordial.cd1 = 0;
            }
            if (primordial.cd2 >= 22){
                primordial.shoot(invaderProjectiles, "EssenceFlux");
                primordial.cd2 = 0;
            }
            if (primordial.cd3 >= 322){
                primordial.shoot(invaderProjectiles, "MaleficeRight")
                primordial.cd3 = 0;
            }
            if (primordial.cd4 >= 322) {
                primordial.shoot(invaderProjectiles, "MaleficeLeft")
                primordial.cd4 = 0;
            }
            if (primordial.cd5 >= 252 && primordial.health <= 2000){
                primordial.shoot(invaderProjectiles, "LucentBeam")
                primordial.cd5 = 0;
            }
            if (primordial.cd6 >= 82 && primordial.health <= 2000){
                primordial.shoot(invaderProjectiles, "Eclipse")
                primordial.cd6 = 0;
            }
            if (primordial.cd7 <= 0) {
                grids.push(new Grid())
                primordial.cd7 = 3000;
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
                            console.log(primordial.health)
                            createParticles({
                                object: primordial,
                                color: 'red',
                                fades: true
                            })
                            if (primordial.health <= 0) {
                                primordialSpawned = false
                                score += 50000
                                scoreEl.innerHTML = score
                                bosstimer = Math.floor(Math.random () * 2000 + 14000)
                                primordial.cd7 = 35000
                                primordial.health = 6000
                                primordialCount++
                                primordial.image.src = './img/boss5.1.png'
                                player.health = 10
                                gameState.hearts = player.health;
                                updateHearts(player.health)

                            }
                        }
                    }, 0)
                }
            }) 
        }
    }
    frames++
    bosstimer--
    elitetimer--
    if (bosstimer <= 0 && !lunaSpawned && !harbingerSpawned && !enigmaSpawned && !ancientSpawned && !primordialSpawned && game.active) {
        showBossWarning()
        bossWarningFrames++
        if (bossWarningFrames >= bossWarningDuration) {
            hideBossWarning();
            bossNumber++
            bossWarningFrames = 0
            frames = randomInterval
        }
    }
    // Powers
    // Flak Cannon: Shoots in a cone, regenerates 2 ammo per second
    if (keys.q.pressed) {        
        if (canShoot && qAmmo >= 1 && lunaCount >= 1) 
        {
            player.shoot()
            canShoot = false;
            setTimeout(resetCooldown, fireCooldown);
            qAmmo--
        }
    }
    qReload--
    if (qReload <= 0 && qAmmo <= 99) {
        qAmmo++
        if (primordialCount >= 1) {
            qReload = 35
        } else {
            qReload = 55
        }
    }
    if (lunaCount >= 1) {
        document.getElementById('icon1Count').textContent = qAmmo;
    } else {
        document.getElementById('icon1Count').textContent = "Locked";
    }

    // Overcharge: Improves fire rate significantly for a few seconds
    if (keys.w.pressed && wCooldown <= 0 && harbingerCount >= 1) 
    {
        fireCooldown = 15
        if (primordialCount >= 1) {
            wCooldown = 3000
            wDuration = 800
        } else {
            wCooldown = 4000
            wDuration = 660
        }
        
    }
    wDuration--
    wCooldown--
    if (wDuration <= 0) {
        fireCooldown = 100
    }
    if (wCooldown >=0 && harbingerCount >= 1) {
        document.getElementById('icon2Count').textContent = Math.floor(wCooldown/100);
    } else if (harbingerCount >= 1) {
        document.getElementById('icon2Count').textContent = "Ready";
    } else {
        document.getElementById('icon2Count').textContent = "Locked";
    }

    // Force Field: Creates a protective barrier in the middle of the screen
    if (keys.e.pressed && eCooldown <= 0 && enigmaCount >= 1) 
    {
        eDuration = 1500
        shield.activate()

        if (primordialCount >= 1) {
            eCooldown = 3200
        } else {
            eCooldown = 4000
        }
    } 
    eDuration--
    eCooldown--
    if (eDuration <= 0) {
        shield.deactivate()
    }
    if (eCooldown >=0 && enigmaCount >= 1) {
        document.getElementById('icon3Count').textContent = Math.floor(eCooldown/100);
    } else if (enigmaCount >= 1) {
        document.getElementById('icon3Count').textContent = "Ready";
    } else {
        document.getElementById('icon3Count').textContent = "Locked";
    }

    // Nano Machines: Heals the player by 3 health
    if (keys.r.pressed && rCooldown <=0 && ancientCount >= 1) 
    {
        if (player.health >= 7) {
            player.health = 10
            gameState.hearts = player.health;
            updateHearts(player.health);
        } else {
            player.health += 3
            gameState.hearts = player.health;
            updateHearts(player.health);
        }
        if (primordialCount >= 1) {
            rCooldown = 3500
        } else {
            rCooldown = 4500
        }
    }
    rCooldown--
    if (rCooldown >=0 && ancientCount >= 1) {
        document.getElementById('icon4Count').textContent = Math.floor(rCooldown/100);
    } else if (ancientCount >= 1) {
        document.getElementById('icon4Count').textContent = "Ready";
    } else {
        document.getElementById('icon4Count').textContent = "Locked";
    }
}
let icon1Count = 100; 
let icon2Count = 6000;
let icon3Count = 0; 
let icon4Count = 0;

let qAmmo = 100
let qReload = 6000
let wCooldown = 0
let wDuration = 600
let eDuration = 1200
let eCooldown = 6000
let rCooldown = 6000

let lunaSpawned = false;
let harbingerSpawned = false;
let enigmaSpawned = false;
let ancientSpawned = false;
let primordialSpawned = false;
let eliteSpawned = false;

let lunaCount = 0;
let harbingerCount = 0;
let enigmaCount = 0;
let ancientCount = 0;
let primordialCount = 0

let bosstimer = Math.floor(Math.random () * 3000 + 12000)
randomInterval = 500
let elitetimer = Math.floor(Math.random() * 2000 + 4000)
let bossWarningFrames = 0;
const bossWarningDuration = 600;
let bossNumber = 0

//ledaerboard dict
var leaderboard = JSON.parse(localStorage.getItem("leaderboard"))||[
    {name: "start", score : 1},
];


//display the leaderboard 
function generateLeaderboard() {
    var leaderboardBody = document.getElementById("leaderboardBody");
    leaderboardBody.innerHTML = "";
    // Display only top 10 entries
    var topEntries = leaderboard.slice(0, 10);
    topEntries.forEach(function(entry, index) {
        var leaderboardItem = document.createElement("div");
        leaderboardItem.classList.add("leaderboard-item");
        leaderboardItem.innerHTML = `
            <span class="position">${index + 1}.</span>
            <span class="name">${entry.name}</span>
            <span class="score">${entry.score}</span>
        `;
        leaderboardBody.appendChild(leaderboardItem);
    });

}
function saveLeaderboardData() {
    localStorage.setItem("leaderboardData", JSON.stringify(leaderboard));
}

//adding score to leaderboard

function updateLeaderboard(score) {
    var testscore = score;
    var top10Scores = leaderboardData.slice(0, 10).map(entry => entry.score);
    if (testscore > Math.min(...top10Scores)) {
        var name = (Math.floor(Math.random() * 1000) + 1).toString();

        leaderboard.push({ name: name, score: score });
        leaderboard.sort(function(a, b) {
            return b.score - a.score;
        });
        saveLeaderboardData(); // Save updated data to localStorage
    }
}



function showGameOverScreen(show) {
    // Get the score element
    const scoreOverElement = document.getElementById('scoreOver');


    // Set the content of the score element to the current score
    scoreOverElement.textContent = score;
    updateLeaderboard(score);

    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.style.display = show ? 'block' : 'none';

    
}
generateLeaderboard();




function showPauseScreen(show) {
    const startScreen = document.getElementById('pauseScreen');
    startScreen.style.display = show ? 'block' : 'none';
}

showPauseScreen(false);

function pauseAnimation() {
    if (!game.over){
        animationPaused = true;
        hideBossWarning();
    }
    //animationPaused = true;
    return animationPaused;
}

// Function to resume the animation
function resumeAnimation() {
    if (animationPaused) {
        animationPaused = false;
        animate();
    }
}
let Ecount = 0

window.addEventListener('keydown', ({ key }) => {
    if (key === 'Enter' && Ecount <= 0 && myGameGlobals.canAcceptInput) {
        resetGame();
        Ecount++;
    } else if (key === 'Enter' && animationPaused === false && myGameGlobals.canAcceptInput && !game.over) {
        Ecount++;
        pauseAnimation();
        showPauseScreen(true);

    } else if (key === 'Enter' && myGameGlobals.canAcceptInput){
        Ecount++;
        resumeAnimation();
        showPauseScreen(false);
    }
});

// Fire rate logic, set the desired fire rate in milliseconds 
let fireCooldown = 100; 
let canShoot = true;
function resetCooldown() {
    canShoot = true;
}

let startCount = 0
function resetGame() {
    myGameGlobals.Score = 0
    showGameOverScreen(false);
    showStartScreen(false);
    startCount = 1
    gameState.gamestart = 1
    Ecount = 0
    // Reset Powers
    shield.deactivate()
    qReload = 100
    wCooldown = 0
    eCooldown = 0
    rCooldown = 0
    // Reset Bosses
    lunaSpawned = false;
    harbingerSpawned = false;
    enigmaSpawned = false;
    ancientSpawned = false;
    primordialSpawned = false;
    eliteSpawned = false;
    lunaCount = 0;
    harbingerCount = 0;
    enigmaCount = 0;
    ancientCount = 0;
    primordialCount = 0;
    bosstimer = Math.floor(Math.random () * 3000 + 12000)
    elitetimer = Math.floor(Math.random() * 2000 + 8000)
    bossWarningFrames = 0
    bossNumber = 0
    // Reset any game-related variables or states here
    game.over = false;
    gameState.gameover = false;
    game.active = true; // Set to true to restart the game
    player.opacity = 1;
    player.position = {
        x: canvas.width / 2 - player.width / 2,
        y: canvas.height - player.height - 5
    };
    invaderProjectiles.length = 0
    projectiles.length = 0; // Clear projectiles array
    grids.length = 0; // Clear grids array
    score = 0;
    scoreEl.innerHTML = score;
    player.health = 10;
    gameState.hearts = player.health;
    updateHearts(player.health);
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
        case 'q':
        case '1':
            keys.q.pressed = true;
            break;
        case 'w':
        case '2':
            keys.w.pressed = true;
            break;
        case 'e':
        case '3':
            keys.e.pressed = true;
            break;
        case 'r':
        case '4': 
            keys.r.pressed = true;
            break;
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
        case 'q':
        case '1':
            keys.q.pressed = false;
            break;
        case 'w':
        case '2':
            keys.w.pressed = false;
            break;
        case 'e':
        case '3':
            keys.e.pressed = false;
            break;
        case 'r':
        case '4': 
            keys.r.pressed = false;
            break;
    }
})
function showStartScreen(show) {
    const startScreen = document.getElementById('startScreen');
    startScreen.style.display = show ? 'block' : 'none';
}

// Add this function to show the boss warning
function showBossWarning() {
    const bossWarning = document.getElementById('bossWarning');
    bossWarning.classList.remove('hidden');
    bossWarning.style.opacity = 1;
}
// Add this function to hide the boss warning
function hideBossWarning() {
    const bossWarning = document.getElementById('bossWarning');
    setTimeout(() => {
        bossWarning.classList.add('hidden');
    }, 10);
}

showStartScreen(true)
let animationPaused = false;

const minecraftHeartsContainer = document.getElementById('minecraftHeartsContainer');
// Function to update hearts based on player's health
function updateHearts(playerHealth) {
  const fullHeartImage = './img/mcheart.png';
  const emptyHeartImage = './img/mcempty.png';

  // Clear existing hearts
  minecraftHeartsContainer.innerHTML = '';

  // Add hearts based on player's health
  for (let i = 0; i < 10; i++) {
    const heartDiv = document.createElement('div');
    heartDiv.classList.add('minecraft-heart');

    const heartImage = document.createElement('img');
    heartImage.src = i < playerHealth ? fullHeartImage : emptyHeartImage;
    heartImage.alt = i < playerHealth ? 'Full Heart' : 'Empty Heart';
    heartImage.width = 30;
    heartImage.height = 30;

    heartDiv.appendChild(heartImage);
    // Insert each heart before the first child (left-most position)
    minecraftHeartsContainer.insertBefore(heartDiv, minecraftHeartsContainer.firstChild);
  }
}
updateHearts(gameState.hearts);

animate();

