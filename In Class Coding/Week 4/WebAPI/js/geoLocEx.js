window.onload = function() {

  document.getElementById("getLoc").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(usePosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

  });
  // THE CALLBACK FUNCTION which is called automatocally when the info is received
  function usePosition(position) {
    console.log(position);

    let paraLat = document.createElement("p");
    paraLat.textContent = "Latitude: " + position.coords.latitude;

    let paraLong = document.createElement("p");
    paraLong.textContent = "Longitude: " + position.coords.longitude;

    document.getElementById("coords").appendChild(paraLat);
    document.getElementById("coords").appendChild(paraLong);

  } //function usePosition


}
