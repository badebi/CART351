$(document).ready(function() {
  let clientSocket = io.connect('http://localhost:4200');
  console.log("ready");
  let faceDetectionModelsAreLoaded = false;

  clientSocket.on('connect', function(data) {
    console.log("connected");
    clientSocket.emit('join', 'msg:: client joined');
    clientSocket.on('joinedClientId', function(data) {

      socketId = data;
      console.log(`my ID: ${socketId}`);

      run();

      //___________________________________________________ TEXT ___________________________________________________
      /** typing **/
      $("#sub").click(function() {

        let data = $("#message").val();

        console.log(data);
        let toSend = {
          id: socketId,
          data: data
        };
        clientSocket.emit('textChat', toSend);
        $("#message").val('');
      });

      clientSocket.on("dataFromServerToChat", function(incomingData) {
        console.log(incomingData.data);
        let liitem = $("<li>");
        liitem.text("ID: " + incomingData.id + " => " + incomingData.data);
        $("#chatList").append(liitem);
      });
      //___________________________________________________

      //___________________________________________________ Hearing the joke ___________________________________________________
      clientSocket.on('jokeFromServer', function(data) {
        console.log("got the joke from server");
        // if there is a radical change in the amount of happiness in a sicific amout of time -> emit 1
        if (true /*CONDITION*/ ) {
          let packet = {
            id: socketId,
            data: data.data,
            response: 0
          };
          //
          setTimeout(function() {
            clientSocket.emit('facialResponse', packet);
            console.log("send response");

          }, 10000);
        }
        console.log("other stuff");
      });
      //___________________________________________________


      async function onPlay() {

        const videoEl = $('#video').get(0);


        if (videoEl.paused || videoEl.ended || !faceDetectionModelsAreLoaded) {
          return setTimeout(() => onPlay());
        }

        // ___________________________________________________
        // tiny_face_detector options
        let inputSize = 512
        let scoreThreshold = 0.5
        const options = new faceapi.TinyFaceDetectorOptions(inputSize, scoreThreshold);
        // ___________________________________________________


        const result = await faceapi.detectSingleFace(videoEl, options).withFaceLandmarks().withFaceExpressions();

        if (result) {
          const canvas = $('#overlay').get(0);

          const displaySize = {
            width: videoEl.width,
            height: videoEl.height
          };
          const dim = faceapi.matchDimensions(canvas, displaySize);
          const resizedResult = faceapi.resizeResults(result, dim);

          // if (withBoxes) {
          faceapi.draw.drawDetections(canvas, resizedResult);
          // }
          faceapi.draw.drawFaceLandmarks(canvas, resizedResult);

          const minProbability = 0.05;
          faceapi.draw.drawFaceExpressions(canvas, resizedResult, minProbability);

          // TODO: GET THE EXPRESSION
          // if happy => emit 1 ... if not emit 0
          // console.log(result.expressions.happy);
          // console.log(result);

          // TODO: Add extractFaces

          // TODO: get different landmarks
          // result.landmarks.position[]
          // https://github.com/justadudewhohacks/face-api.js#retrieve-the-face-landmark-points-and-contours

          // https://github.com/justadudewhohacks/face-api.js/issues/180
        };

        setTimeout(() => onPlay());

        //console.log("onplay");
      }; // onPlay()

    }); // clientSocket.on('joinedClientId')
  }); // clientSocket.on('connect')
}); // $(document).ready()



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

}; // run()
