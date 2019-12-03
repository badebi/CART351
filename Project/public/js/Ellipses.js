class Ellipses {
  constructor(_eCol, _eRow) {
    this.eCol = _eCol;
    this.eRow = _eRow;
    this.x = this.eCol * videoScale;
    this.y = this.eRow * videoScale;
    this.loc = 0;
    this.c = [];
    this.bright = 0.00;
    this.sz = 0.00;
  }

  update() {

    // Reversing x to mirror the image
    // In order to mirror the image, the column is reversed with the following formula:
    // mirrored column = width - i - 1
    //this.loc = (video.width - this.eCol + 1) + (this.eRow * video.width) * 4;
    this.loc = this.eCol + (this.eRow * video.width) * 4;

    // Each rect is colored white with a size determined by brightness
    //this.c = video.pixels[this.loc];

    this.c[0] = video.pixels[this.loc + 0];
    this.c[1] = video.pixels[this.loc + 1];
    this.c[2] = video.pixels[this.loc + 2];
    //console.log(`${this.c[0]}, ${this.c[1]}, ${this.c[2]}`);
    this.bright = (this.c[0] + this.c[1] + this.c[2]) / 3;



    // A rectangle size is calculated as a function of the pixel's brightness.
    // A bright pixel is a large rectangle, and a dark pixel is a small one.

    //CHANGED I added noise() here so the ellipses move back and forth and it's no longer
    //directly related to the brightness level
    //I also changed the way it maps for the better look : (brightness(c)/255) * videoScale -> (brightness(c)/200) * videoScale
    this.sz = map(noise(xoff * 4, yoff + 5, zoff), 0, 1, 0, (this.bright / 200) * videoScale);
  }

  display() {
    // use pushMatrix() and translate() to change (simplify) our drawing origin
    push();

    let z = map(this.bright, 0, 200, -100, 100);
    translate(this.eCol + (videoScale / 2), this.y + (videoScale / 2), z);

    // set fill and stroke
    fill(10, 42, this.bright);

    noStroke();

    // use rectMode CENTER & rect to draw
    //ellipseMode(CENTER);
    normalMaterial();
    sphere(this.sz);
    //ellipse(0, 0, this.sz, this.sz);

    // popMatrix() to reset our drawing origin to (0, 0)
    pop();
  }
}
