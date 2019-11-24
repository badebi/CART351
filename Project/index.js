let express = require('express');
let static = require('node-static');
const portNumber = 4200;
const app = express();
let httpServer = require('http').createServer(app);

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
app.get('/faceDetection', (req, res) => res.sendFile(__dirname + '/public/faceDetection.html'));

app.get('/cam', (req, res) => res.sendFile(__dirname + '/public/captureAPI.html'));
app.get('/webcam', (req, res) => res.sendFile(__dirname + '/public/webcamFaceLandmarkDetection.html'));
app.get('/tiny_face_detector_model-weights_manifest.json', (req, res) => res.sendFile(__dirname + '/public/models/tiny_face_detector_model-weights_manifest.json'));



let io = require('socket.io')(httpServer);

// client side
app.use(express.static(__dirname + '/node_modules'));
app.use('/face-api', express.static(__dirname + '/node_modules/face-api.js/dist/'));



// serever side
// ___________________________________________________ HandShake
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

    socket.on('receiveMove', function (data) {

        // This line sends the event (broadcasts it)
        // to everyone except the originating client.
        socket.broadcast.emit('movingFromServer', data);
       //for testing do one
       //  socket.emit('movingFromServer', data);
    });

    socket.on('receiveClick', function (data) {

        // This line sends the event (broadcasts it)
        // to everyone except the originating client.
        socket.broadcast.emit('clickFromServer', data);
       //for testing do one
       //  socket.emit('movingFromServer', data);
    });

  });
});
