$(document).ready(function() {

  console.log("ready");
  let faceDetectionModelsAreLoaded = false;

  run();
});

async function run() {
  // await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  // await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  // await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

  await faceapi.loadTinyFaceDetectorModel('/models');
  await faceapi.loadFaceLandmarkModel('/models');
  await faceapi.loadFaceRecognitionModel('/models');
  await faceapi.loadFaceExpressionModel('/models');


  console.log(faceapi.nets.faceLandmark68Net);
  console.log(faceapi.nets.faceRecognitionNet);
  console.log(faceapi.nets.tinyFaceDetector);
  console.log(faceapi.nets.faceExpressionNet);


  if (faceapi.nets.faceLandmark68Net.isLoaded && faceapi.nets.faceRecognitionNet.isLoaded && faceapi.nets.tinyFaceDetector.isLoaded && faceapi.nets.faceExpressionNet.isLoaded) {
    console.log("isLoaded");
    faceDetectionModelsAreLoaded = true;
  }

  // try to access users webcam and stream the images
  // to the video element
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {}
  });
  const videoEl = $('#video').get(0);
  videoEl.srcObject = stream;

}

async function onPlay() {

  const videoEl = $('#video').get(0);

  if (videoEl.paused || videoEl.ended || !faceDetectionModelsAreLoaded) {
    return setTimeout(() => onPlay());
  }

  // ___________________________________________________
  // tiny_face_detector options
  let inputSize = 512
  let scoreThreshold = 0.5
  const options = new faceapi.TinyFaceDetectorOptions();
  // ___________________________________________________


  const result = await faceapi.detectSingleFace(videoEl, options).withFaceLandmarks().withFaceExpressions();

  if (result) {
    const canvas = $('#overlay').get(0);

    const displaySize = {
      width: videoEl.width,
      height: videoEl.height
    };
    faceapi.matchDimensions(canvas, displaySize);
    const resizedResult = faceapi.resizeResults(result, displaySize);

    // if (withBoxes) {
    faceapi.draw.drawDetections(canvas, resizedResult);
    // }
    faceapi.draw.drawFaceLandmarks(canvas, resizedResult);

    const minProbability = 0.05;
    faceapi.draw.drawFaceExpressions(canvas, resizedResult, minProbability);



    // TODO: Add extractFaces

    // TODO: get different landmarks
    // https://github.com/justadudewhohacks/face-api.js#retrieve-the-face-landmark-points-and-contours

    // https://github.com/justadudewhohacks/face-api.js/issues/180
  };

  setTimeout(() => onPlay());

  console.log("onplay");
}
