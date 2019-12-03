let lookForFacialResponse = false;
let counter = 0;
let sum = 0;

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

        // console.log(data);
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

          setTimeout(getFacialResponse, 3000);

          function getFacialResponse() {

            lookForFacialResponse = true;

            setTimeout(function() {
              lookForFacialResponse = false;
              console.log(`counter: ${counter}, Sum: ${sum}, Average: ${sum/counter}`);
              let average = sum/counter;
              sum = 0;
              counter = 0;

              const packet = {
                id: socketId,
                data: data.data,
                response: average.toFixed(3)
              };
              console.log(packet);
              clientSocket.emit('facialResponse', packet);
              console.log("send response");

            }, 4000);

          } // getFacialResponse()

        // console.log("other stuff");
      });
      //___________________________________________________


    }); // clientSocket.on('joinedClientId')
  }); // clientSocket.on('connect')
}); // $(document).ready()

async function onPlay() {

  const videoEl = $('#video').get(0);


  if (videoEl.paused || videoEl.ended || !faceDetectionModelsAreLoaded) {
    return setTimeout(() => onPlay());
  }

  // ___________________________________________________
  // tiny_face_detector options
  let inputSize = 224;
  let scoreThreshold = 0.5;
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
    // faceapi.draw.drawDetections(canvas, resizedResult);
    // }
    // faceapi.draw.drawFaceLandmarks(canvas, resizedResult);

    // const minProbability = 0.05;
    // faceapi.draw.drawFaceExpressions(canvas, resizedResult, minProbability);


    // actually extractFaces is meant to extract face regions from bounding boxes
    // but you can also use it to extract any other region
    // console.log(result.alignedRect.box);
    const face = await faceapi.extractFaces(videoEl, [result.alignedRect.box]);


    // Display the face
    $('#face').empty();
    $('#face').append(face);



    if (lookForFacialResponse) {
      //console.log(result.expressions.happy);
      console.log("Started looking");
      counter ++;
      sum += result.expressions.happy;

      // setTimeout(function() {
      //   let packet = {
      //     id: socketId,
      //     data: data.data,
      //     response: result.expressions.happy.toFixed(2)
      //   };
      //   clientSocket.emit('facialResponse', packet);
      //   console.log("send response");
      //
      // }, 5000);
      // lookForFacialResponse = false;
    }

    // TODO: GET THE EXPRESSION
    // if happy => emit 1 ... if not emit 0

    // console.log(result.expressions.happy);
    // console.log(result);

    // TODO: Add extractFaces

    // TODO: get different landmarks
    // result.landmarks.position[]
    // https://github.com/justadudewhohacks/face-api.js#retrieve-the-face-landmark-points-and-contours

    // https://github.com/justadudewhohacks/face-api.js/issues/180

  }; // if(result)

  setTimeout(() => onPlay());
  // setTimeout(() => requestAnimationFrame(onPlay));

  //console.log("onplay");
}; // onPlay()

async function run() {
  // await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  // await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  // await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

  await faceapi.loadTinyFaceDetectorModel('/models');
  await faceapi.loadFaceLandmarkModel('/models');
  await faceapi.loadFaceRecognitionModel('/models');
  await faceapi.loadFaceExpressionModel('/models');


  // console.log(faceapi.nets.faceLandmark68Net);
  // console.log(faceapi.nets.faceRecognitionNet);
  // console.log(faceapi.nets.tinyFaceDetector);
  // console.log(faceapi.nets.faceExpressionNet);


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

  videoEl.addEventListener('loadedmetadata', (event) => {
    onPlay();
  });
}; // run()
