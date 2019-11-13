<?php
session_start();
$u_id = $_SESSION['userID'];
$u_name = $_SESSION['username'];

echo(" LOGGED IN USER ID :: ".$u_id."<br \>");
echo(" LOGGED IN USER NAME:: ".$u_name."<br \>");
?>
<?php
//check if there has been something posted to the server to be processed
if($_SERVER['REQUEST_METHOD'] == 'POST')
{
// need to process
 $title = $_POST['a_title'];
 $loc = $_POST['a_geo_loc'];
 $description = $_POST['a_descript'];
 $creationDate = $_POST['a_date'];
 if($_FILES)
  {
    //echo "file name: ".$_FILES['filename']['name'] . "<br />";
    //echo "path to file uploaded: ".$_FILES['filename']['tmp_name']. "<br />";
   $fname = $_FILES['filename']['name'];
   move_uploaded_file($_FILES['filename']['tmp_name'], "images/".$fname);

   try {
       /**************************************
       * Create databases and                *
       * open connections                    *
       **************************************/

       // Create (connect to) SQLite database in file
       $file_db = new PDO('sqlite:../db/artCollCombo.db');
       // Set errormode to exceptions
       /* .. */
       $file_db->setAttribute(PDO::ATTR_ERRMODE,
                               PDO::ERRMODE_EXCEPTION);

    /*The data from the text box is potentially unsafe; 'tainted'. Use the quote() - puts quotes around things..
      It escapes a string for use as a query parameter.
      This is common practice to avoid malicious sql injection attacks.
      PDO::quote() places quotes around the input string (if required)
      and escapes special characters within the input string, using a quoting style appropriate to the underlying driver. */
      $title_es = $file_db->quote($title);
      $loc_es =$file_db->quote($loc);
      $description_es =$file_db->quote($description);
      $creationDate_es =$file_db->quote($creationDate);
      // the file name with correct path
      $imageWithPath= "images/".$fname;


      //**** note how the artist field == username and the uId is the logged in user id ****//
      $queryInsert ="INSERT INTO artCollectionSub(artist, title, geoLoc, creationDate, descript,image, uID) VALUES ('$u_name',$title_es,$loc_es,$description_es,$creationDate_es,'$imageWithPath','$u_id')";
      $file_db->exec($queryInsert);
     }
     catch(PDOException $e) {
       // Print PDOException message
       echo $e->getMessage();
     }
    echo("DONE");
    exit;

  }//FILES
}//POST
?>

<!DOCTYPE html>
<html>
<head>
<title>Sample Insert into Gallery Form USING JQUERY AND AJAX </title>
<!-- get JQUERY -->
  <script src = "libs/jquery-3.4.1.js"></script>
<!--set some style properties::: -->
<link rel="stylesheet" type="text/css" href="css/galleryStyle.css">
</head>
<body>
  <!-- NEW for the result -->


<div class= "formContainer">
<!--form done using more current tags... -->
<form id="insertGallery" action="" enctype ="multipart/form-data">
<!-- group the related elements in a form  NO MORE ARTIST NAME!-->
<h3> SUBMIT AN ART WORK :::</h3>
<fieldset>
<p><label>Title:</label><input type = "text" size="24" maxlength = "40"  name = "a_title" required></p>
<p><label>Geographic Location:</label><input type = "text" size="24" maxlength = "40" name = "a_geo_loc" required></p>
<p><label>Creation Date (DD-MM-YYYY):</label><input type="date" name="a_date" required></p>
<p><label>Description:</label><textarea type = "text" rows="4" cols="50" name = "a_descript" required></textarea></p>
<p><label>Upload Image:</label> <input type ="file" name = 'filename' size=10 required/></p>
<p class = "sub"><input type = "submit" name = "submit" value = "submit my info" id ="buttonS" /></p>
 </fieldset>
</form>
</div>
<script>
// here we put our JQUERY
$(document).ready (function(){
    $("#insertGallery").submit(function(event) {
       //stop submit the form, we will post it manually. PREVENT THE DEFAULT behaviour ...
      event.preventDefault();
     console.log("button clicked");
     let form = $('#insertGallery')[0];
     let data = new FormData(form);
    // Display the key/value pairs
    // to access the data in the formData Object ... (not this is ALL TEXT ... )
    // as key -value pairs
    //Object.entries() method in JavaScript returns an array consisting of
    //enumerable property [key, value] pairs of the object.
    //for (let valuePairs of data.entries()) {
    //console.log(valuePairs[0]+ ', ' + valuePairs[1]);
  //}

  $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "AjaxInsertForm_N.php",
            data: data,
            processData: false,//prevents from converting into a query string
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (response) {
            //reponse is a STRING (not a JavaScript object -> so we need to convert)
            console.log("we had success!");
            console.log(response);
            window.location = "commence.php";
           },
           error:function(){
          console.log("error occurred");
        }
      });
   });
 });
</script>
</body>
</html>
