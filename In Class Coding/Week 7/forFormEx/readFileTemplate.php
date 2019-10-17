<?php
  if ($_SERVER['REQUEST_METHOD'] == "GET" && isset($_GET['ajaxTest'])) {

    $counter = 0;
    $numberOfAttPerObj = 3;
    $outArr = array();

    $theFile = fopen("files/fileA.txt","a") or die("unable to open");
    while (!feof($theFile)) {
      if ($counter % $numberOfAttPerObj == 0) {
        $pData = new stdClass();
      }
      $index = $counter % $numberOfAttPerObj;
      $pData->$index = trim(fgets($theFile));
      if ($counter % $numberOfAttPerObj == $numberOfAttPerObj - 1 && $counter != 0) {
        array_push($outArr, $pData);
      }
    }
    fclose($theFile);
    exit;
  }
 ?>

<!DOCTYPE html>
<html>
<head>
<title>Same Form Ex </title>
<!-- get JQUERY -->
  <script src = "libs/jquery-3.4.1.js"></script>

</head>
<body>
  <!-- NEW for the result -->
<div id = "result"></div>


<script>
// here we put our JQUERY
$(document).ready (function(){

console.log("ready");

     $.ajax({
       type: "get",
       url: "readFileTemplate.php",
       data: {ajaxTest : "fread"},
       success: function (response) {
         console.log("success");
         console.log(response);
       },
       error: function () {
         console.log("error");
       }
     });

   });

</script>
</body>
</html>
