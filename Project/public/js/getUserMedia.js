// window.onload = function() {
//   console.log("loaded");
//   let video = document.getElementById("video");
//
//   navigator.mediaDevices.getUserMedia({video: true})
//     .then(
//       //stream is what is returned
//       (stream) => {
//         video.srcObject = stream;
//       })
//     .catch(function(err) {
//       /* handle the error */
//       console.log("had an error getting the camera");
//     });
//
// };


window.onload = function() {
  console.log("loaded");
  let video = document.getElementById("video");
  let canvas = document.getElementById("overlay");
  let context = canvas.getContext('2d');


  navigator.mediaDevices.getUserMedia({
      video: {
        width: 320,
        height: 240
      }
    })
    .then(
      //stream is what is returned
      (stream) => {
        video.srcObject = stream;

      })
    .catch(function(err) {
      /* handle the error */
      console.log("had an error getting the camera");
    });

  /*** instead of using the video object we can use the canvas **/
  requestAnimationFrame(run);

  // function run() {
  //   context.clearRect(0, 0, canvas.width, canvas.height);
  //   context.drawImage(video, 0, 0, canvas.width / 2, canvas.height);
  //   //context.globalAlpha = ".01";
  //   context.fillStyle = "#FFFFFF";
  //   context.fillRect(canvas.width / 2 + 50, canvas.height / 2, 50, 50);
  //   requestAnimationFrame(run);
  // }

  function run() {
    //context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width / 2, canvas.height);
    context.fillStyle = "#FFFFFF";
    context.fillRect(canvas.width / 2 + 50, canvas.height / 2, 50, 50);

    // it loads the pixels
    let frame = context.getImageData(0, 0, canvas.width / 2, canvas.height);
    // every pixel has an r,g,b,a value ... and so in the array - every 4 values== 1 pixel
    for (let i = 0; i < frame.data.length; i += 4) {
      let r = frame.data[i];
      let g = frame.data[i + 1];
      let b = frame.data[i + 2];
      let a = frame.data[i + 3];
      frame.data[i] = r;
      frame.data[i + 1] = 0;
      frame.data[i + 2] = 0;
      // make every 32nd frame have an alpha of 0/
      if (i % 32 == 0) {
        frame.data[i + 3] = 0;
      }
    }
    // put your manipulations into the image
    context.putImageData(frame, 0, 0);
    //can draw on top ...
    context.fillRect(0, canvas.height / 2, 50, 50);

    requestAnimationFrame(run);
  }
};
