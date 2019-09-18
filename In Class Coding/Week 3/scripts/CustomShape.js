function CustomShape(x, y, w, h, r, g, b, a, context, canvas, speedX, speedY) {
  // Member properties
  this.canvas = canvas;
  this.context = context;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;

  this.innerW = this.w / 2;
  this.innerH = this.h / 2;

  this.innerX = this.x + this.innerW / 2;
  this.innerY = this.y + this.innerH / 2;

  this.speedX = speedX;
  this.speedY = speedY;

  this.display = function () {

    this.context.fillStyle = `rgba(${this.r},${this.g},${this.b},${this.a})`;

    this.context.fillRect(this.x, this.y, this.w, this.h);
    this.context.clearRect(this.innerX, this.innerY, this.innerW, this.innerH);
  }

  this.update = function () {
    if ((this.x + this.w) > this.canvas.width || this.x < 0) {
      this.speedX *= -1;
    }
    if ((this.y + this.h) > this.canvas.height || this.y < 0) {
      this.speedY *= -1;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    this.innerX += this.speedX;
    this.innerY += this.speedY;


  }

}
