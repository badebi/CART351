window.onload = function() {


  // get the canvas
  let canvas = document.getElementById("testCanvas");

  //get the context
  let context = canvas.getContext("2d");

  canvas.addEventListener("mousedown", (event) => {
    console.log("mouse is in canvas");

    // console.log(event.clientX);
    // console.log(event.clientY);

    // gives us interesting shit
    let domRect = canvas.getBoundingClientRect();

    let offsetX = event.clientX - domRect.x;
    let offsetY = event.clientY - domRect.y;

    console.log(offsetX);
    console.log(offsetY);

    for (var i = 0; i < shapeList.length; i++) {
      shapeList[i].hitTest(offsetX, offsetY);
    };


  });



  //declare an array of shapes
  let shapeList = [];
  //declare the number of shapes we want
  const NUM_SHAPES = 5;
  //fill the array with shapes
  for (let i = 0; i < NUM_SHAPES; i++) {
    let r = (Math.floor((Math.random() * 255) + 1));
    let g = (Math.floor((Math.random() * 255) + 1));
    let b = (Math.floor((Math.random() * 255) + 1));
    let boxSize = 50;
    let marginBoxesScalar = 1.1; //scalar for between the boxes
    //start at i+1 so that is not mergin left 0
    shapeList.push(new CustomShape(((i + 1) * boxSize * marginBoxesScalar), canvas.height / 2, boxSize, boxSize, r, g, b, 1.0, (i % 5) + 1, (i % 6) + 2, i, context, canvas));
  }


  requestAnimationFrame(run);

  //our run method
  function run() {

    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < NUM_SHAPES; i++) {

      shapeList[i].display();
      //shapeList[i].update();
    }

    //recursive call
    requestAnimationFrame(run);

  }

}
