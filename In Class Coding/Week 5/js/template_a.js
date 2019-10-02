$(document).ready(function() {
  $("#c").on("click", clickHandler);

  function clickHandler() {
    console.log($(this));
    $(this).css("background-color", "purple"); // adds inline style -> overwrites everything else
  };

  $("#d").on("click", clickHandlerD);

  function clickHandlerD() {
    $("#f").show();
    $("#e").hide();
  };

  $("#a").on("click", clickHandlerA);

  function clickHandlerA() {
    $("#g").toggle();
  };


  $(".box").on("mouseover", showParas);

  function showParas() {
    let pars = $("p");

    for (var i = 0; i < pars.length; i++) {
      //console.log($(pars[i]).html()); // having $ is neccessary to say that it isa jQuery function
      //console.log($(pars[i]).text());
    }
  };

  $("#clickable").on("click", getParaAtts);

  function getParaAtts() {
    // let pAtts = $("#clickable span").attr("title");
    // console.log(pAtt);

    let childrenParas = $(this).children("span");
    console.log(childrenParas);
    for (var i = 0; i < childrenParas.length; i++) {
      console.log($(childrenParas[i]).attr("title"));
    }
  };

  $("#clickable").on("mouseover", paraAttsOver);
  $("#clickable").on("mouseout", paraAttsOut);

  function paraAttsOver() {
    let childrenParas = $(this).children("span");
    for (var i = 0; i < childrenParas.length; i++) {
      $(childrenParas[i]).attr("title", i + "title");
    };
  };

  function paraAttsOut() {
    let childrenParas = $(this).children("span");
    for (var i = 0; i < childrenParas.length; i++) {
      $(childrenParas[i]).attr("cutomAttr", "dynamic");
    }
  };

}); // ENDING
