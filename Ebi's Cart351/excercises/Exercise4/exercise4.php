<?php
  if($_SERVER['REQUEST_METHOD'] == 'POST')
  {
    //logs the values in array (is to help ... )
    //var_dump($_POST);

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

    // echo "$resultTemp";

    /* Step 3: using the echo() - display a custom message i.e. Dear ... to notify the user that
    they will get an email eventually with the results (please style the output) -
    and within the message you must include the person's name and email).*/
    echo ("<p id='phpEcho'>Dear ".$_POST['a_name'].",</br>The answer will be sent to the email address >><u>".$_POST['a_email']."</u><< as soon as our associates finish computing.</br>Thanks for your patience.</p>");
  }
?>

<!DOCTYPE html>
<html>
<head>
<title>Sample Contact and FahrenHeit/Celsius Form </title>
<!--set some style properties::: -->
<link href="https://fonts.googleapis.com/css?family=Black+Ops+One&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>


  <div class= "formContainer">
  <!--form -->
  <!-- You need an action att and a method att within the form tag -->
  <form action="exercise4.php" method="POST" enctype =”multipart/form-data” id="form">
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
