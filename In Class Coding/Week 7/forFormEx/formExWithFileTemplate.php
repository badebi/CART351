<?php
  if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $name = $_POST['a_name'];
    $des = $_POST['a_descript'];
    $choice = $_POST['tempChoice'];
    // echo "$choice";
    // exit;
    $theFile = fopen("files/fileA.txt","a") or die("unable to open");
    // you have to structure your file
    fwrite($theFile, $name."\n");
    fwrite($theFile, $des."\n");
    fwrite($theFile, $choice."\n");
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

<div class= "formContainer">
<!--form done using more current tags... -->
<form id="insertTest" action="">
<!-- group the related elements in a form -->
<h3> TEST FORM</h3>
<fieldset>
<p><label>Name:</label><input type="text" size="24" maxlength = "40" name = "a_name" required></p>
<p><label>Description:</label><input type = "text" size="24" maxlength = "40"  name = "a_descript" required></p>

<p>
  <input type="radio" name="tempChoice" value="Red"> RED<br>
  <input type="radio" name="tempChoice" value="Blue"> BLUE <br>
</p>

<p class = "sub"><input type = "submit" name = "submit" value = "submit my info" id ="buttonS" /></p>
 </fieldset>
</form>
</div>
<script>
// here we put our JQUERY
$(document).ready (function(){
    $("#insertTest").submit(function(event) {
       //stop submit the form, we will post it manually. PREVENT THE DEFAULT behaviour ...
      event.preventDefault();
     console.log("button clicked");
     let form = $('#insertTest')[0];
     let data = new FormData(form);
     for (let valuePairs of data.entries()) {
       console.log(valuePairs[0]+ ', ' + valuePairs[1]);
     }
     $.ajax({
       type: "POST",
       enctype: "text/plain",
       url: "formExWithFileTemplate.php",
       data: data,
       processData: false,
       contentType: false,
       cach: false,
       timeout: 600000,
       success: function (response) {
         console.log("success");
         console.log(response);
       },
       error: function () {
         console.log("error");
       }
     });

   });
});
</script>
</body>
</html>
