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

// =============================================================================== [DB]
// ------------------------- .establishConnection) -------------------------------
// a function from DBAccess script
// creats new sqlite3 database Object
// opens connection to DataBase
// ===============================================================================
// const jsonFile = './db/data/data.json';
const db = dataDBAccess.establishConnection(); // sqLite => dataBase

// =============================================================================== [ML]
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

// =============================================================================== [UI]
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

// =============================================================================== [DB]
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
  } // if()

  date = today;
  return true;
} // hasOneDayPassed();

// =============================================================================== [DB]
// ---------------------------- runOncePerDay() --------------------------------
// called -> io.on('connection')
// SQL -> It creates a table in database once per day and names it based on date
// Table format -> (pieceID INTEGER, joke TEXT, funniness TEXT)
// ===============================================================================
function runOncePerDay() {
  if (!hasOneDayPassed()) { // if we are in the same day, the rable already exist
    console.log('SAME DAY => table already exists');
    return; // so return and do not attempt to creat the same table
  } // if()
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

// =============================================================================== [UI]
// ------------------------------ setInterval() ----------------------------------
// Every 1000ms it assigns each part of the hybridFace to a random active client
// ===============================================================================
setInterval(function() {
  // list of connected clients
  io.clients((error, clients) => {
    if (error) throw error;
    // Loops through the hybridFace parts
    for (let key in hybridFace) {
      // skip loop if the property is from prototype
      if (!hybridFace.hasOwnProperty(key)) continue;
      // shuffles through the list of active clients and assigns a client to each part
      hybridFace[key] = shuffle(clients)[0];
    } // for()
  }); // io.clients()
}, 1000); // setInterval()

// =============================================================================== [UI]
// ---------------------------- shuffle([array]) ---------------------------------
// called -> setInterval()
// It suffles the given array and returns the shuffeled array
// ===============================================================================
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  } // for()
  return a;
} // shuffle(a)

