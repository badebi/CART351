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
      /** IMPORTANT :: we are trying to match on the uId from the other table **/
      $sql_select="SELECT * FROM artCollectionSub WHERE uID = '$u_id'";
      // the result set
      $result = $file_db->query($sql_select);
      if (!$result) die("Cannot execute query.");
      echo "<h3> Query Results FOR LOGGED IN USER:::</h3>";
      echo"<div class='flexBox'>";
      while($row = $result->fetch(PDO::FETCH_ASSOC))
      {
      //  var_dump($row);
        echo "<div class ='contentA'>";
        // go through each column in this row
        // retrieve key entry pairs
        foreach ($row as $key=>$entry)
        {
          //if the column name is not 'image'
           if($key!="image")
           {
             // echo the key and entry
               echo "<p>".$key." :: ".$entry."</p>";
           }
        }

         // access by key
         $imagePath = $row["image"];
         echo "<img src = $imagePath \>";
         echo "</div>";
     }//end while
     echo"</div>";

  }

  catch(PDOException $e) {
    // Print PDOException message
    echo $e->getMessage();
  }

?>


</body>

</html>
