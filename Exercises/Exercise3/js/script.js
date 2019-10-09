$(document).ready(function() {
  console.log("ready");
  $.getJSON('json/data.json', dataLoaded);
});

function dataLoaded(data) {
  console.log("data Loaded");
  console.log(data);
  $("#getInput").on("click", function() {
    console.log("clicked");
    let searchVal = $('#inputSearchVal').val().toLowerCase();
    console.log(searchVal);

    let found = false;
    let targetDates = [];
    for (var i = 0; i < data.Days.length; i++) {
      if (data.Days[i].Date.toLowerCase() === searchVal) {
        console.log(`Day Found and it is ${data.Days[i].Date.toLowerCase()}`);
        targetDates.push(i);
        found = true;
      };
    }

    if (!found) {
      console.log("invalid entery");
    } else {
      console.log(targetDates);

      for (var i = 0; i < targetDates.length; i++) {
        console.log(data.Days[targetDates[i]]);
      }
    }

  });
}
