<?php
  echo (session_id());

  if($_SERVER['REQUEST_METHOD'] == 'POST')
  {

    $resultTemp = 0.0;
    $temp = intval($_POST['a_temp']);

    $tempChoice = $_POST["tempChoice"];
    if ($tempChoice == "Celsius") {
      $resultTemp = ((5 / 9) * ($temp - 32));

    } elseif ($tempChoice == "Fahrenheit") {
      $resultTemp = ((9 / 5) * ($temp + 32));
    }

    $theFile = fopen("files/file.txt","a") or die("unable to open");
    // you have to structure your file
    fwrite($theFile, $tempChoice."\n");
    fwrite($theFile, $resultTemp."\n");
    fclose($theFile);
    header("location:tempResult.php");
    exit;
    return;

    // echo "$resultTemp";
  }
?>

<!DOCTYPE html>
<html>
<head>
<title>Sample Contact and FahrenHeit/Celsius Form </title>
<!--set some style properties::: -->
<link href="https://fonts.googleapis.com/css?family=Black+Ops+One&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/formStyle.css">

</head>
<body>


<div class= "formContainer">
<!--form -->
<!-- You need an action att and a method att within the form tag -->
<form action="exercise5.php" method="POST" enctype =”multipart/form-data” id="form">
<!-- group the related elements in a form -->

<h1> CONVERTE F->C or C->F </h1>
<fieldset id="fsOne">
 <p><label>NAME:</label><input type="text" size="40" maxlength = "40" name = "a_name" required id="textInput"> </p>
 <p><label>EMAIL:</label> <input type ="email" size="40" maxlength = "40" name = 'a_email' required id="textInput"></p>
</fieldset>
<fieldset id="fsTwo">
  <!-- ONLY number entries  -->
  <p><label>TEMPERATURE:</label><input type="number" size="5" maxlength = "5" name = "a_temp" required id="textInput"> </p>

    <p id="radios"><input type="radio" name="tempChoice" value="Celsius"> to CELSIUS<br>
    <input type="radio" name="tempChoice" value="Fahrenheit"> to FAHRENHEIT<br></p>

</fieldset>
<!-- submit button  -->
 <p><input type = "submit" name = "submit" value = "CONVERT" id =buttonS></p>
</form>
</div>
</body>
</html>
