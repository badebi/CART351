// ===============================================================================
// requirements
// ===============================================================================
const dataDBAccess = require('./dbScripts/DBAccess.js');
const fs = require('fs');
const express = require('express');
const https = require('https');
const static = require('node-static');
const brain = require('brain.js'); // ML --> API => https://github.com/BrainJS/brain.js

// ===============================================================================
// certificate & key for a secure context to create a https server
// ===============================================================================
const key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
const cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');
const optionsK = {
  key: key,
  cert: cert
};
const portNumber = 4200;
const app = express();
const httpsServer = https.createServer(optionsK, app);
const io = require('socket.io')(httpsServer);

// ===============================================================================
// Open connection to DataBase
// ===============================================================================
// const jsonFile = './db/data/data.json';
const db = dataDBAccess.establishConnection(); // sqLite => dataBase

// ===============================================================================
// TrainML => Machine Learning stuff
// ===============================================================================
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

// ===============================================================================
// certificate & key for a secure context to create a https server
// ===============================================================================
let clientIdIncrementing = 0; // to keep track of # of clients // not necessary
let clientIds = []; // to keep track of clientIDs // not necessary
let date = '';
let hybridFace = { // is used by server to decide which part comes from which client
  mouth: '',
  nose: '',
  leftEye: '',
  rightEye: ''/*,
  leftEyeBrow: '',
  rightEyeBrow: '',
  jawOutline: ''*/
}

// ===============================================================================
// ---------------------------- hasOneDayPassed() --------------------------------
// called -> runOncePerDay()
// It checks whether a day has passed or not
// It returns "true" -> if one day has passed
// It returns "false" -> if we are in the same day
// ===============================================================================
function hasOneDayPassed() {
  let today = new Date().toLocaleDateString(); // keep the track of what day it is

  if (date === today) {
    return false;
  }

  date = today;
  return true;
} // hasOneDayPassed();

// ===============================================================================
// ---------------------------- runOncePerDay() --------------------------------
// called -> io.on('connection')
// SQL -> It creates a table in database once per day and names it based on date
// Table format -> (pieceID INTEGER, joke TEXT, funniness TEXT)
// ===============================================================================
function runOncePerDay() {
  if (!hasOneDayPassed()) { // if we are in the same day, the rable already exist
    console.log('SAME DAY => table already exists');
    return; // so return and do not attempt to creat the same table
  }
  console.log(date);
  // console.log(date.replace(/[/-]/g, ""));
  let theQuery = `CREATE TABLE IF NOT EXISTS trainingData${date.replace(/[/-]/g, "")} (pieceID INTEGER PRIMARY KEY NOT NULL, joke TEXT, funniness TEXT)`; // create a table
  db.run(theQuery); // run database
  // db.close();
  console.log("1st time for today");
} // runOncePerDay()

// ===============================================================================
// certificate & key for a secure context to create a https server
// ===============================================================================
httpsServer.listen(portNumber, () => console.log(`server is running on port ${portNumber}.`));

// ===============================================================================
// give client access to these these files
// ===============================================================================
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use('/face-api', express.static(__dirname + '/node_modules/face-api.js/dist/'));

// ===============================================================================
// rerouting
// ===============================================================================
app.get('/', (req, res) => res.sendFile(__dirname + '/public/faceDetection.html'));
app.get('/tiny_face_detector_model-weights_manifest.json', (req, res) => res.sendFile(__dirname + '/public/models/tiny_face_detector_model-weights_manifest.json'));

// ===============================================================================
// ------------------------------- setInterval -----------------------------------
// 
// ===============================================================================
setInterval(function() {
  let clientsList = [];
  // list of connected clients
  io.clients((error, clients) => {
    if (error) throw error;
    // console.log(`clients connected : ${clients}`);
    clientsList = clients;
    // console.log(`clients List: ${clientsList}`);

    for (let key in hybridFace) {
      // skip loop if the property is from prototype
      if (!hybridFace.hasOwnProperty(key)) continue;

      hybridFace[key] = shuffle(clients)[0];
    }
    // console.log(hybridFace);
  });
}, 1000);

