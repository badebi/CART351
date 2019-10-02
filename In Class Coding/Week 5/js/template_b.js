$(document).ready(function() {

  $("#c").on("click", function() {
    $("#pId").html("<h2> The Second paragraph is now an h2</h2>");
    $("clickable").text($("#pId").html());
    // $("clickable").html($("#pId").html());
  });


  $("#d").on("click", addElementCallBack);

  function addElementCallBack() {
      // $(this).before('<div class = "box" id = "n" style = "background-color: orange; border: 3px solid #db1d2b; "> NEW </div>')

      let newElement = $("<div>");
      newElement.addClass("box");
      newElement.css({
        "background-color": "orange",
        "border": "3px solid #db1db2"
      });
      newElement.text("NEW");

      newElement.bind("click", addElementCallBack);

      let parent = $("#rowOfBoxes")
      $(newElement).appendTo(parent);
      //$(parent).append(newElement);
      //$(this).before(newElement);



  }


  $(".pClass").on("click", function () {
    $(this).remove(); // removes everything entirely
    $(this).empty(); // doesn't remeve the container

  })
}); // ENDING
