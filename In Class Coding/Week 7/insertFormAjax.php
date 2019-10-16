<?php
//check if there has been something posted to the server to be processed
if($_SERVER['REQUEST_METHOD'] == 'POST')
{
// need to process
 $artist = $_POST['a_name'];
 $title = $_POST['a_title'];
 $loc = $_POST['a_geo_loc'];
 $description = $_POST['a_descript'];
 $creationDate = $_POST['a_date'];
// echo($artist);
if($_FILES)
	{
    echo "file name: ".$_FILES['filename']['name'] . "<br />";
    echo "path to file uploaded: ".$_FILES['filename']['tmp_name']. "<br />";
    $fname = $_FILES['filename']['name'];
    move_uploaded_file($_FILES['filename']['tmp_name'], "images/".$fname);





	}

}

?>
<!DOCTYPE html>
<html>
<head>
<title>Sample Insert into Gallery Form </title>
<!--set some style properties::: -->
<link rel="stylesheet" type="text/css" href="css/galleryStyle.css">
<script type="text/javascript" src="libraries/jquery-3.4.1.min.js"> </script>
</head>
<body>


<div class= "formContainer">
<!--form done using more current tags... -->
<form action="insertForm.php" method="post" enctype ="multipart/form-data">
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
