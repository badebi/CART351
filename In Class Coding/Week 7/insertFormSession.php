<?php
  session_start();
//check if there has been something posted to the server to be processed
if($_SERVER['REQUEST_METHOD'] == 'POST')
{
// need to process
 $_SESSION['a_name'] = $_POST['a_name'];
 $_SESSION['a_title'] = $_POST['a_title'];
 $_SESSION['a_geo_loc'] = $_POST['a_geo_loc'];
 $_SESSION['a_descript'] = $_POST['a_descript'];
 $_SESSION['a_date'] = $_POST['a_date'];
// echo($artist);
if($_FILES)
	{
  	//echo "file name: ".$_FILES['filename']['name'] . "<br />";
  	//echo "path to file uploaded: ".$_FILES['filename']['tmp_name']. "<br />";
    $fname = $_FILES['filename']['name'];
    move_uploaded_file($_FILES['filename']['tmp_name'], "images/".$fname);

    $_SESSION["a_image"] = $fname;
    header("location:insertFormSession.php");
    // to not get the warning
    return;

    //   echo "<br \>Stored in: " . "images/" .$fname."<br \>";
    //   echo "<div class = 'outer'>";
    //   echo "<h3> Results from user </h3>";
    //   echo "<div class ='content'>";
    //   echo "<p> Artist:: ".$artist."</p>";
    //   echo "<p> Title:: ".$title."</p>";
    //   echo "<p> Location:: ".$loc."</p>";
    //   echo "<p> Description:: ".$description."</p>";
    //   echo "<p> Creation Date:: ".$creationDate."</p>";
    //   echo "<img src ='images/".$fname."'\>";
    //   echo "</div>";
    //   echo "</div>";




	}
}
  if (isset($_SESSION['a_name']) && isset($_SESSION['a_title']) && isset($_SESSION['a_geo_loc']) && isset($_SESSION['a_descript']) && isset($_SESSION['a_date']) && isset($_SESSION["a_image"])) {

      echo "<div class = 'outer'>";
      echo "<h3> Results from user </h3>";
      echo "<div class ='content'>";
      echo "<p> Artist:: ".$_SESSION['a_name']."</p>";
      echo "<p> Title:: ".$_SESSION['a_title']."</p>";
      echo "<p> Location:: ".$_SESSION['a_geo_loc']."</p>";
      echo "<p> Description:: ".$_SESSION['a_descript']."</p>";
      echo "<p> Creation Date:: ".$_SESSION['a_date']."</p>";
      echo "<img src ='images/".$_SESSION["a_image"]."'\>";
      echo "</div>";
      echo "</div>";

      session_unset();
      session_destroy();
}

?>
<!DOCTYPE html>
<html>
<head>
<title>Sample Insert into Gallery Form </title>
<!--set some style properties::: -->
<link rel="stylesheet" type="text/css" href="css/galleryStyle.css">
</head>
<body>


<div class= "formContainer">
<!--form done using more current tags... -->
<form action="insertFormSession.php" method="post" enctype ="multipart/form-data">
<!-- group the related elements in a form -->
<h3> SUBMIT AN ART WORK :::</h3>
<fieldset>
 <p><label>Artist:</label><input type="text" size="24" maxlength = "40" name = "a_name" required> </p>
<p><label>Title:</label><input type = "text" size="24" maxlength = "40"  name = "a_title" required></p>
<p><label>Geographic Location:</label><input type = "text" size="24" maxlength = "40" name = "a_geo_loc" required></p>
<p><label>Creation Date (DD-MM-YYYY):</label><input type="date" name="a_date" required></p>
<p><label>Description:</label><textarea type = "text" rows="4" cols="50" name = "a_descript" required></textarea></p>
<p><label>Upload Image:</label> <input type ="file" name = 'filename' size=10 required/></p>
<p class = "sub"><input type = "submit" name = "submit" value = "submit my info" id =buttonS /></p>
 </fieldset>
</form>
</div>
</body>
</html>
