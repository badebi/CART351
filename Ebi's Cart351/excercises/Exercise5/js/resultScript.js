$(document).ready(function() {
  console.log("ready");
  let canvas = document.getElementById("testCanvas");
  //choose what you are going to do with your canvas
  let ctx = canvas.getContext("2d");

  let temp = 0.0;
  let unit = "";

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  $.ajax({
    type: "get",
    url: "tempResult.php",
    data: {
      ajaxTest: "fread"
    },
    success: function(response) {
      console.log("success");
      console.log(response);
      let parsedJSON = JSON.parse(response);
      console.log(parsedJSON);
      displayResults(parsedJSON);
    },
    error: function() {
      console.log("error");
    }
  });

  function displayResults(parsedJSON) {

    temp = Number.parseFloat(parsedJSON[parsedJSON.length - 1][1]).toFixed(1);
    unit = parsedJSON[parsedJSON.length - 1][0].toUpperCase();

    //console.log(`temp is: ${tempEntered} ${unitToConvertTo}`);

    //run(parsedJSON);

    requestAnimationFrame(run);
  }

  let index = 0.1;

  function run() {

    console.log("in the run");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // TODO: ADD LIMITS

    ctx.fillStyle = "#ffffff";
    // ctx.fillRect(canvas.width/2, (canvas.height / 2), 50, tempEntered * 10);
    // console.log(parsedJSON[parsedJSON.length - 1][1]);
    //let temp = Number.parseFloat(parsedJSON[parsedJSON.length - 1][1]).toFixed(1);
    ctx.font = '42px Black Ops One';
    ctx.textAlign = 'left';
    ctx.fillText(unit, (canvas.width / 2) + 15, canvas.height / 2);

    // if statement to know when to end the animation
    if (index > (temp - 2) && index < (temp + 2)) {
      index = 0.0;
      ctx.textAlign = 'right';
      if (temp > 0) {
        ctx.fillRect(canvas.width / 2, canvas.height / 2, 15, getMax(canvas.height / (-2) + (canvas.height / 5), temp * (-2)));
        ctx.fillText(temp, (canvas.width / 2), getMax((canvas.height / 2) + (temp * (-2) + 21), canvas.height / 5));
      } else {
        ctx.fillRect(canvas.width / 2, canvas.height / 2, 15, getMin((canvas.height / 2) - (canvas.height / 5), temp * (-2)));
        ctx.fillText(temp, (canvas.width / 2), getMin((canvas.height / 2) + (temp * (-2) + 21), 4 * canvas.height / 5));
      }

    }

    // if statement for managing the animation
    // TODO: There is a better way to do it, and it can be shrinked, but for know it's fine
    if (temp > 0 && index != 0) {

      ctx.fillRect(canvas.width / 2, canvas.height / 2, 15, getMax(canvas.height / (-2) + (canvas.height / 5), index * (-2)));
      ctx.textAlign = 'right';
      ctx.fillText(index.toFixed(1), (canvas.width / 2), getMax((canvas.height / 2) + (index * (-2) + 21), canvas.height / 5));
      index += 0.7;
      requestAnimationFrame(run);
    } else if (temp < 0 && index != 0) {
      ctx.fillRect(canvas.width / 2, canvas.height / 2, 15, getMin((canvas.height / 2) - (canvas.height / 5), index * (-2)));
      ctx.textAlign = 'right';
      ctx.fillText(index.toFixed(1), (canvas.width / 2), getMin((canvas.height / 2) + (index * (-2) + 21), 4 * canvas.height / 5));
      index -= 0.7;
      requestAnimationFrame(run);

    }

    // ctx.fillRect(canvas.width/2, canvas.height / 2 , 7, temp * (-2));
    // ctx.textAlign = 'right';
    // ctx.fillText(temp, (canvas.width/2), (canvas.height / 2) + (temp * (-2) + 21 ));
    //requestAnimationFrame(run);
  }

  function getMin(x, y) {
    if (x < y) {
      return x;
    } else {
      return y;
    }
  }

  function getMax(x, y) {
    if (x > y) {
      return x;
    } else {
      return y;
    }
  }
});
