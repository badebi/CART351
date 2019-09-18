"use strict";

/*****************

Cart 351 Website
by Ebi Badawi

References:
https://codemyui.com/split-in-half-text-animation/

******************/

window.onload = function(){
let handleClick = function (event){
let parent = this.id;
  //let subMenu = document.createElement("div");;
  console.log("target:" + parent);

  // TODO: Animate it instead of going to other page ---> the line expands and other options appear
  if (parent === "one") {

  } else if (parent === "two") {

  } else if (parent === "three") {

  } else if (parent === "four") {

  }
  //parent.appendChild(subMenu);
};
  let one = document.getElementById('one');
  let two = document.getElementById('two');
  let three = document.getElementById('three');
  let four = document.getElementById('four');
  let five = document.getElementById('five');
  // QUESTION: I don't know why  document.getElementsByClassName() doesn't work
  one.addEventListener('click', handleClick);
  two.addEventListener('click', handleClick);
  three.addEventListener('click', handleClick);
  four.addEventListener('click', handleClick);
  five.addEventListener('click', handleClick);
}






// QUESTION: Does not work

// // Variables for jQuery
// let $menu = $('.Menu-list');
// let $item = $('.Menu-list-item');
// // Window width
// let w = $(window).width();
// // Window height
// let h = $(window).height();
//
// // A function is called whenever mouse moves on the screen and changes
// // the .menue-list transforms according to the position of the mouse
// $(window).on('mousemove', function(e) {
//   // Cursor position X
//   let offsetX = 0.5 - e.pageX / w;
//   // Cursor position Y
//   let offsetY = 0.5 - e.pageY / h;
//   // Center of poster vertically
//   let dy = e.pageY - h / 2;
//   // Center of poster horizontally
//   let dx = e.pageX - w / 2;
//   // Angle between cursor and center of poster in RAD
//   let theta = Math.atan2(dy, dx);
//   // Convert rad in degrees
//   let angle = theta * 180 / Math.PI - 90;
//
//   let offsetPoster = $menu.data('offset');
//   // Poster transform formula
//   let transformPoster = 'translate3d(0, ' + -offsetX * offsetPoster + 'px, 0) rotateX(' + (-offsetY * offsetPoster) + 'deg) rotateY(' + (offsetX * (offsetPoster * 2)) + 'deg)';
//
//   //get angle between 0-360
//   if (angle < 0) {
//     angle = angle + 360;
//   }
//
//   // Transform poster in css
//   $menu.css('transform', transformPoster);
//
//   // Parallax for each layer
//   $item.each(function() {
//     let $this = $(this);
//     let offsetLayer = $this.data('offset') || 0;
//     let transformLayer = 'translate3d(' + offsetX * offsetLayer + 'px, ' + offsetY * offsetLayer + 'px, 20px)';
//
//     $this.css('transform', transformLayer);
//   });
// });
