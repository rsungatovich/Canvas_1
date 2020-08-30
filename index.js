const canvas = document.querySelector('canvas'),
      ctx = canvas.getContext('2d'),
      drops = [],
      mouseOs = {};

canvas.width = innerWidth - 20;
canvas.height = innerHeight;


class Drop {
  constructor ({ ctx, canvas, mouseOs }) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.mouseOs = mouseOs;
    this.trendX = null;
    this.trendY = null;
    this.speedSens = null;
    this.speedSensX = null;
    this.speedSensY = null;
    this.difference = null;
    this.differenceX = null;
    this.differenceY = null;
    this.isSensitive = false;
    this.speedX = Math.random() - 0.5;
    this.speedY = Math.random() - 0.5;
    this.sensitive = Math.random() * 500;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.ceil(Math.random() * 10);
    this.transparent = Math.ceil(Math.random() * 10) / 10;
    this.color = `rgb(255, 255, 255, ${ this.transparent })`
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

  _setDifference = () => {
    // вычисляем расстояние между курсором и элементом
    let defX = this.mouseOs.x - this.x;
    let defY = this.mouseOs.y - this.y;

    // преобразовываем расстояние в натуральное число
    this.differenceX = defX < 0 ? -defX : defX;
    this.differenceY = defY < 0 ? -defY : defY;

    // находим средний показатель расстояния
    this.difference = this.differenceX + this.differenceY / 2;

  }

  _setSensitive = () => {

    // проверяем попадает ли элемент в зону чувствительности
    if (this.difference < this.sensitive) {
        this.isSensitive = true;
      } else {
        this.isSensitive = false;
      }
  }

  _setDirection = () => {

    // задаем тренд направления элемента
    if (this.isSensitive) {
      
      this.trendX = this.mouseOs.x;
      this.trendY = this.mouseOs.y;

    } else {

      this.trendX = null;
      this.trendY = null;

    }
  }

  _transformElement = () => {

    // трансформируем элемент при приближении
    if (this.difference < this.r * 10) {
      this.r === 0 ? this.r : this.r -= 0.5;
      this.color = `rgb(255, 255, 255, ${this.transparent -= 0.05})`
    }
  }

  _reactionElement = () => {
    if (this.isSensitive) {
      // увеличимаем скорость по мере приближения элемента к курсору
      this.speedSens = 70 / this.difference;

      // если расстояни от X меньше чем от Y, уменьшаем скорость для X
      this.speedSensX = this.differenceX < this.differenceY 
      ? (this.differenceX / this.differenceY * this.speedSens) 
      : this.speedSens;

      // если расстояни от Y меньше чем от X, уменьшаем скорость для Y
      this.speedSensY = this.differenceY < this.differenceX 
      ? (this.differenceY / this.differenceX * this.speedSens) 
      : this.speedSens;
    }
  }

  _setActions = () => {

    this._reactionElement();
    this._transformElement();
      
  }

  _getMoved = () => {
    // изменение направления при достижении границ Y
    if (this.y > this.canvas.height - this.r || this.y < 0 + this.r) {
      this.speedY = -this.speedY;
    }
    
    // изменение направления при достижении границ X
    if (this.x > this.canvas.width - this.r || this.x < 0 + this.r) {
      this.speedX = -this.speedX;
    }

    // направление элемента к курсору
    if (this.trendX && this.trendY) {
      this.trendX < this.x ? 
      this.x -= this.speedSensX : this.x += this.speedSensX;
      this.trendY < this.y ? 
      this.y -= this.speedSensY : this.y += this.speedSensY;
    }

    // направление элемента по умолчанию
    if (!this.trendX && !this.trendY) {
      this.x += this.speedX;
      this.y += this.speedY;
    }
  }

  run = () => {
    this._setDifference();
    this._setSensitive();
    this._setDirection();
    this._setActions();

    this._getMoved();
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