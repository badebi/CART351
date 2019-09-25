function CustomShape(x, y, w, h, r, g, b, a, speedX, speedY, rectID, theContext, theCanvas) {
  //member properties
  this.rectID = rectID;
  this.canvas = theCanvas;
  this.context = theContext; // NEW PASS THE CONTEXT
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
  //add in when we update
  this.speedX = speedX;
  this.speedY = speedY;
  this.innerX = this.x + this.innerW / 2;
  this.innerY = this.y + this.innerH / 2;

  this.isPressed = false;

  this.theta = 0.0;

  // NEW DISPLAY
  this.display = function() {

    if (this.isPressed) {
      this.a = 0;
    } else {
      this.a = 1;
    };

    //     //lets draw something
    this.col = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    this.context.fillStyle = this.col;

    // ---------------------------------------------------- rotating -----------------------
    // at this moment you would have said pushMatrix() in p5 ;
    this.context.save();
    this.context.translate(this.x + this.w / 2, this.y + this.h / 2);
    this.context.rotate(this.theta);
    this.theta += 0.1;

    //REMEMBER IS AT LEFT TOP
    this.context.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    //do same for inner
    //this.context.clearRect(this.innerX, this.innerY, this.innerW, this.innerH);

    // like popMatrix();
    this.context.restore();
    // ---------------------------------------------------------------------------------

  }


  //update
  this.update = function() {

    //edges bouncing specifically for a rect with corner coords.
    if (this.x > (this.canvas.width - this.w) || this.x < 0) {
      this.speedX *= -1;
    }
    if (this.y > (this.canvas.height - this.h) || this.y < 0) {
      this.speedY *= -1;
    }

    //change by speed ...
    this.x += this.speedX;
    this.y += this.speedY;
    //need to update the inner vars here ....
    this.innerX = this.x + this.innerW / 2;
    this.innerY = this.y + this.innerH / 2;
  }

  // NEW COLLISON CHECK
  this.hitTest = function(mx, my) {

    let cX = this.x + this.w / 2;
    let cY = this.y + this.h / 2;

    let d = Math.sqrt(Math.pow((mx - cX), 2) + Math.pow((my - cY), 2));

    if (d < this.w / 2) {

      this.isPressed = !this.isPressed;
      console.log(`rect ${this.rectID} has mouse down`);

    };


  }
}
