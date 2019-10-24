<?php

  if ($_SERVER['REQUEST_METHOD'] == "GET" && isset($_GET['ajaxTest'])) {

    $counter = 0;
    $numberOfAttPerObj = 2;
    $outArr = array();

    $theFile = fopen("files/file.txt","r") or die("unable to open");

    while (!feof($theFile)) {

      if ($counter % $numberOfAttPerObj == 0) {
        $pData = new stdClass();
      }

      $index = $counter % $numberOfAttPerObj;
      $pData->$index = trim(fgets($theFile));

      if ($counter % $numberOfAttPerObj == $numberOfAttPerObj - 1 && $counter != 0) {
        array_push($outArr, $pData);
      }

      $counter = $counter + 1;
    }
    fclose($theFile);

    // var_dump($outArr);

    $myJSONobj = json_encode($outArr);
    echo "$myJSONobj";
    exit;
  }

?>
<!DOCTYPE html>
<html>
<head>
<title>RESULT</title>
<!-- get JQUERY -->
  <script src = "libs/jquery-3.4.1.js"></script>

  <link href="https://fonts.googleapis.com/css?family=Black+Ops+One&display=swap" rel="stylesheet">

  <style media="screen">

  html, body {
    width:  100%;
    height: 100%;
    margin: 0;
  }
  canvas{
    background-color: black;
    position:absolute;
    left:0;
    top:0;
    font-family: 'Black Ops One', cursive;
  }

  </style>

</head>
<body>
  <!-- NEW for the result -->
<div id = "result"></div>
<canvas id="testCanvas" width="500" height="500"></canvas>

<script>
// here we put our JQUERY
$(document).ready (function(){
  console.log("ready");
  let canvas = document.getElementById("testCanvas");
  //choose what you are going to do with your canvas
  let ctx = canvas.getContext("2d");

  let temp = 0.0;
  let unit = "";

  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

     $.ajax({
       type: "get",
       url: "tempResult.php",
       data: {ajaxTest : "fread"},
       success: function (response) {
         console.log("success");
         console.log(response);
         let parsedJSON = JSON.parse(response);
         console.log(parsedJSON);
         displayResults(parsedJSON);
       },
       error: function () {
         console.log("error");
       }
     });

     function displayResults(parsedJSON) {

       temp = Number.parseFloat(parsedJSON[parsedJSON.length - 1][1]).toFixed(1);
       unit = parsedJSON[parsedJSON.length - 1][0];

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
       ctx.fillText(unit, (canvas.width/2) + 15, canvas.height / 2);

       if (index > (temp - 2) && index < (temp + 2)) {
         index = 0.0;
         ctx.textAlign = 'right';
         if (temp > 0) {
           ctx.fillRect(canvas.width/2, canvas.height / 2 , 15, getMax(canvas.height /(-2) + (canvas.height/5), temp * (-2)));
           ctx.fillText(temp, (canvas.width/2), getMax((canvas.height / 2) + (temp * (-2) + 21 ), canvas.height /5));
         } else {
           ctx.fillRect(canvas.width/2, canvas.height / 2 , 15, getMin((canvas.height /2) - (canvas.height/5), temp * (-2)));
           ctx.fillText(temp, (canvas.width/2), getMin((canvas.height / 2) + (temp * (-2) + 21 ), 4 * canvas.height / 5));
         }

       }

       if (temp > 0 && index != 0) {

           ctx.fillRect(canvas.width/2, canvas.height / 2 , 15, getMax(canvas.height /(-2) + (canvas.height/5), index * (-2)));
           ctx.textAlign = 'right';
           ctx.fillText(index.toFixed(1), (canvas.width/2), getMax((canvas.height / 2) + (index * (-2) + 21 ), canvas.height /5));
           index += 0.7;
           requestAnimationFrame(run);
       } else if (temp < 0 && index != 0){
           ctx.fillRect(canvas.width/2, canvas.height / 2 , 15, getMin((canvas.height /2) - (canvas.height/5), index * (-2)));
           ctx.textAlign = 'right';
           ctx.fillText(index.toFixed(1), (canvas.width/2), getMin((canvas.height / 2) + (index * (-2) + 21 ), 4 * canvas.height / 5));
           index -= 0.7;
           requestAnimationFrame(run);

       }


       // ctx.fillRect(canvas.width/2, canvas.height / 2 , 7, temp * (-2));


       // ctx.textAlign = 'right';
       // ctx.fillText(temp, (canvas.width/2), (canvas.height / 2) + (temp * (-2) + 21 ));
       //requestAnimationFrame(run);
     }

     function getMin(x, y) {
       if (x<y) {
         return x;
       } else {
         return y;
       }
     }

     function getMax(x, y) {
       if (x>y) {
         return x;
       } else {
         return y;
       }
     }



   });


</script>
</body>
</html>
