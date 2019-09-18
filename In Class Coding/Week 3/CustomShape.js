function CustomShape(x, y, w, h, r, g, b, a, context) {
  // Member properties
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

  this.speedX = 1;
  this.speedY = 4;

  this.display = function () {

    this.context.fillStyle = `rgba(${this.r},${this.g},${this.b},${this.a})`;

    this.context.fillRect(this.x, this.y, this.w, this.h);
    this.context.clearRect(this.innerX, this.innerY, this.innerW, this.innerH);
  }
}
