//Canvas Postion
const canvas = document.getElementById("sceneCanvas");
let ctx = canvas.getContext('2d');

//Color Variable
const WHITE = "rgb(255,255,255)";
const YELLOW = "rgb(255,255,0)";
const BLUE = "rgb(100,149,237)";
const RED = "rgb(188,39,50)";
const DARK_GREY = "rgb(80,78,81)";


class Planet {
    AU = 149.6e6 * 1000;
    G = 6.67428e-11;
    SCALE = 180 / this.AU;
    timeStep = 3600 * 24;

    constructor(x, y, radius, color, mass, name) {
        this.x = x;
        this.y = y;

        this.radius = radius;
        this.color = color;
        this.mass = mass;
        this.name = name;
        
        this.orbit = [];
        this.sun = false;
        this.distanceToSun = 0;

        this.velX = 0;
        this.velY = 0;
    }
    
    drawBall(posX, posY, radius, color) {

        ctx.beginPath();
        ctx.arc(posX, posY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    drawName(name,color, posX, posY) {
        ctx.font = "12px Arial";
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText(name, posX, posY);
        ctx.fillStyle = color;
        ctx.fillText(name, posX, posY);
        ctx.textAlign = "center";
    }

    draw() {
        let _x = this.x * this.SCALE + canvas.width / 2;
        let _y = this.y * this.SCALE + canvas.height / 2;

        this.drawBall(_x, _y, this.radius, this.color);
        this.drawName(this.name, this.color, _x , _y);
    }

    attraction(other) {
        let x_other = other.x;
        let y_other = other.y;
        let distanceX = x_other - this.x;
        let distanceY = y_other - this.y;
        let distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        if (!other.sun) {
            this.distanceToSun = distance;
        }

        let force = this.G * this.mass * other.mass / distance ** 2;
        let theta = Math.atan2(distanceY, distanceX);
        let forceX = Math.cos(theta) * force;
        let forceY = Math.sin(theta) * force;

        return [forceX, forceY];
    }

    updatePosition(planets) {
        let totalFx = 0;
        let totalFy = 0;
        for (let planet of planets){
            if(planet === this) {
                continue;
            }

            let [fx, fy] = this.attraction(planet);
            totalFx += fx;
            totalFy += fy;
        }

        this.velX += totalFx / this.mass * this.timeStep;
        this.velY += totalFy / this.mass * this.timeStep;

        this.x += this.velX * this.timeStep;
        this.y += this.velY * this.timeStep;
        this.orbit.push([this.x, this.y]);
    }
}

// Planet
const sun = new Planet(0, 0, 30, YELLOW, 1.9892 * 10**30, 'sun');
sun.sun = true;

const earth = new Planet(-1 * new Planet().AU, 0, 16, BLUE, 5.9742 * 10**24, 'earth');
earth.velY = 29.783 * 1000;

const mars = new Planet(-1.524 * new Planet().AU, 0, 12, RED, 6.39 * 10**23, 'mars');
mars.velY = 24.077 * 1000;

const mercury = new Planet(0.387 * new Planet().AU, 0, 8, DARK_GREY, 3.30 * 10**23, 'mercury');
mercury.velY = -47.4 * 1000;

const venus = new Planet(0.723 * new Planet().AU, 0, 14, WHITE, 4.8685 * 10**24, 'venus');
venus.velY = -35.02 * 1000;

const test = new Planet(1.6 * new Planet().AU, 0, 16, BLUE, 3.9742 * 10**24, 'earth');
earth.velY = 29.783 * 1000;

let planets = [sun, earth, mars, mercury, venus];

function createPlanet() {
    let nameInput = document.getElementById("name").value;
    let posX = document.getElementById("posX").value;
    //let posY = document.getElementById("posY").value;
    let radius = document.getElementById("radius").value;
    let massUnit = document.getElementById("mass").value;
    let massPower = document.getElementById("massPower").value;
    let color = document.getElementById("color").value;
    let velY = document.getElementById("velY").value

    let mass = massUnit * 10 ** massPower;
    const newPlanet = new Planet(posX * new Planet().AU, 0, radius, color, mass, nameInput);
    newPlanet.velY = -velY * 1000;

    planets.push(newPlanet);
    newPlanet.draw();
}
function main() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const planet of planets) {
        planet.updatePosition(planets);
        planet.draw();
    }
}

let isRunning = false;
function running() {
    if(isRunning === true){
        main();
    }
}

main();
setInterval(running, 10);