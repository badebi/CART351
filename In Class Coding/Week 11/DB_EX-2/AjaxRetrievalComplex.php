<?php

if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET["load"]))
{
    //echo("IN GET LOAD");
  try
  {
    // Create (connect to) SQLite database in file
  $file_db = new PDO('sqlite:../db/artCollCombo.db');
  // Set errormode to exceptions
  /* .. */
  $file_db->setAttribute(PDO::ATTR_ERRMODE,
                          PDO::ERRMODE_EXCEPTION);
  //var_dump($_GET["theOptions"]);
 $artistOptions = json_decode($_GET["theOptions"]);
  //echo($artistOptions[0]);
  $myStr="SELECT DISTINCT artist FROM artCollectionSub";
  //echo($myStr);
  $result = $file_db->query($myStr);
  if (!$result) die("Cannot execute query.");
  // NOW WE WANT TO SEND THE RESULT AS A JSON STRING BACK TO CLIENT::

  // get a row...
  // MAKE AN ARRAY::
  $res = array();
  $i=0;
  while($row = $result->fetch(PDO::FETCH_ASSOC))
  {
    // note the result from SQLitE is ALREADy ASSOCIATIVE
    $res[$i] = $row;
    $i++;
  }//end while
  // endcode the resulting array as JSON
  $myJSONObj = json_encode($res);
  echo($myJSONObj);

  }
  catch(PDOException $e) {
    // Print PDOException message
    echo $e->getMessage();

  }
  $file_db =null;
  exit;
}
//check if there has been something posted to the server to be processed
if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET["theOptions"]))
{
  //echo("IN GET");
  try
  {
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
  //var_dump($_GET["theOptions"]);
 $artistOptions = json_decode($_GET["theOptions"]);
 //echo($artistOptions[0]);
 $myStr="SELECT * FROM artCollectionSub WHERE artist =";

 // go through the options there could be multiple ...
 for($i=0; $i<count($artistOptions);$i++){
  // apply the quotes for safety ...
   $escaped = $file_db->quote($artistOptions[$i]);
   // if at last one do not apply the OR pattern
   if($i == count($artistOptions)-1){

     $myStr = $myStr.$escaped;
   }
   // apply the OR pattern
   else{
     $myStr = $myStr. $escaped."OR artist=";
   }

 }
//echo($myStr);
$result = $file_db->query($myStr);
if (!$result) die("Cannot execute query.");
// NOW WE WANT TO SEND THE RESULT AS A JSON STRING BACK TO CLIENT::

// get a row...
// MAKE AN ARRAY::
$res = array();
$i=0;
while($row = $result->fetch(PDO::FETCH_ASSOC))
{
  // note the result from SQLitE is ALREADy ASSOCIATIVE
  $res[$i] = $row;
  $i++;
}//end while
// endcode the resulting array as JSON
$myJSONObj = json_encode($res);
echo $myJSONObj;
}
catch(PDOException $e) {
  // Print PDOException message
  echo $e->getMessage();

}
exit;

}
?>

<!DOCTYPE html>
<html>
<head>
<title>Sample Retrieval USING JQUERY AND AJAX </title>
<!-- get JQUERY -->
  <script src = "libs/jquery-3.4.1.js"></script>
<!--set some style properties::: -->
<link rel="stylesheet" type="text/css" href="css/galleryStyle.css">
</head>
<body>
<div class= "formContainer">
<!--form done using more current tags... -->
<form id="retrieveFromGallery" action="">
<!-- group the related elements in a form -->
<h3> RETRIEVE STUFF ACCORDING TO SOME CRITERIA :::</h3>
<fieldset>
<!-- <p><label>Criteria:</label><input type = "text" size="10" maxlength = "15"  name = "a_crit" value = "ALL" required></p> -->
<select id = "artist" multiple>
 <!--<option value="Martha">Martha</option>
 <option value="Stephen">Stephen</option>
 <option value="Harold">Harold</option>
 <option value="Sarah">Sarah</option>
  <option value="Maria">Maria</option> -->

</select>
<p class = "sub"><input type = "submit" name = "submit" value = "get Results" id ="buttonS" /></p>
 </fieldset>
</form>
</div>
<!-- NEW for the result -->
<div id = "result" class ="flexBox"></div>
<script>
$(document).ready (function(){

  $.get("AjaxRetrievalComplex.php", {"load":"getSelect"}, function(response)
  {
    console.log(response);
    let parsedJSON = JSON.parse(response);
    console.log(parsedJSON);
    for(let i =0; i<parsedJSON.length;  i++){
      console.log(parsedJSON[i].artist);
      let opt = $("<option>");
      opt.text(parsedJSON[i].artist);
      opt.attr("value", parsedJSON[i].artist);
      $("#artist").append(opt);
    }
  });
  function getSelectedOptions(theList)
{
   let sdValues = [];
   for(let i = 0; i < theList.options.length; i++)
   {
      if(theList.options[i].selected == true)
      {
      sdValues.push(theList.options[i].value);
      }
   }
   return sdValues;
}
    $("#retrieveFromGallery").submit(function(event) {
       //stop submit the form, we will post it manually. PREVENT THE DEFAULT behaviour ...
    event.preventDefault();
    console.log("button clicked");
    console.log(document.getElementById("retrieveFromGallery").elements["artist"]);
    let theList = getSelectedOptions(document.getElementById("retrieveFromGallery").elements["artist"]);
    console.log(theList);
    $.get("AjaxRetrievalComplex.php", {"theOptions":JSON.stringify(theList)}, function(response)
    {
      console.log(response);
      let parsedJSON = JSON.parse(response);
      console.log(parsedJSON);
      displayResponse(parsedJSON);
    });

});

   /* validate and process form here*/
    function displayResponse(theResult){
      $("#result").empty();
      // theResult is AN ARRAY of objects ...
      for(let i=0; i< theResult.length; i++)
      {
      // get the next object
      let currentObject = theResult[i];
      let contentContainer = $('<div>').addClass("contentA");
      // go through each property in the current object ....
      for (let property in currentObject) {
        if(property !=="image"){
          let para = $('<p>');
          $(para).text(property+"::" +currentObject[property]);
            $(para).appendTo(contentContainer);

        }

    }
     let img = $("<img>");
    $(img).attr('src',currentObject["image"]);
    $(img).appendTo(contentContainer);
      $(contentContainer).appendTo("#result");
    }
  }

});
</script>
</body>
</html>
