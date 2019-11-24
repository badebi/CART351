//console.log(faceapi.nets);
window.onload = function() {
  console.log("loaded");
  console.log(faceapi.nets);
  const video = document.getElementById("video");


  // loading models ... async
  // await ??
  // how can I load the models from node envirenment?

  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ]).then(startVideo);



  function startVideo() {
    navigator.mediaDevices.getUserMedia({video: {}})
      .then(
        //stream is what is returned
        (stream) => {
          video.srcObject = stream;

        })
      .catch(function(err) {
        /* handle the error */
        console.log("had an error getting the camera");
      });
  };

  // video.addEventListener('play', () => {
  //   console.log("video is live");
  //
  //
  //   const canvas = faceapi.createCanvasFromMedia(video);
  //   document.body.append(canvas);
  //   const displaySize = { width: video.width, height: video.height};
  //   faceapi.matchDimensions(canvas, displaySize);
  //
  //   setInterval(async () => {
  //     const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
  //     const resizedDetections = faceapi.resizeResults(detections, displaySize);
  //     //canvas.getContext('2D').clearRect(0,0,video.width,video.height);
  //     faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  //   }, 100);
  // });

  video.addEventListener('play', detectFace);

  async function detectFace() {
    console.log("video is live");


    canvas = await faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height};
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      //canvas.getContext('2D').clearRect(0,0,video.width,video.height);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }, 100);
  }
}



// function startVideo() {
//   navigator.getUserMedia(
//     {video: {}},
//     stream => video.srcObject = stream,
//     err => console.error(err)
//   );
// }
