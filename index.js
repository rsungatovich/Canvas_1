const canvas = document.querySelector('canvas'),
      ctx = canvas.getContext('2d'),
      drops = [],
      mouseOs = {};

canvas.width = innerWidth - 20;
canvas.height = innerHeight;


class Drop {
  constructor ({ ctx, canvas, mouseOs }) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.ceil(Math.random() * 10);
    this.transparent = Math.ceil(Math.random() * 10) / 10;
    this.color = `rgb(255, 255, 255, ${ this.transparent })`
    this.ctx = ctx;
    this.canvas = canvas;
    this.mouseOs = mouseOs;
    this.speed = Math.random() - 0.5;
    this.speedSens = Math.random() * 0.5;
    this.speedSensX = this.speedSens;
    this.speedSensY = this.speedSens;
    this.sensitivityY = 300;
    this.sensitivityX = 300;
  }

  _create = () => {
    const grad = this.ctx.createRadialGradient(
      this.x, 
      this.y, 
      0, 
      this.x, 
      this.y, 
      this.r
    );
    grad.addColorStop(0, "white");
    grad.addColorStop(1, "#00000080");

    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    this.ctx.fill();
  }

  _initTransform = () => {

    if ((this.mouseOs.x - this.x < (this.r * 10) 
      && this.mouseOs.x - this.x > (-this.r * 10))
      && (this.mouseOs.y - this.y < (this.r * 10) 
      && this.mouseOs.y - this.y > (-this.r * 10))) {

      this.r === 0 ? this.r : this.r -= 0.5;
      this.color = `rgb(255, 255, 255, ${this.transparent -= 0.05})`

    }
  }

  _initCharacter = () => {
    if ((this.mouseOs.x - this.x < this.sensitivityX 
    && this.mouseOs.x - this.x > -this.sensitivityX)
    && (this.mouseOs.y - this.y < this.sensitivityY 
    && this.mouseOs.y - this.y > -this.sensitivityY)) {

      this.trandX = this.mouseOs.x;
      this.trandY = this.mouseOs.y;

      this.distanceX = (this.mouseOs.x - this.x) < 0 ? 
      -(this.mouseOs.x - this.x) : this.mouseOs.x - this.x;

      this.distanceY = (this.mouseOs.y - this.y) < 0 ? 
      -(this.mouseOs.y - this.y) : this.mouseOs.y - this.y;

      if (((this.distanceX + this.distanceY) / 2) > 10) {
        this.speedSens = (50 / ((this.distanceX + this.distanceY) / 2));

        this.speedSensX = this.distanceX < this.distanceY 
        ? (this.distanceX / this.distanceY * this.speedSens) 
        : this.speedSens;
  
        this.speedSensY = this.distanceY < this.distanceX 
        ? (this.distanceY / this.distanceX * this.speedSens) 
        : this.speedSens;
      } 

    } else {
      this.trandX = null;
      this.trandY = null;
    }
  }

  _initAction = () => {
    if (this.y > this.canvas.height - this.r || this.y < 0 + this.r) {
      this.speed = -this.speed;
    }

    if (this.x > this.canvas.width - this.r || this.x < 0 + this.r) {
      this.speed = -this.speed;
    }

    if (this.trandX && this.trandY) {
      this.trandX < this.x ? 
      this.x -= this.speedSensX : this.x += this.speedSensX;
      this.trandY < this.y ? 
      this.y -= this.speedSensY : this.y += this.speedSensY;
    }

    if (!this.trandX && !this.trandY) {
      this.x += this.speed;
      this.y += this.speed;
    }
  }

  run = () => {
    this._initTransform();
    this._initCharacter();
    this._initAction();

    this._create();
  }
}

const init = () => {
  for (let i = 0; i < 100; i++) {
    drops.push(new Drop ({ ctx, canvas, mouseOs }));
  }
}

init();

const run = () => {
  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < drops.length; i++) {
      drops[i].run();
    }
  }, 30)
}

run();

addEventListener('mousemove', (e) => {
  mouseOs.x = e.offsetX;
  mouseOs.y = e.offsetY;
})

addEventListener('mouseout', () => {
  mouseOs.x = null;
  mouseOs.y = null;
})