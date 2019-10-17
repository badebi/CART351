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
    // echo "file name: ".$_FILES['filename']['name'] . "<br />";
    //echo "path to file uploaded: ".$_FILES['filename']['tmp_name']. "<br />";
    $fname = $_FILES['filename']['name'];
    move_uploaded_file($_FILES['filename']['tmp_name'], "images/".$fname);

    // PHP object with arrow notation
    //package the data and echo back...
    $myPackagedData=new stdClass();
    $myPackagedData->artist = $artist ;
    $myPackagedData->title = $title ;
    $myPackagedData->location = $loc ;
    $myPackagedData->description = $description ;
    $myPackagedData->creation_Date = $creationDate ;
    $myPackagedData->fileName = $fname ;
     // Now we want to JSON encode these values to send them to $.ajax success.
    $myJSONObj = json_encode($myPackagedData);
    echo $myJSONObj;


    // this is gonna be the response for AJAX
    // echo "SUCCESS";
    // you have to exit to not have the whole html script in console
    exit;
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
<!-- NO ACTION NO METHOD -->
<form action="" id = "insertGallery"  enctype ="multipart/form-data">
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

<script type="text/javascript">
  $(document).ready(function() {
    console.log("window Loaded");
    // check if submit button is pressed
    $("#insertGallery").submit(function(event) {
      // don't do shit unless I tell you what to do
      event.preventDefault();
      console.log("button clicked");

      // TODO: READ ABOUT THIS SHIT
      let form = $("#insertGallery")[0];
      let data = new FormData(form);

      // FOR DEBUGGING
      for (let valuePairs of data.entries()) {
        console.log(valuePairs[0] + "," + valuePairs[1]);
      };

      // Now AJAX comes in
      $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "insertFormAjax.php",
            data: data,
            processData: false,//prevents from converting into a query string -----> GET req and POST req differences
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (response) {
            //reponse is a STRING (not a JavaScript object -> so we need to convert)
            console.log("we had success!");
            console.log(response);

            let parsedData = JSON.parse(response);
            console.log(parsedData);
            // now it's time to display the shit
            displayResponse(parsedData);
           },
           error:function(){
          console.log("error occurred");
        }
      });


    }); // submit

    // validate and process form here
        function displayResponse(theResult){
          let container = $('<div>').addClass("outer");
          let title = $('<h3>');
          $(title).text("Results from user");
          $(title).appendTo(container);
          let contentContainer = $('<div>').addClass("content");
          for (let property in theResult) {
            console.log(property);
            if(property ==="fileName"){
              let img = $("<img>");
              $(img).attr('src','images/'+theResult[property]);

              $(img).appendTo(contentContainer);
            }
            else{
              let para = $('<p>');
              $(para).text(property+"::" +theResult[property]);
                $(para).appendTo(contentContainer);
            }

          }
          $(contentContainer).appendTo(container);
          $(container).appendTo("#result");
        }

  });
</script>


</html>
