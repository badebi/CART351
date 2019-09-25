window.onload = function() {
  console.log("testing");

  // make each box “clickable” and say which box was clicked
  let handleClick = function(event) {

    let displayText = document.getElementById('displayText');
    displayText.textContent = `This is Text For Box ${this.id}`;
    displayText.style.display = "inline-block";

    // hide the text when it's been clicked
    displayText.addEventListener('click', function() {
      displayText.style.display = "none";
    });
  }

  let cBox = document.getElementById('C');
  cBox.addEventListener('click', handleClick);

  let dBox = document.getElementById('D');
  dBox.addEventListener('click', handleClick);

  let eBox = document.getElementById('E');
  eBox.addEventListener('click', handleClick);

} //on load
