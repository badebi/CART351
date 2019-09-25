window.onload = function() {

  let mouseIn = 'none'; // this variable will keep track of when and if the mouse is within one of the canvas(es)

  // this event handler will register in which box is the mouse
  function mouseoverhandler(event) {
    mouseIn = event.target.id;
    //console.log("the mouse is over canvas:: " + mouseIn);
  }
  // this event handler will register that the mouse is no longer over a particular box
  function mouseouthandler(event) {
    //console.log("the mouse is no longer over canvas:: " + event.target.id);
    mouseIn = 'none';
  }

  /* STEP 1:
  /* THis is showing you how to access the canvas associated with the first box
  It also shows you how to access the associated drawing context
  and adding the relevent event listeners. You can follow this code for
  accessing the other canvases and their associated contexts.
  */

  let canvasAniA = document.getElementById("canvasAniA")
  //get the context
  let contextA = canvasAniA.getContext("2d");

  // register event listeners with 1st box
  canvasAniA.addEventListener('mousemove', mouseoverhandler);
  canvasAniA.addEventListener('mouseout', mouseouthandler);

  let canvasAniB = document.getElementById("canvasAniB")
  let contextB = canvasAniB.getContext("2d");

  // register event listeners with 2nd box
  canvasAniB.addEventListener('mousemove', mouseoverhandler);
  canvasAniB.addEventListener('mouseout', mouseouthandler);

  let canvasAniC = document.getElementById("canvasAniC")
  let contextC = canvasAniC.getContext("2d");

  // register event listeners with 3rd box
  canvasAniC.addEventListener('mousemove', mouseoverhandler);
  canvasAniC.addEventListener('mouseout', mouseouthandler);


  /*** The lists of objects that will be indide each canvas **/
  let rectList = []; // variable to hold your list of rectangles
  let ellipsesList = []; //variable to hold your list of ellipses
  let freeShapeList = []; //variable to hold your list of free shapes

  /* STEP 2:: CREATE 10 RectShapeObject instances and put into the rectList */
  /* STEP 3:: CREATE 10 EllipseShapeObject instances and put into the ellipsesList */
  /* STEP 4:: CREATE 10 FreeShapeObject instances and put into the freeShapeList */
  /* STEP 5:: implement the display and update methods for each shape
  (RectShapeObject,EllipseShapeObject,FreeShapeObject)
  using the Object definitions I have given you as a starting point.
  The animation and design of your shape(s) is up to you */

  for (var i = 0; i < 10; i++) {
    rectList.push(new RectShapeObject(Math.floor(canvasAniA.width / (i * 3)), Math.floor(canvasAniA.height / (i * 7)), Math.floor(canvasAniA.width / 10) + Math.floor(Math.random() * 10), Math.floor(canvasAniA.height / 10) + Math.floor(Math.random() * 10), contextA, canvasAniA));
    ellipsesList.push(new EllipseShapeObject(Math.floor(canvasAniB.width / (i * 7)), Math.floor(canvasAniB.height / (i * 11)), Math.floor(canvasAniB.width / 10) + Math.floor(Math.random() * 5), Math.floor(canvasAniB.height / 10) + Math.floor(Math.random() * 5), contextB, canvasAniB));
    freeShapeList.push(new FreeShapeObject(Math.floor(canvasAniC.width * Math.random()), Math.floor(canvasAniC.height / (i * 3)), Math.floor(canvasAniC.width / 10) + Math.floor(Math.random() * 15), contextC, canvasAniC));
  };

  /**** ANIMATION CODE *****************/
  requestAnimationFrame(animationLoop);
  /*MAIN ANIMATION LOOP */
  function animationLoop() {

    contextA.clearRect(0, 0, canvasAniA.width, canvasAniA.height);
    contextB.clearRect(0, 0, canvasAniB.width, canvasAniB.height);
    contextC.clearRect(0, 0, canvasAniC.width, canvasAniC.height);
    
    if (mouseIn === "canvasAniA") {
      console.log("over canvas A");
      // put code here to display and update contents in canvasAniA
      /* STEP 6:: go through the rectList  and display and update shapes  */

      for (var i = 0; i < rectList.length; i++) {
        rectList[i].display();
        rectList[i].update();
      };

    } else if (mouseIn === "canvasAniB") {
      console.log("over canvas B");
      // put code here to display and update contents in canvasAniB
      /* STEP 7:: go through the ellipsesList  and display and update shapes  */

      for (var i = 0; i < ellipsesList.length; i++) {
        ellipsesList[i].display();
        ellipsesList[i].update();
      };

    } else if (mouseIn === "canvasAniC") {
      console.log("over canvas C");
      // put code here to display and update contents in canvasAniC
      /* STEP 8:: go through the freeShapeList  and display and update shapes  */

      for (var i = 0; i < freeShapeList.length; i++) {
        freeShapeList[i].display();
        freeShapeList[i].update();
      };

    }
    requestAnimationFrame(animationLoop);
  }

  /***** OBJECT DEFINITIONS  ***********************/
  /* OBJECT DEFINITION FOR A SQUARE OBJECT SHAPE
  constructor takes an initial xpos, ypos, width and height for the shape.
  You also need to give the context and canvas associated
  with the potential instance of this shape
  */


  function RectShapeObject(x, y, w, h, context, canvas) {
    this.context = context;
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speedX = 1 + Math.floor(Math.random() * 5);
    this.speedY = 1 + Math.floor(Math.random() * 7);
    // method to display - needs to be filled in
    this.display = function() {
      this.context.strokeStyle = `#3e181b`;
      this.context.strokeRect(this.x, this.y, this.w, this.h);
      this.context.lineWidth = "3";
    }
    // method to update (animation) - needs to be filled in
    this.update = function() {
      if ((this.x + this.w) > this.canvas.width || this.x < 0) {
        this.speedX *= -1;
      }
      if ((this.y + this.h) > this.canvas.height || this.y < 0) {
        this.speedY *= -1;
      }

      this.x += this.speedX;
      this.y += this.speedY;
    }


  }

  /* OBJECT DEFINITION FOR An Ellipse OBJECT SHAPE
  constructor takes an initial xpos, ypos, width and height for the shape.
  You also need to give the context and canvas associated
  with the potential instance of this shape
  */
  function EllipseShapeObject(x, y, w, h, context, canvas) {
    this.context = context;
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speedX = 1 + Math.floor(Math.random() * 5);
    this.speedY = 1 + Math.floor(Math.random() * 7);
    // method to display - needs to be filled in
    this.display = function() {
      this.context.strokeStyle = `#422018`;
      this.context.beginPath();
      this.context.ellipse(this.x, this.y, this.w, this.h, Math.PI / 4, 0, 2 * Math.PI);
      this.context.stroke();
      this.context.lineWidth = "3";
    }
    // method to update (animation) - needs to be filled in
    this.update = function() {
      this.x = Math.floor(Math.random() * this.canvas.width);
      this.y = Math.floor(Math.random() * this.canvas.height);
    }


  }
  /* OBJECT DEFINITION FOR A Free OBJECT SHAPE
  constructor takes an initial xpos, ypos, width and height for the shape.
  You also need to give the context and canvas associated
  with the potential instance of this shape
  */
  function FreeShapeObject(x, y, l, context, canvas) {
    this.context = context;
    this.canvas = canvas;
    this.lineLength = l;
    this.x1 = x;
    this.y1 = y;
    this.x2 = this.x1 + this.lineLength;
    this.y2 = this.y1;
    this.x3 = this.x1 + this.lineLength / 2;
    this.y3 = this.y1 - this.lineLength;
    this.speedY = 1 + Math.floor(Math.random() * 15);

    // method to display - needs to be filled in
    this.display = function() {

      this.context.strokeStyle = "#45391b";
      // Draw a triangle
      this.context.beginPath();
      // move the cursur there
      this.context.moveTo(this.x1, this.y1);
      this.context.lineTo(this.x2, this.y2);
      this.context.lineTo(this.x3, this.y3);
      this.context.lineTo(this.x1, this.y1);
      //this.context.fill();
      this.context.lineWidth = 2;
      this.context.stroke();
      this.context.closePath();
      this.context.lineWidth = "3";

    }
    // method to update (animation) - needs to be filled in
    this.update = function() {
      if (this.y3 > this.canvas.height || this.y1 < 0) {
        this.speedY *= -1;
      }

      this.y1 += this.speedY;
      this.y2 += this.speedY;
      this.y3 += this.speedY;
    }
  }


} //on load
