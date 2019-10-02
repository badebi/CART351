$(document).ready(function () {

  $("#getData").on("click", function() {
    console.log("button clicked");
    $("#resultDiv").load('loadFiles/result.json')



  });
});
