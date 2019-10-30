let express = require('express');
let static = require('node-static');

let clientIdIncrementing = 0;
let clientIds = [];

const portNumber = 4200;
const app = express();


let httpServer = require('http').createServer(app);

httpServer.listen(portNumber, function () {
  console.log(`server is running on port ${portNumber}.`);
});


let io = require('socket.io')(httpServer);
// serever side
// ___________________________________________________ HandShake
io.on('connection', function (socket) {
  // console.log("a user connected");
  socket.on('join', function (data) {
    clientIdIncrementing ++;
    socket.emit('joinedClientId', clientIdIncrementing);
    console.log('a new user with id ' + clientIdIncrementing + " has entered");
    // keep track of IDs
    clientIds.push({id: clientIdIncrementing, socketId: socket.id});
  });
});
// client side
app.use(express.static(__dirname + '/node_modules'));


app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
  console.log(req.url);
});
