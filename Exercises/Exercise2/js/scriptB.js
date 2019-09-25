window.onload = function() {


  let mouseIn = 'none'; // this variable will keep track of when and if the mouse is within one of the canvas(es)

  // this event handler will register in which box is the mouse
  let mouseoverhandler = function(event) {
    mouseIn = event.target.id;
    console.log("the mouse is over canvas:: " + mouseIn);
  }
  // this event handler will register that the mouse is no longer over a particular box
  let mouseouthandler = function(event) {
    console.log("the mouse is no longer over canvas:: " + event.target.id);
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

  /**** ANIMATION CODE *****************/
  requestAnimationFrame(animationLoop);
  /*MAIN ANIMATION LOOP */
  function animationLoop() {

    if (mouseIn === "canvasAniA") {
      console.log("over canvas A");
      // put code here to display and update contents in canvasAniA
      /* STEP 6:: go through the rectList  and display and update shapes  */

    } else if (mouseIn === "canvasAniB") {
      console.log("over canvas B");
      // put code here to display and update contents in canvasAniB
      /* STEP 7:: go through the ellipsesList  and display and update shapes  */

    } else if (mouseIn === "canvasAniC") {
      console.log("over canvas C");
      // put code here to display and update contents in canvasAniC
      /* STEP 8:: go through the freeShapeList  and display and update shapes  */

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
    // method to display - needs to be filled in
    this.display = function() {

    }
    // method to update (animation) - needs to be filled in
    this.update = function() {

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
    // method to display - needs to be filled in
    this.display = function() {

    }
    // method to update (animation) - needs to be filled in
    this.update = function() {

    }


  }
  /* OBJECT DEFINITION FOR A Free OBJECT SHAPE
  constructor takes an initial xpos, ypos, width and height for the shape.
  You also need to give the context and canvas associated
  with the potential instance of this shape
  */
  function FreeShapeObject(x, y, w, h, context, canvas) {
    this.context = context;
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    // method to display - needs to be filled in
    this.display = function() {

    }
    // method to update (animation) - needs to be filled in
    this.update = function() {

    }
  }


} //on load
