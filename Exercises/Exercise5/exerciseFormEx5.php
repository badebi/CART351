<?php
echo (session_id());

if($_SERVER['REQUEST_METHOD'] == 'POST')
{
  //logs the values in array (is to help ... )
  //var_dump($_POST);

  //$name = $_POST['a_name'];
  //$email = $_POST['a_email'];

  /* Step 1:
  Get the temperature value (a_temp): is a string so we need to convert to a number using the in built function intval()
  */
  $resultTemp = 0.0;
  $temp = intval($_POST['a_temp']);

  /* Step 2:
  Get the radio button choice (tempChoice) and then create a variable to hold the converted value::
  PLEASE USE THE FORMULA BELOW TO WRITE THE CONVERSION ALGORITHM - DO NOT USE ANY LIBRARY ETC
  To convert from Fahrenheit to Celsius: Celsius = (5 / 9) * (Fahrenheit – 32)
  To convert from Celsius to Fahrenheit: Fahrenheit = (9 / 5) * Celsius + 32
*/
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

  /* Step 3: using the echo() - display a custom message i.e. Dear ... to notify the user that
  they will get an email eventually with the results (please style the output) -
  and within the message you must include the person's name and email).*/
  // echo ("Dear ".$_POST['a_name'].", the answer will be sent to the email address >>".$_POST['a_email']."<< as soon as we finish computing. Thanks for your patience.");
}
 ?>

<!DOCTYPE html>
<html>
<head>
<title>Sample Contact and FahrenHeit/Celsius Form </title>
<!--set some style properties::: -->
<link href="https://fonts.googleapis.com/css?family=Black+Ops+One&display=swap" rel="stylesheet">
<style media="screen">

  body{
    font-family: 'Black Ops One', cursive;
    background-color: Black;
  }

  #form{
    width: 40em;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    color: white;
    padding: 25vh 0;
  }

  h1 {
    text-align: center;
  }

  #fsOne {

  }

  #radios{
    padding-top: 42px;
    padding-left: 20%;
    text-align: left;
    font-size: 1.5em;
    width: 15em;
    margin-left: auto;
    margin-right: auto;
  }

  #textInput{
    color: inherit;
    font-family: 'Black Ops One', cursive;
    font-size: 30px;
    width: 42%;
    padding-left: 15px;
    background-color: inherit;
    border: none;
    border-bottom: 4px solid #ffffff;
    border-radius: 5px;
  }

  #fsOne, #fsTwo {
    border: none;
  }

  input[type=submit] {
    background-color: #ffffff;
    font-family: 'Black Ops One', cursive;
    font-size: 42px;
    border: none;
    color: black;
    padding: 18px 36px;
    text-decoration: none;
    margin: 5px 4px;
    cursor: pointer;
    border-radius: 5px;
  }

</style>

</head>
<body>


<div class= "formContainer">
<!--form -->
<!-- You need an action att and a method att within the form tag -->
<form action="exerciseFormEx5.php" method="POST" enctype =”multipart/form-data” id="form">
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
