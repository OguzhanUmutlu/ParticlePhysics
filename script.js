const canvas = document.getElementById("canvas");
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const random_hex = () => Math.floor(Math.random() * 16777215).toString(16);

const OPTIONS = {
    "minimum particles per move": 2,
    "maximum particles per move": 8,
    "velocity x minimum": -5,
    "velocity x maximum": 5,
    "velocity y minimum": -5,
    "size minimum": 5,
    "size maximum": 15,
    "velocity limit minimum": 2,
    "velocity limit maximum": 15
};

class V2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new V2(this.x, this.y);
    }
}

V2.UP = 0;
V2.DOWN = 1;

class Particle extends V2 {
    constructor(x, y, canvas) {
        super(x, y);
        this.canvas = canvas;
        this.size = random(OPTIONS["size minimum"], OPTIONS["size maximum"]);
        this.velocity = new V2(random(OPTIONS["velocity x minimum"] * 10, OPTIONS["velocity x maximum"] * 10) / 10, random(OPTIONS["velocity y minimum"] * 10, 0) / 10);
        this.way = V2.UP;
        this.velocity_limit = random(OPTIONS["velocity limit minimum"], OPTIONS["velocity limit maximum"]);
        this.start = this.clone();
        this.alive = true;
        this.color = "#" + random_hex();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += this.way === V2.UP ? -0.01 : 0.02;
        if (this.start.y - this.y > this.velocity_limit && this.way === V2.UP) {
            this.way = V2.DOWN;
        }
        if (this.y > this.canvas.height) this.kill();
    }

    kill() {
        this.alive = false;
    }
}

/*** @type {Particle[]} */
const particles = [];
setInterval(() => {
    /*** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.filter(i => i.alive).forEach(particle => {
        particle.update();
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });
});
const action = ev => {
    const rand = random(OPTIONS["minimum particles per move"], OPTIONS["maximum particles per move"]);
    for (let i = 0; i < rand; i++) {
        const particle = new Particle(ev.offsetX, ev.offsetY, canvas);
        particles.push(particle);
    }
}
canvas.addEventListener("mousemove", action);
canvas.addEventListener("click", action);