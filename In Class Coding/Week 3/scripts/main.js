// one window.onload for a page is enough
// we need to ensure that we do thing only when the page is loaded
window.onload = function() {


  let canvas = document.getElementById("testCanvas");
  //choose what you are going to do with your canvas
  let context = canvas.getContext("2d");
  console.log(canvas);
  let shapeList = [];
  const MAX_SHAPE = 5;

  // First we need to tell js to look for the mouse on the canvas
  canvas.addEventListener('mousedown', (event) => {
    console.log("mouse in canvas");
    for (var i = 0; i < shapeList.length; i++) {
      shapeList[i].hitTest(event);
    }


  });



  for (var i = 0; i < MAX_SHAPE; i++) {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    shapeList.push(new CustomShape((i * 55), canvas.height / 2, 50, 50, r, b, g, 1.0, context, canvas,(i % 5) + 1, (i % 7) + 1));
  }

  //let cBox = new CustomShape(canvas.width / 2, canvas.height / 2, 50, 50, 255, 0, 0, 1.0, context, canvas);
  // synced with frameRate
  requestAnimationFrame(run);

  function run() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < shapeList.length; i++) {
      shapeList[i].display();
      //shapeList[i].update();
    }
    // cBox.display();
    // cBox.update();
    requestAnimationFrame(run);
  }

  /*

  // .fillStyle ---> fill color (default = black)
  context.fillStyle = "rgba(255,0,0,255)";
  context.strokeStyle = "rgba(255,0,0,255)";
  // .fillRect(x,y,xSize,ySize) ---> to draw a box
  // It starts drawing from the top left corner
  context.fillRect(canvas.width / 2, canvas.height / 2, 50, 50);
  //
  context.strokeRect(canvas.width / 2 + 50, canvas.height / 2 + 50, 50, 50);
  // .clearRect ---> To cut out a piece of the fillRect
  //context.clearRect(canvas.width / 2 + 12.5, canvas.height / 2 + 12.5, 25, 25);

  // Triangle parameters:
  // context.fillStyle = "#8ED6FF";
  context.strokeStyle = "#8ED6FF";
  let lineLength = 100;
  let x1 = canvas.width / 2;
  let y1 = canvas.height / 2;
  let x2 = x1 + lineLength;
  let y2 = canvas.height / 2;
  let x3 = x1 + lineLength / 2;
  let y3 = y1 - lineLength;

  // Draw a triangle
  context.beginPath();
  // move the cursur there
  context.moveTo(x1,y1);
  context.lineTo(x2,y2);
  context.lineTo(x3,y3);
  context.lineTo(x1,y1);
  //context.fill();
  context.lineWidth = 2;
  context.stroke();
  context.closePath();

  */

}
