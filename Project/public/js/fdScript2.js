// ===============================================================================
// public variables
// ===============================================================================
let lookForFacialResponse = false; // to see when to observe
let counter = 0;
let sum = 0;
let isFaceDetected = false;
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
      // updates face detection result in realtime
      // observes and keeps record of user's happiness level as long as lookForFacialResponse === true
      // =========================================================================
      async function onPlay() {
        // isFaceDetected = false;
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

        // if a face is detected, do these stuff
        if (result) {
          isFaceDetected = true;
          const canvas = $('#overlay').get(0);
          // resize the face detection result
          const displaySize = {
            width: videoEl.width,
            height: videoEl.height
          };
          const dim = faceapi.matchDimensions(canvas, displaySize);
          const resizedResult = faceapi.resizeResults(result, dim);
          // if it is time to keep record of user's happiness, do it
          if (lookForFacialResponse) {
            console.log("Started looking");
            counter++;
            sum += result.expressions.happy;
          } // if()
        }; // if(result)
        // call onPlay for the next frame
        requestAnimationFrame(onPlay);
      }; // onPlay()

      // ------------------------------------------------------------------------- [UI]
      // +++++++++++++++++ clientSocket.on('areYouReady') ++++++++++++++++++++++++
      // fired every 500ms
      // it is the start of slient/server conversation to give the hybridFace parts to server
      // -------------------------------------------------------------------------
      clientSocket.on('areYouReady', function(data) {
        if (isFaceDetected) {
          console.log("yes");
          clientSocket.emit('readyToSendParts', 'client asks for furthur instructions from server');
        } // if()
      }); // clientSocket.on('areYouReady')

      // ------------------------------------------------------------------------- [UI]
      // +++++++++++++++++ clientSocket.on('partRequest') ++++++++++++++++++++++++
      // fired upon server's request for part(s)
      // checks what part server wants, it gets it and finally sends it (them) to server
      // -------------------------------------------------------------------------
      clientSocket.on('partRequest', async (key) => {
        if (key === 'mouth') { getMouth(); }
        if (key === 'nose') { getNose(); }
        if (key === 'leftEye') { getLeftEye(); }
        if (key === 'rightEye') { getRightEye(); }
      }); // clientSocket.on('partRequest')

      // ========================================================================= [UI]
      // ------------------------- async get[Part]() -----------------------------
      // called -> on('partRequest')
      // get the boundaries of the requested part by the help of face withFaceLandmarks
      // extracts the part from the video and converts it to an image dataURL
      // sends the part to server and displays in on its user browser
      // extractFaces: it is meant to extract face regions from bounding boxes
      // but you can also use it to extract any other region
      // =========================================================================
      async function getMouth() {
        if (result != null) {
          const exPart = extractSection(result.landmarks.getMouth(), 15);
          const extractedPart = await faceapi.extractFaces(videoEl, exPart.region);
          const displayableMouth = extractedPart[0].toDataURL("image/jpg", 0.1);
          clientSocket.emit('gotMouth', displayableMouth);
          document.getElementById('mouthImg').src = displayableMouth;
        } // if()
      } // getMouth()

      async function getNose() {
        if (result != null) {
          const exPart = extractSection(result.landmarks.getNose(), 15);
          const extractedPart = await faceapi.extractFaces(videoEl, exPart.region);
          const displayableNose = extractedPart[0].toDataURL("image/jpeg", 0.1);
          clientSocket.emit('gotNose', displayableNose);
          document.getElementById('noseImg').src = displayableNose;
        } // if()
      } // getNose()

      async function getLeftEye() {
        if (result != null) {
          const exPart = extractSection(result.landmarks.getLeftEye(), 15);
          const extractedPart = await faceapi.extractFaces(videoEl, exPart.region);
          const displayableLeftEye = extractedPart[0].toDataURL("image/jpeg", 0.1);
          clientSocket.emit('gotLeftEye', displayableLeftEye);
          document.getElementById('leftEyeImg').src = displayableLeftEye;
        } // if()
      } // getLeftEye()

      async function getRightEye() {
        if (result != null) {
          const exPart = extractSection(result.landmarks.getRightEye(), 15);
          const extractedPart = await faceapi.extractFaces(videoEl, exPart.region);
          const displayableRightEye = extractedPart[0].toDataURL("image/jpeg", 0.1);
          clientSocket.emit('gotRightEye', displayableRightEye);
          document.getElementById('rightEyeImg').src = displayableRightEye;
        } // if()
      } // getRightEye()

      // ========================================================================= [UI]
      // --------------- extractSection(partToExtract, MARGIN) -------------------
      // called -> getMouth()/getNose()/getLeftEye()/getRightEye()
      // gets the landmark coordinates of the part to extract, and founds its area
      // and returns x, y, width, height of the box containing it + margin
      // =========================================================================
      function extractSection(partToExtract, MARGIN) {
        let part = {
          x: 10000,
          y: 10000,
          width: 0,
          height: 0
        };

        // go through the landmarks and find the extreme left/right/top/down points and store them
        for (let i = 0; i < partToExtract.length; i++) {
          if (partToExtract[i].x < part.x) { part.x = partToExtract[i].x - MARGIN; }
          if (partToExtract[i].y < part.y) { part.y = partToExtract[i].y - MARGIN; }
          if (partToExtract[i].x > part.width) { part.width = partToExtract[i].x + MARGIN; }
          if (partToExtract[i].y > part.height) { part.height = partToExtract[i].y + MARGIN; }
        } // for()

        // calculare width and height
        part.width = part.width - part.x;
        part.height = part.height - part.y;

        // make an neat package
        const regionsToExtract = {
          region: [new faceapi.Rect(part.x, part.y, part.width, part.height)],
          width: part.width,
          height: part.height
        }
        // and return it
        return regionsToExtract;
      } // extractSection()

      // ------------------------------------------------------------------------- [UI]
      // ++++++++++++++++ clientSocket.on('display[Part]') +++++++++++++++++++++++
      // assigns the received dataURL of each part, to its corresponding image source attribute
      // -------------------------------------------------------------------------
      clientSocket.on("displayMouth", function(data) { $("#mouthImg").attr('src', data); });
      clientSocket.on("displayNose", function(data) { $("#noseImg").attr('src', data); });
      clientSocket.on("displayLeftEye", function(data) { $("#leftEyeImg").attr('src', data); });
      clientSocket.on("displayRightEye", function(data) { $("#rightEyeImg").attr('src', data); });

      // ------------------------------------------------------------------------- [ML]
      // +++++++++++++++++++++++++ $('#sub').click() +++++++++++++++++++++++++++++
      // fired upon click submit button
      // get the text data from textbox html5 element and sends it to server
      // -------------------------------------------------------------------------
      $("#sub").click(function() {
        let data = $("#message").val(); // get data
        let toSend = { // create a package
          id: socketId,
          data: data
        };
        clientSocket.emit('textChat', toSend); // send the package
        $("#message").val(''); // reset the texbox
      }); // .click()

      // ------------------------------------------------------------------------- [ML]
      // ++++++++++++++++ clientSocket.on('jokeFromServer') +++++++++++++++++++++++
      // fired upon receiving a joke from server
      // displays the jokes sent by other clients to severs
      // waits for 3000ms for user to read the joke
      // then starts observing user's facial response and sends the result to server
      // -------------------------------------------------------------------------
      clientSocket.on('jokeFromServer', function(data) {
        console.log("got the joke from server");
        console.log(data.data);
        // display the joke
        let liitem = $("<li>");
        liitem.text("ID: " + data.id + " => " + data.data);
        $("#chatList").append(liitem);

        // wait for 3000ms till user reads the joke, then call getFacialResponse
        setTimeout(getFacialResponse, 3000);

        // ======================================================================= [ML]
        // --------------------- getFacialResponse(data) -------------------------
        // called -> .on('jokeFromServer'), 3000ms after receiving a joke from Server
        // observes the user and calculates the average happiness caused by the joke
        // sends the results to server
        // =======================================================================
        function getFacialResponse() {
          lookForFacialResponse = true; // start observing (see the if statement in onPlay())
          setTimeout(function() {
            lookForFacialResponse = false; // stop observing
            console.log(`counter: ${counter}, Sum: ${sum}, Average: ${sum/counter}`);
            let average = sum / counter; // get the average
            // reset variables for next observation
            sum = 0;
            counter = 0;
            // create the packet
            const packet = {
              id: socketId,
              data: data.data,
              response: average.toFixed(3)
            };
            console.log(packet);
            // send the packet to server
            clientSocket.emit('facialResponse', packet);
            console.log("send response");
          }, 4000);

        } // getFacialResponse()
      }); // clientSocket.on('jokeFromServer')
    }); // clientSocket.on('joinedClientId')
  }); // clientSocket.on('connect')
}); // $(document).ready()
