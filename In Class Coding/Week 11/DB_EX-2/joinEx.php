<?php
session_start();

 ?>
<!DOCTYPE html>
<html>
<head>
<title>WITHIN A SESSION </title>
<!-- get JQUERY -->
  <script src = "libs/jquery-3.4.1.js"></script>
<!--set some style properties::: -->
<link rel="stylesheet" type="text/css" href="css/galleryStyle.css">
</head>
<body>

<?php
$u_id = $_SESSION['userID'];

echo(" LOGGED IN USER ID :: ".$u_id."<br \>");
echo(" LOGGED IN USER NAME:: ".$_SESSION['username']."<br \>");
// now lets get all entries in the db that have the user ID...
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
  // make a join with locations
  $joinA = "SELECT * FROM artCollectionSub JOIN locations ON artCollectionSub.geoLoc =locations.location";
  $joinB = "SELECT * FROM artCollectionSub JOIN locations ON artCollectionSub.geoLoc =locations.location WHERE uID = '$u_id'";
  $result = $file_db->query($joinB);
  if (!$result) die("Cannot execute query.");
   echo "<div class = 'flexBox'>";
  while($row = $result->fetch(PDO::FETCH_ASSOC))
  {
    //var_dump($row);
    //echo("<br />");
    echo "<div class = 'contentA'>";

    // go through each column in this row
    // retrieve key entry pairs
    foreach ($row as $key=>$entry)
    {
      //if the column name is not 'image'
       if($key!="image")
       {
         // echo the key and entry
           echo "<p class = 'key'>".$key." ::".$entry."</p>";
       }
    }


    echo "</div>";

  }
    echo "</div>";
}


  catch(PDOException $e) {
    // Print PDOException message
    echo $e->getMessage();
  }

?>


</body>

</html>
