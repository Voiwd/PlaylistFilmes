export class ConfettiParticle {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * -50;
    this.r = Math.random() * 6 + 2;
    this.dx = Math.random() * 2 - 1;
    this.dy = Math.random() * 3 + 2;
    this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
  }

  update() {
    this.x += this.dx;
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
    window.addEventListener('resize', () => this.setupCanvas());
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawn(count = 150) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(
        new ConfettiParticle(this.canvas.width, this.canvas.height)
      );
    }
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p) => {
      p.update();
      p.draw(this.ctx);
    });

    this.particles = this.particles.filter(
      (p) => !p.isOffScreen(this.canvas.height)
    );

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.particles = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