// Array Shuffler
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// serever side
// ___________________________________________________ HandShake ___________________________________________________
io.on('connection', function(socket) {
  runOncePerDay();
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


    // let clients = io.sockets.clients();
    // console.log(clients);

    setInterval(function() {
      socket.emit('areYouReady', 'Server Asks every second if the client is ready')
      // console.log("Are you ready?");
    }, 500);

    socket.on('readyToSendParts', (data) => {
      // console.log("ready to send");
      // console.log(data);
      for (let key in hybridFace) {
        // skip loop if the property is from prototype
        if (!hybridFace.hasOwnProperty(key)) continue;

        if (hybridFace[key] === socket.id) {
          // console.log("sending");
          // console.log(`send => ${key} <= to ${socket.id}`);
          socket.emit("partRequest", key);
        }
      }
    });

    socket.on('gotMouth', (data) => {
      // console.log(data);
      socket.broadcast.emit('displayMouth', data);
    });
    socket.on('gotNose', (data) => {
      // console.log(data);
      socket.broadcast.emit('displayNose', data);
    });
    socket.on('gotLeftEye', (data) => {
      // console.log(data);
      socket.broadcast.emit('displayLeftEye', data);
    });
    socket.on('gotRightEye', (data) => {
      // console.log(data);
      socket.broadcast.emit('displayRightEye', data);
    });


    socket.on('disconnect', (reason) => {
      console.log(`${socket.id} disconnected`);
    });


    // socket.on('receiveMove', function(data) {
    //
    //   // This line sends the event (broadcasts it)
    //   // to everyone except the originating client.
    //   socket.broadcast.emit('movingFromServer', data);
    //   //for testing do one
    //   //  socket.emit('movingFromServer', data);
    // });
    //
    // socket.on('receiveClick', function(data) {
    //
    //   // This line sends the event (broadcasts it)
    //   // to everyone except the originating client.
    //   socket.broadcast.emit('clickFromServer', data);
    //   //for testing do one
    //   //  socket.emit('movingFromServer', data);
    // });

  });

  // ___________________________________________________ TEXT
  // when receives chat::
  socket.on('textChat', function(data) {
    socket.broadcast.emit('jokeFromServer', data);

    socket.on('facialResponse', function(isHilarious) {

      trainingData.push({
        input: isHilarious.data,
        output: isHilarious.response
      });
      // ___________________________________________________
      dataDBAccess.putData(db, isHilarious).then(result => {
          //do something with the result
          console.log("data successfully inserted");
          console.log("here:: " + result);
          // res.send(JSON.stringify({
          //   message: 'insert successful'
          // }));
        })
        .catch(function(rej) {
          //here when you reject the promise
          console.log(rej);
        });
      // ___________________________________________________

      // console.log(`server got the response: ${isHilarious.data}, ${isHilarious.response}`);
      trainML(trainingData);
      console.log(trainingData);
      console.log(`after geting data from ${isHilarious.id}`);
      // need to save the training data into a json file

    });

    // DEBUG

    // trainingData.push({
    //   input: data.data,
    //   output: 1
    // });

    // net.trainAsync(trainingData, options);

    // TODO: OPTIMIZE LEARNING PROCCESS


    function trainML(data) {
      console.log("inside trainML()=>");
      // do a test query and put result into console...
      let theQuery = `SELECT * FROM trainingData${date.replace(/[/]/g, "")}`;
      //use a promise - to only execute this when we are done  getting the data
      dataDBAccess.fetchData(db, theQuery).then(resultSet => {
          /*do something with the result
            for(var i=0; i< resultSet.length; i++)
            {
             console.log("title:: "+resultSet[i].title);
             console.log("artist:: "+resultSet[i].artist);
           }*/
          console.log(resultSet);
          // res.send(JSON.stringify(resultSet));
        })
        .catch(function(rej) {
          //here when you reject the promise
          console.log(rej);
        });

      net.train(data, {
        iterations: 1500,
        errorThresh: 0.011
        /*,
                log: (stats) => console.log(stats)*/
      });
      let json = net.toJSON();
      json = JSON.stringify(json, null, 2);
      fs.writeFile('./db/data/TrainedData.json', json, (err) => {
        if (err) throw err;
        console.log('Data written to file');
      });
      //console.log(json);
    }
    // console.log("after");



    // console.log(trainingData);
    //send to everyone else
    //  console.log(data);
    //send to EVERYONE...
    socket.broadcast.emit("dataFromServerToChat", data);

  }); // socket.on('textChat')

}); // io.on('connection')
