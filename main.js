/**@type{HTMLCanvasElement} */

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Particle {
    constructor(effect, x, y, color) {
      this.angle = 0;
      this.effect = effect;
      this.x = Math.random() * this.effect.width * Math.cos(this.angle);
      this.y = Math.random() * this.effect.height + Math.sin(this.angle);
      this.originX = Math.floor(x);
      this.originY = Math.floor(y);
      this.color = color;
      this.size = this.effect.gap;
      this.vX = 0;
      this.vY = 0;
      this.ease = 0.01;
    }
    draw(context) {
      ctx.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
      this.x += (this.originX - this.x) * this.ease;
      this.y += (this.originY - this.y) * this.ease;
      this.ease = 0.05;
      this.angle += 10;
    }
    warp() {
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.ease = 0.05;
    }
  }

  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particleArray = [];
      this.vickyImg = document.getElementById("vickyImg");
      this.centreX = this.width * 0.5;
      this.centreY = this.height * 0.5;
      this.x = this.centreX - this.vickyImg.width * 0.5;
      this.y = this.centreY - this.vickyImg.height * 0.5;
      this.gap = 5;
    }
    init(context) {
      context.drawImage(vickyImg, this.x, this.y);
      const pixels = context.getImageData(0, 0, this.width, this.height).data;
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const index = (y * this.width + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3];
          const color = "rgba(" + red + ", " + green + ", " + blue + ")";
          if (alpha > 0) {
            this.particleArray.push(new Particle(this, x, y, color));
          }
        }
      }
    }
    draw(context) {
      this.particleArray.forEach((particle) => particle.draw(context));
    }
    update() {
      this.particleArray.forEach((particle) => particle.update());
    }
    warp() {
      this.particleArray.forEach((particle) => particle.warp());
    }
  }

  const effect = new Effect(canvas.width, canvas.height);
  effect.init(ctx);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(ctx);
    effect.update();
    requestAnimationFrame(animate);
  }
  animate();

  const warpBtn = document.getElementById("warpBtn");
  warpBtn.addEventListener("click", function () {
    effect.warp();
  });
  //load end
});
