let lookForFacialResponse = false;
let counter = 0;
let sum = 0;

$(document).ready(function() {
  // let clientSocket = io.connect('http://localhost:4200');
  let clientSocket = io();
  console.log("ready");
  let faceDetectionModelsAreLoaded = false;



  clientSocket.on('connect', function(data) {
    console.log("connected");
    clientSocket.emit('join', 'msg:: client joined');
    clientSocket.on('joinedClientId', function(data) {

      // setInterval(function () {
      //   clientSocket.emit('readyToSendParts', 'client asks for furthur instructions from server')
      //
      // }, 2000);

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
      //___________________________________________________

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
          let context = canvas.getContext('2d');

          const jawOutline = result.landmarks.getJawOutline();
          const nose = result.landmarks.getNose();
          const mouth = result.landmarks.getMouth();
          const leftEye = result.landmarks.getLeftEye();
          const rightEye = result.landmarks.getRightEye();
          const leftEyeBrow = result.landmarks.getLeftEyeBrow();
          const rightEyeBrow = result.landmarks.getRightEyeBrow();


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

          // const face = await faceapi.extractFaces(videoEl, [result.alignedRect.box]);


          // ___________________________________________________ extractRandomPart()
          // not functional yet


          // READY TO EXTRACT PARTS AND SEND IT TO SERVER

          clientSocket.emit('readyToSendParts', 'client asks for furthur instructions from server');

          clientSocket.on('partRequest', async (key) => {
            // console.log(key);
            let requestedPart;
            // switch (key) {
            //   case "nose":
            //     requestedPart = nose;
            //     break;
            //   case "mouth":
            //     // requestedPart = mouth;
            //     getMouth();
            //     break;
            //   // case "leftEye":
            //   //   requestedPart = leftEye;
            //   //   break;
            //   // case "rightEye":
            //   //   requestedPart = rightEye;
            //   //   break;
            //   // case "leftEyeBrow":
            //   //   requestedPart = leftEyeBrow;
            //   //   break;
            //   // case "rightEyeBrow":
            //   //   requestedPart = rightEyeBrow;
            //   //   break;
            //   // case "jawOutline":
            //   //   requestedPart = jawOutline;
            //   //   break;
            //   default:
            //     console.log("no part requested");
            // }
            if (key === 'mouth') {
              getMouth();
            }

            if (key === 'nose') {
              getNose();
            }

            if (key === 'leftEye') {
              getLeftEye();
            }

            if (key === 'rightEye') {
              getRightEye();
            }

            // let exPart = extractRandomPart(requestedPart);
            // const extractedPart = await faceapi.extractFaces(videoEl, exPart);
            //   $('#otherParts').empty();
            //   $('#otherParts').append(extractedPart);
            // console.log("part");

          });

          clientSocket.on("displayMouth", function(data) {
            //  console.log("display mouth")
            // // console.log("display Mouth");
            // // console.log(data);
            // let mouthCanvas = $('#mouthCanvas')[0];
            //
            // let mouthContext = mouthCanvas.getContext('2d');
            // //  console.log(mouthContext);
            //
            // //  mouthContext.putImageData(data)
            // //  mouthContext.putImageData(data, 0, 0);
            //
            // // create imageData object
            // let idata = mouthContext.createImageData(100, 100);
            //
            // // set our buffer as source
            // idata.data.set(Object.values(data));
            //
            // // update canvas with new data
            // mouthContext.putImageData(idata, 0, 0);
            //
            // //console.log(Object.values(data));
            // // $('#mouth').empty();
            // //  $('#mouth').append(mouthCanvas);
            document.getElementById("mouthImg").src = data;
            // console.log(data);
            // $("#canvasImg").src = data;
          });

          clientSocket.on("displayNose", function(data) {
            document.getElementById("noseImg").src = data;
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

          async function getMouth() {
            let exPart = extractRandomPart(mouth, 15);
            const extractedPart = await faceapi.extractFaces(videoEl, exPart);
            //extractedPart.id = "mouthTwo";


            // let cx = document.getElementById("mouthTwo").getContext("2d");


            // let t = extractedPart[0].getContext("2d").getImageData(0, 0, extractedPart[0].width, extractedPart[0].height).data;
            //  console.log(t);

            let displayableMouth = extractedPart[0].toDataURL("image/jpeg", 0.7);

            //  console.log(extractedPart[0].getContext("2d").getImageData(0,0,100,100).data);
            //  let e  = document.getElementById("mouth");
            //let t = e.document.getElementsByTagName("canvas")[0];
            //console.log(e);
            //let t = {"test":extractedPart};
            //console.log(t.test);
            clientSocket.emit('gotMouth', displayableMouth);
            // $('#mouth').empty();
            // $('#mouth').append(extractedPart);
          }

          async function getNose() {
            let exPart = extractRandomPart(nose, 15);
            const extractedPart = await faceapi.extractFaces(videoEl, exPart);
            let displayableNose = extractedPart[0].toDataURL("image/jpeg", 0.7);
            clientSocket.emit('gotNose', displayableNose);
            // $('#nose').empty();
            // $('#nose').append(extractedPart);
          }

          async function getLeftEye() {
            let exPart = extractRandomPart(leftEye, 15);
            const extractedPart = await faceapi.extractFaces(videoEl, exPart);
            let displayableLeftEye = extractedPart[0].toDataURL("image/jpeg", 0.7);
            clientSocket.emit('gotLeftEye', displayableLeftEye);
            // $('#leftEye').empty();
            // $('#leftEye').append(extractedPart);
          }

          async function getRightEye() {
            let exPart = extractRandomPart(rightEye, 15);
            const extractedPart = await faceapi.extractFaces(videoEl, exPart);
            let displayableRightEye = extractedPart[0].toDataURL("image/jpeg", 0.7);
            clientSocket.emit('gotRightEye', displayableRightEye);
            // $('#rightEye').empty();
            // $('#rightEye').append(extractedPart);
          }

          // let requestedPart = mouth;
          //
          // let exPart = extractRandomPart(requestedPart);
          //

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

            const regionsToExtract = [
              new faceapi.Rect(part.x, part.y, part.width, part.height)
            ]

            // context.drawImage(videoEl, 0, 0, canvas.width / 2, canvas.height);

            // maybe put the pixleLoad stuff here

            return regionsToExtract;
          } // extractRandomPart()

          //
          // // console.log(exPart);
          // // console.log(result.alignedRect.box);
          //
          // //console.log(result.alignedRect.box);
          //
          // // extrarct it
          //  const extractedPart = await faceapi.extractFaces(videoEl, exPart);

          // send it to serever

          // Display the face
          $('#face').empty();
          $('#face').append(face);

          // $('#otherParts').empty();
          // $('#otherParts').append(extractedPart);



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

        if (!window.isSecureContext) {
          console.log("connection is not secured");
        }

        // const stream = await navigator.mediaDevices.getUserMedia({
        //   video: {}
        // });
        const videoEl = $('#video').get(0);
        // videoEl.srcObject = stream;
        // console.log(navigator.webkitGetUserMedia);
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
          })

        videoEl.addEventListener('loadedmetadata', (event) => {
          onPlay();
          // setInterval(function () {
          //   clientSocket.emit('readyToSendParts', 'client asks for furthur instructions from server');
          // }, 5000);
        });
      }; // run()


    }); // clientSocket.on('joinedClientId')
  }); // clientSocket.on('connect')
}); // $(document).ready()
