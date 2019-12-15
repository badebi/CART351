// ===============================================================================
// public variables
// ===============================================================================
let lookForFacialResponse = false; // to see when to observe
let counter = 0;
let sum = 0;
let readyToLook = false;
let result = null; // keeps the result of the face detection
let videoEl; // keeps the video element


$(document).ready(function() {
  // let clientSocket = io.connect('http://localhost:4200');
  console.log("ready");
  let clientSocket = io();
  let faceDetectionModelsAreLoaded = false;

  // =============================================================================
  // ++++++++++++++++++++++ clientSocket.on('connect') +++++++++++++++++++++++++++
  // client/server handshake and fired upon connecting to server
  // everything between server and clients happens here
  // =============================================================================
  clientSocket.on('connect', function(data) {
    console.log("connected");
    clientSocket.emit('join', 'msg:: client joined');

    // ---------------------------------------------------------------------------
    // +++++++++++++++++ clientSocket.on('joinedClientId') +++++++++++++++++++++++
    // when a client gets 'connect' message from server, client emits 'join'
    // then server emits 'joinedClientId', and when client receives that,
    // everything on client side starts happening
    // ---------------------------------------------------------------------------
    clientSocket.on('joinedClientId', function(data) {
      socketId = data;
      console.log(`my ID: ${socketId}`);
      // load faceAPI models and get the webcam feed
      run();

      // =========================================================================
      // ---------------------------- async run() --------------------------------
      // called -> on('joinedClientId') once
      // it sets up everything needed for faceAPI library and loads its models
      // faceAPI API -> https://github.com/justadudewhohacks/face-api.js
      // gets the video element and starts streaming it
      // =========================================================================
      async function run() {
        // load faceAPI models
        await faceapi.loadTinyFaceDetectorModel('/models');
        await faceapi.loadFaceLandmarkModel('/models');
        await faceapi.loadFaceRecognitionModel('/models');
        await faceapi.loadFaceExpressionModel('/models');
        // if all models are loaded, turn faceDetectionModelsAreLoaded true
        if (faceapi.nets.faceLandmark68Net.isLoaded && faceapi.nets.faceRecognitionNet.isLoaded
          && faceapi.nets.tinyFaceDetector.isLoaded && faceapi.nets.faceExpressionNet.isLoaded) {
          console.log("isLoaded");
          faceDetectionModelsAreLoaded = true;
        } // if()
        // check if we are in secure context
        if (!window.isSecureContext) {
          console.log("connection is not secured");
        }
        // try and promise to access users webcam and stream the images to the video element
        const videoEl = $('#video').get(0);
        navigator.mediaDevices.getUserMedia({
            video: {}
          })
          .then(
            (stream) => {
              console.log("have video");
              videoEl.srcObject = stream;
            })
          .catch(function(err) {
            console.log("have no video");
          });
        // when the video is loaded and ready to go, call onPlay to start face detection
        videoEl.addEventListener('loadedmetadata', (event) => {
          onPlay();
        });
      }; // run()

      // =========================================================================
      // -------------------------- async onPlay() -------------------------------
      // called -> async run() once when video is ready + in every frame by itself
      //
      // =========================================================================
      async function onPlay() {
        // readyToLook = false;
        videoEl = $('#video').get(0);
        // in folowing conditions, don't continue and try again
        if (videoEl.paused || videoEl.ended || !faceDetectionModelsAreLoaded) {
          return setTimeout(() => onPlay());
        }

        // tiny_face_detector options
        // size at which image is processed, the smaller the faster,
        // but less precise in detecting smaller faces, must be divisible
        // by 32, common sizes are 128, 160, 224, 320, 416, 512, 608,
        // for face tracking via webcam I would recommend using smaller sizes,
        // e.g. 128, 160, for detecting smaller faces use larger sizes, e.g. 512, 608
        // default: 416
        let inputSize = 224;
        // minimum confidence threshold
        // default: 0.5
        let scoreThreshold = 0.5;
        // create an instance of faceAPI neural net
        const options = new faceapi.TinyFaceDetectorOptions(inputSize, scoreThreshold);
        // detect the face with the highest confidence score in an image, with face landmarks and expressions
        result = await faceapi.detectSingleFace(videoEl, options).withFaceLandmarks().withFaceExpressions();

        // if a face is detected, do thse things
        if (result) {
          readyToLook = true;
          const canvas = $('#overlay').get(0);

          const displaySize = {
            width: videoEl.width,
            height: videoEl.height
          };
          const dim = faceapi.matchDimensions(canvas, displaySize);
          const resizedResult = faceapi.resizeResults(result, dim);


          // faceapi.draw.drawDetections(canvas, resizedResult);
          // faceapi.draw.drawFaceLandmarks(canvas, resizedResult);
          // const minProbability = 0.05;
          // faceapi.draw.drawFaceExpressions(canvas, resizedResult, minProbability);
          // const face = await faceapi.extractFaces(videoEl, [result.alignedRect.box]);

          // actually extractFaces is meant to extract face regions from bounding boxes
          // but you can also use it to extract any other region
          // $('#face').empty();
          // $('#face').append(face);

          // READY TO EXTRACT PARTS AND SEND IT TO SERVER

          if (lookForFacialResponse) {
            //console.log(result.expressions.happy);
            console.log("Started looking");
            counter++;
            sum += result.expressions.happy;

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

        // setTimeout(() => onPlay());
        requestAnimationFrame(onPlay);
        // setTimeout(() => requestAnimationFrame(onPlay));

      }; // onPlay()

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

      //___________________________________________________

      //___________________________________________________ Hearing the joke ___________________________________________________
      clientSocket.on('jokeFromServer', function(data) {

        // show
        console.log(data.data);
        let liitem = $("<li>");
        liitem.text("ID: " + data.id + " => " + data.data);
        $("#chatList").append(liitem);

        console.log("got the joke from server");
        // if there is a radical change in the amount of happiness in a sicific amout of time -> emit 1

        setTimeout(getFacialResponse, 3000);

        function getFacialResponse() {

          lookForFacialResponse = true;

          setTimeout(function() {
            lookForFacialResponse = false;
            console.log(`counter: ${counter}, Sum: ${sum}, Average: ${sum/counter}`);
            let average = sum / counter;
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

      }); // clientSocket.on('jokeFromServer')

      // ___________________________________________________ >>> areYouReady <<<
      clientSocket.on('areYouReady', function(data) {
        if (readyToLook) {
          console.log("yes");

          clientSocket.emit('readyToSendParts', 'client asks for furthur instructions from server');
        }
      });
      // ___________________________________________________ <<<<>>>

      // ___________________________________________________ >>> partRequest <<<
      clientSocket.on('partRequest', async (key) => {

        // console.log("p");
        // const requestedParts = [];

        if (key === 'mouth') {
          getMouth();
          // requestedParts.push(getMouth());

        }

        if (key === 'nose') {
          getNose();
          // requestedParts.push(getNose());

        }

        if (key === 'leftEye') {
          getLeftEye();
          // requestedParts.push(getLeftEye());
        }

        if (key === 'rightEye') {
          getRightEye();
          // requestedParts.push(getRightEye());
        }

        // Trying to use promisall

        // promise.all([])


        // let exPart = extractRandomPart(requestedPart);
        // const extractedPart = await faceapi.extractFaces(videoEl, exPart);
        //   $('#otherParts').empty();
        //   $('#otherParts').append(extractedPart);
        // console.log("part");

      });
      // ___________________________________________________ <<<<>>>>

      // ___________________________________________________ >>>> Get the parts <<<<
      async function getMouth() {
        if (result != null) {
          const exPart = extractRandomPart(result.landmarks.getMouth(), 15);
          const extractedPart = await faceapi.extractFaces(videoEl, exPart.region);
          const displayableMouth = extractedPart[0].toDataURL("image/jpg", 0.1);
          clientSocket.emit('gotMouth', displayableMouth);
          document.getElementById('mouthImg').src = displayableMouth;
        }
      }

      async function getNose() {
        if (result != null) {
          const exPart = extractRandomPart(result.landmarks.getNose(), 15);
          const extractedPart = await faceapi.extractFaces(videoEl, exPart.region);
          const displayableNose = extractedPart[0].toDataURL("image/jpeg", 0.1);
          clientSocket.emit('gotNose', displayableNose);
          document.getElementById('noseImg').src = displayableNose;
        }
        // $('#noseInnerDiv').empty();
        // $('#noseInnerDiv').append(extractedPart);
      }

      async function getLeftEye() {
        if (result != null) {
          const exPart = extractRandomPart(result.landmarks.getLeftEye(), 15);
          const extractedPart = await faceapi.extractFaces(videoEl, exPart.region);
          const displayableLeftEye = extractedPart[0].toDataURL("image/jpeg", 0.1);
          clientSocket.emit('gotLeftEye', displayableLeftEye);
          document.getElementById('leftEyeImg').src = displayableLeftEye;
        }




        // $('#leftEyeInnerDiv').empty();
        // $('#leftEyeInnerDiv').append(extractedPart);
      }

      async function getRightEye() {
        if (result != null) {
          const exPart = extractRandomPart(result.landmarks.getRightEye(), 15);
          const extractedPart = await faceapi.extractFaces(videoEl, exPart.region);
          const displayableRightEye = extractedPart[0].toDataURL("image/jpeg", 0.1);
          clientSocket.emit('gotRightEye', displayableRightEye);
          document.getElementById('rightEyeImg').src = displayableRightEye;
        }



        // $('#rightEyeInnerDiv').empty();
        // $('#rightEyeInnerDiv').append(extractedPart);
      }
      // ___________________________________________________ <<<<>>>>

      // ___________________________________________________ >>> display the parts <<<
      clientSocket.on("displayMouth", function(data) {
        $("#mouthImg").attr('src', data);
        // console.log("in displayMouth");
      });

      clientSocket.on("displayNose", function(data) {
        document.getElementById("noseImg").src = data;
        // console.log("is disNose");
        // console.log(data);
      });

      clientSocket.on("displayLeftEye", function(data) {
        document.getElementById("leftEyeImg").src = data;
        // console.log(data);
      });

      clientSocket.on("displayRightEye", function(data) {
        document.getElementById("rightEyeImg").src = data;
        // console.log(data);
      });
      // ___________________________________________________ <<<<>>>

      function extractRandomPart(partToExtract, MARGIN) {

        let part = {
          x: 10000,
          y: 10000,
          width: 0,
          height: 0
        };

        // let MARGIN = 15;

        // TODO: select randomly from the parts abouve

        // let partToExtract = _requestedPart;

        // get the box dimensions
        // console.log(partToExtract[0]);
        for (let i = 0; i < partToExtract.length; i++) {
          if (partToExtract[i].x < part.x) {
            part.x = partToExtract[i].x - MARGIN;
            // console.log(`x :: ${part.x}`);
          }
          if (partToExtract[i].y < part.y) {
            part.y = partToExtract[i].y - MARGIN;
            // console.log(`y :: ${part.y}`);

          }
          if (partToExtract[i].x > part.width) {
            part.width = partToExtract[i].x + MARGIN;
            // console.log(`width :: ${part.width}`);

          }

          if (partToExtract[i].y > part.height) {
            part.height = partToExtract[i].y + MARGIN;
            // console.log(`height :: ${part.height}`);

          }
        }

        part.width = part.width - part.x;
        part.height = part.height - part.y;

        const regionsToExtract = {
          region: [new faceapi.Rect(part.x, part.y, part.width, part.height)],
          width: part.width,
          height: part.height
        }

        // context.drawImage(videoEl, 0, 0, canvas.width / 2, canvas.height);

        // maybe put the pixleLoad stuff here

        return regionsToExtract;
      } // extractRandomPart()








    }); // clientSocket.on('joinedClientId')
  }); // clientSocket.on('connect')
}); // $(document).ready()
