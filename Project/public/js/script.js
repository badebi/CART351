window.onload = function() {
  console.log("launched client script");
  let clientSocket = io.connect('http://localhost:4200');

  //___________________________________________________ HANDSHAKE
  let socketId = -1;

  clientSocket.on('connect', function(data) {
    console.log("connected");
    clientSocket.emit('join', 'msg:: client joined');
    clientSocket.on('joinedClientId', function(data) {
      socketId = data;
      console.log(`my ID: ${socketId}`);

      //___________________________________________________ TEXT
      /** typing **/
      $("#sub").click(function() {

        let data = $("#message").val();

        console.log(data);
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


    }); // maybe I should put everything inside this function




    /* reveive message from server that mouse moved (mousemove) */
    clientSocket.on('movingFromServer', function(data) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, Number(data.x), Number(data.y), 15, 15);
      //console.log("moving");

    });

    /* reveive message from server that mouse stopped moving (UP) */
    // client.on('receiveStopFromServer', function(data) {
    //   console.log("receivedStop");
    //   tool.started = false;
    // });
    /* reveive message from server that mouse started moving (DOWN) */
    clientSocket.on('clickFromServer', function(data) {
      console.log("receivedClick");
      context.drawImage(img, Number(data.x), Number(data.y), 15, 15);

    });


    
    //___________________________________________________ CANVAS
    let canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    const img = new Image();
    img.src = '/images/icon.png';



    //canvas.addEventListener('mousedown', eventOnCanvas, false);
    canvas.addEventListener('mousemove', eventOnCanvas, false);
    canvas.addEventListener('click', eventOnCanvas, false);

    function handleClick(ev) {
      //context.drawImage(img,ev._x,ev._y, 15,15);

      clientSocket.emit('receiveClick', {
        'x': ev._x,
        'y': ev._y
      });

    };

    function handleMouseMove(ev) {
      clientSocket.emit('receiveMove', {
        'x': ev._x,
        'y': ev._y
      });
    };


    function eventOnCanvas(ev) {
      // Firefox and chrome
      if (ev.layerX || ev.layerX == 0) {
        // get the absolute pos of the element (canvas)
        var domRect = document.getElementById("canvas").getBoundingClientRect();
        // note drawing coordinates start at 0,0 in the canvas - so we need the diff
        // between the mouse and where the canvas starts  ...
        var diffX = ev.clientX - domRect.x;
        var diffY = ev.clientY - domRect.y;
        ev._x = diffX;
        ev._y = diffY;
      }
      /*
         Call the event handler of the within the pencilTool class
         could be mousedown, mouseup, mousemove...
      */
      if (ev.type === "click") {
        handleClick(ev);
      }

      if (ev.type === "mousemove") {
        handleMouseMove(ev);
      }
    } //eventOnCanvas(ev)

  }); // connect
}; // onLoad
