<!DOCTYPE html>
<?php
# when data is available, run php shit
# $_SERVER is assossiative in-built array that has intresting shit ... everything is exists
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  # there is another in-built array called $_POST which has everything posted in it, temporary
  $artist = $_POST['a_name'];
  $title = $_POST['a_title'];
  $loc = $_POST['a_geo_loc'];
  $description = $_POST['a_descript'];
  $creationDate = $_POST['a_date'];
  # whenever file is uploaded, it's stored in a temprory location => we need to access its loc and then move it elsewhere so we lave access to it at any given posix_time
  # check if the file is uploaded
  if ($_FILES) {
    echo ($_FILES['filename']['name']);
    echo "<br/>";
    # where to get the file from
    echo ($_FILES['filename']['tmp_name']);

    $fname = $_FILES['filename']['name'];
    # in built function
    move_uploaded_file($_FILES['filename']['tmp_name'], "assets/images/".$fname);
  }

  # echo "$artist";

}

?>



<html>
<head>
  <title>Sample Insert into Gallery Form </title>
  <!--set some style properties::: -->
  <link rel="stylesheet" type="text/css" href="css/galleryStyle.css">
</head>

<body>
  <div class="formContainer">
    <!--form done using more current tags...
    post : more secure, more flexible
    action : where it's gonna be sent to-->
    <form action="insertForm.php" method="post" enctype="multipart/form-data">
      <!-- group the related elements in a form -->
      <h3> SUBMIT AN ART WORK :::</h3>
      <fieldset>
        <!-- name = "" is very important => they are keys for array of data -->
        <!-- required attrebute => doesn't let submit button work unlesss it's filled -->
        <p><label>Artist:</label><input type="text" size="24" maxlength="40" name="a_name" required> </p>
        <p><label>Title:</label><input type="text" size="24" maxlength="40" name="a_title" required></p>
        <p><label>Geographic Location:</label><input type="text" size="24" maxlength="40" name="a_geo_loc" required></p>
        <p><label>Creation Date (DD-MM-YYYY):</label><input type="date" name="a_date" required></p>
        <p><label>Description:</label><textarea type="text" rows="4" cols="50" name="a_descript" required></textarea></p>
        <p><label>Upload Image:</label> <input type="file" name='filename' size=10 required /></p>
        <p class="sub"><input type="submit" name="submit" value="submit my info" id=buttonS /></p>
      </fieldset>
    </form>
  </div>
</body>

</html>
