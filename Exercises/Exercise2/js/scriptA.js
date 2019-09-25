window.onload = function() {
  console.log("testing");

  // make each box “clickable” and say which box was clicked
  function handleClick(event) {

    let displayText = document.getElementById('displayText');
    displayText.textContent = `This is Text For Box ${this.id}`;
    displayText.style.display = "inline-block";

    switch (this.id) {
      case "C":
        //console.log(this.style);
        displayText.style.background = "#3e181b";
        break;
      case "D":
        displayText.style.background = "#422018";
        break;
      case "E":
        displayText.style.background = "#45391b";
        break;
    }

    // hide the text when it's been clicked
    displayText.addEventListener('click', function() {
      displayText.style.display = "none";
    });
  };

  function handleMouseOver(event) {
    this.style.opacity = "0.5";
  };

  function handleMouseOut(event) {
    this.style.opacity = "1.0";
  };

  let cBox = document.getElementById('C');
  cBox.addEventListener('click', handleClick);
  cBox.addEventListener('mouseover', handleMouseOver);
  cBox.addEventListener('mouseout', handleMouseOut);

  let dBox = document.getElementById('D');
  dBox.addEventListener('click', handleClick);
  dBox.addEventListener('mouseover', handleMouseOver);
  dBox.addEventListener('mouseout', handleMouseOut);

  let eBox = document.getElementById('E');
  eBox.addEventListener('click', handleClick);
  eBox.addEventListener('mouseover', handleMouseOver);
  eBox.addEventListener('mouseout', handleMouseOut);

} //on load
