$(document).ready(function() {
  console.log("ready");
  $.getJSON('json/data.json', dataLoaded);
});

function dataLoaded(data) {
  console.log("data Loaded");
  console.log(data);

  let header = $('header');
  let section = $('section');

  // wait for the user to submit somthing
  $(".searchButton").on("click", function() {
    console.log("clicked");
    let searchVal = $('.searchInput').val().toLowerCase();
    console.log(searchVal);

    let found = false;
    let targetDates = [];
    for (var i = 0; i < data.Days.length; i++) {
      if (data.Days[i].Date.toLowerCase().match(searchVal)) {
        console.log(`Day Found and it is ${data.Days[i].Date}`);
        targetDates.push(i);
        found = true;
      };
    }

    if (!found) {
      console.log("invalid entery");
    } else {
      header.empty();
      section.empty();

      console.log(targetDates);
      populateHeader(data.Label);
      for (var i = 0; i < targetDates.length; i++) {
        console.log(data.Days[targetDates[i]]);
        showResults(data.Days[targetDates[i]]);
      }
    }
  });

  // if user pressed Enter on searchbar, think it as if he clicked on search button
  $(".searchInput").on('keypress', function(event) {
    if (event.which == 13) {
      $(".searchButton").trigger("click");
    }
  });

  function populateHeader(label) {
    let sampleHeader = $("<h1>");
    $(sampleHeader).text(label);
    $(sampleHeader).appendTo(header);
  };

  function showResults(searchResult) {

    let sampleDateArticle = $('<article>');
    let sampleDateH2 = $("<h1>");
    let samplePara1 = $("<p>");
    let samplePara2 = $("<p>");
    let samplePara3 = $("<p>");
    let samplePara4 = $("<p>");
    let listItem1 = $("<li>");
    let listItem2 = $("<li>");
    let listItem3 = $("<li>");
    let listItem4 = $("<li>");
    let listItem5 = $("<li>");
    let sampleList = $("<ul>");


    $(sampleDateH2).text(searchResult.Date);
    $(samplePara1).text("Sleeping: " + searchResult.Breakdown.Sleeping);
    $(samplePara2).text("Staring At The Ceiling: " + searchResult.Breakdown.Staring_At_The_Ceiling);
    $(samplePara3).text("Cellphone Screen Time: ");
    $(listItem1).text("Total: " + searchResult.Breakdown.Cellphone_Screen_Time.Total);
    $(listItem2).text("Social Networking: " + searchResult.Breakdown.Cellphone_Screen_Time.Social_Networking);
    $(listItem3).text("Productivity: " + searchResult.Breakdown.Cellphone_Screen_Time.Productivity);
    $(listItem4).text("Education: " + searchResult.Breakdown.Cellphone_Screen_Time.Education);
    $(listItem5).text("Entertainment: " + searchResult.Breakdown.Cellphone_Screen_Time.Entertainment);



    // $(samplePara2).text(searchResult.Genre);
    // $(samplePara3).text(searchResult.Detail.Publisher);
    // $(samplePara4).text(searchResult.Detail.Publication_Year);


    // let bookPrices = searchResult.Price;


    // for (let j = 0; j < bookPrices.length; j++) {
    //   let listItem = $('<li>');
    //   $(listItem).text("type:: " + bookPrices[j].type + " & price:: $" + bookPrices[j].price);
    //   $(listItem).appendTo(sampleList);
    // }

    $(sampleDateH2).appendTo(sampleDateArticle);
    $(samplePara1).appendTo(sampleDateArticle);
    $(samplePara2).appendTo(sampleDateArticle);
    $(samplePara3).appendTo(sampleDateArticle);
    $(listItem1).appendTo(sampleList);
    $(listItem2).appendTo(sampleList);
    $(listItem3).appendTo(sampleList);
    $(listItem4).appendTo(sampleList);
    $(listItem5).appendTo(sampleList);
    // $(samplePara4).appendTo(sampleDateArticle);
    $(sampleList).appendTo(sampleDateArticle);

    $(section).append(sampleDateArticle);

  };
}
