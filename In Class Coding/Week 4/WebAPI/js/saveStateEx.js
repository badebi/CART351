window.onload = function() {

  let saveStateHandler = function() {

    //console.log(event)
    resetButtonStates();
    console.log("target:" + event.target.id);
    document.getElementById(event.target.id).classList.remove("not-active");
    document.getElementById(event.target.id).classList.add("active");
    // save to local storage
    // CREATE A LOCAL STORAGE ITEM (key value pair)
    //LOCAL storage is part of the window object
    //The localStorage object stores data with no expiration date.
    //The data will not be deleted when the browser is closed,
    //and will be available the next day, week, or year. - unless you remove browser history

    //The localStorage property is read-only.
    let keyToStore = "targetSet-" + event.target.id;
    let valToStore = 1;

    // check if this key-val alreday exists
    if (localStorage[keyToStore]) {
      // if yes then get the value and add 1
      valToStore = Number(localStorage.getItem(keyToStore)) + 1;
    }
    //WRITE to local storage
    console.log("writing to local storage:: the key: " + keyToStore + " val: " + valToStore);
    localStorage.setItem(keyToStore, valToStore);

  };



  let theButtons = document.getElementsByClassName("titleBar");

  for (let i = 0; i < theButtons.length; i++) {
    //console.log(theButtons[i]);
    theButtons[i].addEventListener('click', saveStateHandler);
  }

  function resetButtonStates() {
    for (let i = 0; i < theButtons.length; i++) {
      theButtons[i].classList.remove('active');
      theButtons[i].classList.add('not-active');
    }
  }

}
