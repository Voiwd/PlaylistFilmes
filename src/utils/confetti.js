export class ConfettiParticle {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * -50;
    this.r = Math.random() * 6 + 2;
    this.dx = (Math.random() * 2 - 1) * 1.2;
    this.dy = Math.random() * 3 + 2;
    this.offset = Math.random() * Math.PI * 2;
    this.size = Math.random() * 2 + 1.5;
    this.hue = Math.floor(Math.random() * 360);
    this.saturation = Math.floor(70 + Math.random() * 25);
    this.lightness = Math.floor(45 + Math.random() * 20);
    this.color = `hsl(${this.hue} ${this.saturation}% ${this.lightness}%)`;
  }

  update() {
    this.x += this.dx + Math.sin(this.y / 20 + this.offset) * 0.03;
    this.y += this.dy;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }

  isOffScreen(canvasHeight) {
    return this.y > canvasHeight + 50;
  }
}

export class ConfettiSystem {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.setupCanvas();
    this.handleResize = () => this.setupCanvas();
    window.addEventListener('resize', this.handleResize);
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawn(count = 150) {
    this.stop();
    for (let index = 0; index < count; index += 1) {
      this.particles.push(new ConfettiParticle(this.canvas.width, this.canvas.height));
    }
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((particle) => {
      particle.update();
      particle.draw(this.ctx);
    });
    this.particles = this.particles.filter((particle) => !particle.isOffScreen(this.canvas.height));

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }

  stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.animationId = null;
    this.particles = [];
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
  }
}
