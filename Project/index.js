// this is the script that contains the functions for access/retreval from db
const dataDBAccess = require('./dbScripts/DBAccess.js');

const express = require('express');
const static = require('node-static');
const portNumber = 4200;
const app = express();
let httpServer = require('http').createServer(app);

// open connection to db
let db = dataDBAccess.establishConnection();

// ML --> API => https://github.com/BrainJS/brain.js
let brain = require('brain.js');

const net = new brain.recurrent.LSTM({
  hiddenLayers: [3]
});
// we want a jason file to store our training data (jokes)
const trainingData = [{
  input: "A skeleton walks into a bar and orders a beer and a mop",
  output: 1
}];
// log: (stats) => console.log(stats)
// https://github.com/BrainJS/brain.js#training-options
const options = {
  // Defaults values --> expected validation
  iterations: 20000, // the maximum times to iterate the training data --> number greater than 0
  errorThresh: 0.005, // the acceptable error percentage from training data --> number between 0 and 1
  log: false, // true to use console.log, when a function is supplied it is used --> Either true or a function
  logPeriod: 10, // iterations between logging out --> number greater than 0
  learningRate: 0.3, // scales with delta to effect training rate --> number between 0 and 1
  momentum: 0.1, // scales with next layer's change value --> number between 0 and 1
  callback: null, // a periodic call back that can be triggered while training --> null or function
  callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
  timeout: Infinity, // the max number of milliseconds to train for --> number greater than 0
};


let clientIdIncrementing = 0;
let clientIds = [];


httpServer.listen(portNumber, function() {
  console.log(`server is running on port ${portNumber}.`);
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
  console.log(req.url);
});

// Go to face detection page
app.get('/f', (req, res) => res.sendFile(__dirname + '/public/faceDetection.html'));

app.get('/cam', (req, res) => res.sendFile(__dirname + '/public/captureAPI.html'));
app.get('/webcam', (req, res) => res.sendFile(__dirname + '/public/webcamFaceLandmarkDetection.html'));
app.get('/tiny_face_detector_model-weights_manifest.json', (req, res) => res.sendFile(__dirname + '/public/models/tiny_face_detector_model-weights_manifest.json'));



let io = require('socket.io')(httpServer);

// client side
app.use(express.static(__dirname + '/node_modules'));
app.use('/face-api', express.static(__dirname + '/node_modules/face-api.js/dist/'));



// serever side
// ___________________________________________________ HandShake ___________________________________________________
io.on('connection', function(socket) {
  // console.log("a user connected");
  socket.on('join', function(data) {
    clientIdIncrementing++;
    socket.emit('joinedClientId', clientIdIncrementing);
    console.log('a new user with id ' + clientIdIncrementing + " has entered");
    // keep track of IDs
    clientIds.push({
      id: clientIdIncrementing,
      socketId: socket.id
    });

    socket.on('receiveMove', function(data) {

      // This line sends the event (broadcasts it)
      // to everyone except the originating client.
      socket.broadcast.emit('movingFromServer', data);
      //for testing do one
      //  socket.emit('movingFromServer', data);
    });

    socket.on('receiveClick', function(data) {

      // This line sends the event (broadcasts it)
      // to everyone except the originating client.
      socket.broadcast.emit('clickFromServer', data);
      //for testing do one
      //  socket.emit('movingFromServer', data);
    });

  });

  // ___________________________________________________ TEXT ___________________________________________________
  // when receives chat::
  socket.on('textChat', function(data) {
    let inputJoke = '';
    let inputReaction = 0;
    // let gotResponse = false;

    socket.broadcast.emit('jokeFromServer', data);

    socket.on('facialResponse', function(isHilarious) {
      let gotResponse = false;
      // trainingData.push({
      //   input: isHilarious.data,
      //   output: isHilarious.response
      // });

      inputJoke = isHilarious.data,
      inputReaction = isHilarious.response;

      if (gotResponse) {
        gotResponse = false;
        return;
      }
      gotResponse = true;
      updateTrainingData(isHilarious.id, gotResponse);

      // console.log(`server got the response: ${isHilarious.data}, ${isHilarious.response}`);
      // trainML(trainingData);

      //console.log(`data from: ${isHilarious.id} => `);
      // need to save the training data into a json file
    });

    // DEBUG
function updateTrainingData(id, gotResponse) {
  if (gotResponse) {
    trainingData.push({
      input: inputJoke,
      output: inputReaction
    });
    console.log(trainingData);
    console.log(`got data from: ${id}`);
  }
}



    // net.trainAsync(trainingData, options);

    // TODO: OPTIMIZE LEARNING PROCCESS


    function trainML(data) {
       net.train(data,{
        iterations: 1500,
        errorThresh: 0.011/*,
        log: (stats) => console.log(stats)*/
      });
    }
    // console.log("after");



    // console.log(trainingData);
    //send to everyone else
  //  console.log(data);
    //send to EVERYONE...
    socket.broadcast.emit("dataFromServerToChat", data);

  });

});
