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
  <link rel="stylesheet" href="/css/resultStyle.css">
  <script type="text/javascript" src="js/resultScript.js"></script>
</head>
<body>
  <!-- NEW for the result -->
<div id = "result"></div>
<canvas id="testCanvas" width="500" height="500"></canvas>

</body>
</html>
