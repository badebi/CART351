window.onload = function() {

  //get it from the browser
  window.AudioContext = window.AudioContext ||
    window.webkitAudioContext;
  let audioContext = new AudioContext(); //suing the web audio library
  // get the canvas
  let canvas = document.getElementById("testCanvas");

  //get the context
  let context = canvas.getContext("2d");

  // get the permission
  navigator.mediaDevices.getUserMedia({audio: true})
    .then(
      (stream) => {
        //returns a MediaStreamAudioSourceNode.
        const microphoneIn = audioContext.createMediaStreamSource(stream);
        const filter = audioContext.createBiquadFilter();
        const analyser = audioContext.createAnalyser();
        // microphone -> filter ->  analyzer->destination
        microphoneIn.connect(filter);
        //use the analyzer object to get some properties ....
        filter.connect(analyser);

        //we do not need a destination (out)
        //analyser.connect(audioContext.destination);
        analyser.fftSize = 32;
        let frequencyData = new Uint8Array(analyser.frequencyBinCount);

        //call loop ...
        requestAnimationFrame(callBackLoop);

        /****our looping callback function */
        function callBackLoop() {
          context.clearRect(0, 0, canvas.width, canvas.height);
          analyser.getByteFrequencyData(frequencyData);
          let average = 0;
          let sum = 0;

          for (let i = 0; i < frequencyData.length; i++) {
            sum += frequencyData[i];
          }
          average = sum / frequencyData.length;
          console.log(average);
          context.fillStyle = "#FF0000";
          //use the average frequency
          context.fillRect(canvas.width / 2, canvas.height / 2, average, 30);
          requestAnimationFrame(callBackLoop);

        }

      })
    .catch(function(err) {
      /* handle the error */
      console.log("had an error getting the microphone");
    });
}
