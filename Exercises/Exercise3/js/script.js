$(document).ready(function() {
  $("#getInput").on("click", function() {
    console.log("clicked");
    let searchVal = $('#inputSearchVal').val();
    console.log(searchVal);
  });
});
