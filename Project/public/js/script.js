let clientSocket = io.connect('http://localhost:4200');

//___________________________________________________ HANDSHAKE
let socketId = -1;
clientSocket.on('connect', function (data) {
  console.log("connected");
  clientSocket.emit('join', 'msg:: client joined');
  clientSocket.on('joinedClientId', function (data) {
    socketId = data;
    console.log(`my ID: ${socketId}`);
  });
});
