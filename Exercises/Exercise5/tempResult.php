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

       let tempEntered = parsedJSON[parsedJSON.length - 1][1];
       let unitToConvertTo = parsedJSON[parsedJSON.length - 1][0];

       console.log(`temp is: ${tempEntered} ${unitToConvertTo}`);

       run(parsedJSON);

       //requestAnimationFrame(run);
     }

     function run(parsedJSON) {

       console.log("in the run");
       ctx.clearRect(0, 0, canvas.width, canvas.height);

       ctx.fillStyle = "#ffffff";
       //ctx.fillRect(canvas.width/2, (canvas.height / 2), 50, tempEntered * 10);
       console.log(parsedJSON[parsedJSON.length - 1][1]);
       let temp = parsedJSON[parsedJSON.length - 1][1];
       ctx.fillRect(canvas.width/2, canvas.height / 2 , 7, parsedJSON[parsedJSON.length - 1][1] * (-2));
       ctx.font = '42px Black Ops One'
       ctx.fillText(parsedJSON[parsedJSON.length - 1][0],(canvas.width/2) + 7,canvas.height / 2);
       //requestAnimationFrame(run);
     }




   });


</script>
</body>
</html>