// ===============================================================================
// ++++++++++++++++++++++++++ io.on('connection') ++++++++++++++++++++++++++++++++
// client/server handshake and fired upon a connection from client.
// everything between server and clients happens here
// ===============================================================================
io.on('connection', function(socket) {
  // console.log("a user connected");
  runOncePerDay(); // SQL -> creat a new table everyday and run database

  // -----------------------------------------------------------------------------
  // ++++++++++++++++++++++++++ socket.on('join') ++++++++++++++++++++++++++++++++
  // when a client gets 'connect' message from server, client emits 'join'
  // then server emits 'joinedClientId', and when client receives that,
  // everything on client side starts happening
  // -----------------------------------------------------------------------------
  socket.on('join', function(data) {
    clientIdIncrementing++; // just to give evry new client a number
    socket.emit('joinedClientId', clientIdIncrementing);
    console.log('a new user with id ' + clientIdIncrementing + " has entered");
    // keep track of IDs
    clientIds.push({
      id: clientIdIncrementing,
      socketId: socket.id
    });

    // NOTE: to keep track of clients who are connected:
    // io.clients((err,clients) => {(let onlineClients = clients)}
    // or:
    // let clients = io.sockets.clients();

    // =========================================================================== [UI]
    // ---------------------------- setInterval() --------------------------------
    // handles hybridFace
    // Every 500ms it starts the client/server conversation to get the hybridFace
    // parts from the assigns clients and send it to all other clents.
    // - server: 'areYouReady'?
    // - client: [if it has the result from face detection =>] 'readyToSendParts'
    // - server: [checks if client should send a part to server, if yes, which part
    //  =>] 'partRequest' [sends the name of the part it wants from this client]
    // - client: [extracts the requested part(s) and sends a dataURL to server =>]
    // 'gotMouth'/'gotNose'/'gotLeftEye'/'gotRightEye'
    // - server: [gets the part(s) and sends the dataURL(s) to other clients to display =>]
    // 'displayMouth'/'displayNose'/'displayLeftEye'/'displayRightEye'
    // - client: [gets the dataURL of part(s) of other clients for hybridFace from server
    // and displays it (them))]
    // OVER
    // ===========================================================================
    setInterval(function() {
      socket.emit('areYouReady', 'Server Asks every half a second if the client is ready')
    }, 500); // setInterval()

    // --------------------------------------------------------------------------- [UI]
    // +++++++++++++++++++ socket.on('readyToSendParts') +++++++++++++++++++++++++
    // goes through the hybridFace parts and checks whether "this" client should send
    // a part to server or not; if yes, which part =>
    // 'partRequest' [sends the name of the part it wants from this client]
    // ---------------------------------------------------------------------------
    socket.on('readyToSendParts', (data) => {
      for (let key in hybridFace) {
        // skip loop if the property is from prototype
        if (!hybridFace.hasOwnProperty(key)) continue;
        if (hybridFace[key] === socket.id) {
          socket.emit("partRequest", key);
        } // if()
      } // for()
    }); // socket.on('readyToSendParts')

    // --------------------------------------------------------------------------- [UI]
    // ++++++++++++++++++++++ socket.on('got[Part]') +++++++++++++++++++++++++++++
    // gets the part(s) and sends the dataURL(s) to other clients to display
    // ---------------------------------------------------------------------------
    socket.on('gotMouth', (data) => {socket.broadcast.emit('displayMouth', data);});
    socket.on('gotNose', (data) => {socket.broadcast.emit('displayNose', data);});
    socket.on('gotLeftEye', (data) => {socket.broadcast.emit('displayLeftEye', data);});
    socket.on('gotRightEye', (data) => {socket.broadcast.emit('displayRightEye', data);});

    // ---------------------------------------------------------------------------
    // ++++++++++++++++++++++ socket.on('disconnect') ++++++++++++++++++++++++++++
    // fired upon disconnection.
    // ---------------------------------------------------------------------------
    socket.on('disconnect', (reason) => {console.log(`${socket.id} disconnected`);});
  }); // socket.on('join')

  // ----------------------------------------------------------------------------- [ML][DB]
  // ++++++++++++++++++++++++ socket.on('textChat') ++++++++++++++++++++++++++++++
  // handles Machine Learning, organizing and saving input data and training data
  // fired upon receiving data from the textbox on client side
  // - client: [listens for click on submit button, when it is fired, gets data from
  // the text box and sends it to server =>] 'textChat'
  // - server: [send the received data to all other clients =>] 'jokeFromServer'
  // - client: [waits for 3000ms for client to read the joke then starts observing
  // user's facial response to the joke for 4000ms. it calculates the average
  // happiness of the user (with the help of face-API) and sends this number with
  // the associated joke back to server =>] 'facialResponse'
  // - server: [save the data into the database and stores it into trainingData
  // variable, with which, then, trains itself]
  // -----------------------------------------------------------------------------
  socket.on('textChat', function(data) {
    // sends the joke to all other clients
    socket.broadcast.emit('jokeFromServer', data);

    // --------------------------------------------------------------------------- [ML][DB]
    // ++++++++++++++++++++ socket.on('facialResponse') ++++++++++++++++++++++++++
    // fired when client finishes calculating the facial response of user to the joke.
    // adds the data received from client (reactionData) to the trainingData
    // puts the reactionData into today's table in database
    // trains itself with the new data
    // ---------------------------------------------------------------------------
    socket.on('facialResponse', function(reactionData) {
      // console.log(`server got the response: ${reactionData.data}, ${reactionData.response}`);
      // add new data to trainingData
      trainingData.push({
        input: reactionData.data,
        output: reactionData.response
      });

      // ========================================================================= [DB]
      // ------------------------ .putData(db, data) -----------------------------
      // a function from DBAccess script
      // gets a sqlite3 object (db) and data, and puts the data into db
      // returns a promise
      // =========================================================================
      dataDBAccess.putData(db, reactionData).then(result => {
          console.log("data successfully inserted");
          console.log("db result:: " + result);
        })
        .catch(function(rej) {
          //here when you reject the promise
          console.log(rej);
        });

      // start training
      trainML(trainingData);
      // check what we have got from which client
      console.log(`after geting data from ${reactionData.id} =>`);
      console.log(trainingData);
    }); // socket.on('facialResponse')

    // =========================================================================== [ML]
    // ---------------------------- trainML(data) --------------------------------
    // UNDER DEVELOPMENT
    // for now, it gets the data from trainingData and trains itself
    // but when we gathered enough traingig data, it will fetchData from data based to train
    // ===========================================================================
    function trainML(data) {
      // console.log("inside trainML()=>");
      // access data from database
      let theQuery = `SELECT * FROM trainingData${date.replace(/[/-]/g, "")}`;
      //use a promise - to only execute this when we are done getting the data
      dataDBAccess.fetchData(db, theQuery).then(resultSet => {
          console.log(resultSet);
          // res.send(JSON.stringify(resultSet));
        })
        .catch(function(rej) {
          //here when you reject the promise
          console.log(rej);
        }); // catch()

      // ========================================================================= [ML]
      // ----------------------- .train(trainingData) ----------------------------
      // from brainJS Library
      // trains the machine
      // The output of train() is a hash of information about how the training went
      // =========================================================================
      net.train(data, {
        iterations: 1500,
        errorThresh: 0.011/*,
        log: (stats) => console.log(stats)*/
      });
      // store training data as a JSON file and save it
      let json = net.toJSON();
      json = JSON.stringify(json, null, 2);
      fs.writeFile('./db/data/TrainedData.json', json, (err) => {
        if (err) throw err;
        console.log('Data written to file');
      });
    } // trainML()

    // TODO: OPTIMIZE LEARNING PROCCESS
  }); // socket.on('textChat')
}); // io.on('connection')
