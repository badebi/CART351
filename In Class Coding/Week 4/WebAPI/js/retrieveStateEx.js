window.onload = function(){

let theButtons = document.getElementsByClassName("titleBar");

 //go through all the elements and retrieve the click values for each box from local storage

for(let i=0; i<theButtons.length;i++){

  let keyToRetrieve = "targetSet-"+theButtons[i].id;

  console.log("the key:: "+keyToRetrieve);

  let valRetrieved =0;
  // if the key exists
  if (localStorage[keyToRetrieve]) {
   //if yes get it
    valRetrieved = localStorage.getItem(keyToRetrieve);
  }
  //if not we will jusr put the  0
    console.log("the value:: "+valRetrieved);
    console.log(theButtons[i])
    let para = document.createElement('p');
    para.setAttribute('style',"background-color:rgba(125,0,0,1.0)");
    para.textContent = valRetrieved;
    theButtons[i].appendChild(para);

}//end for


}//end on load
