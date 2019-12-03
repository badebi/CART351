"use strict";

/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

// variables for doing a Gaussian distribution
let x2, y2;
let generator;

// a 2D array of Ellipses
let ellipses = [];

// variables for applying noise()
let zoff, yoff, xoff;

// Size of each cell in the grid
let videoScale = 4;
// Number of columns and rows in our system
let cols, rows;
// Variable for capture device
let video;

let videoIsReady = false;
// preload()
//
// Description of preload

function preload() {

}


// setup()
//
// Description of setup

function setup() {
  createCanvas(640, 480, WEBGL);
  //pixelDensity(1);
  background(51);
  // Initialize columns and rows
  cols = width / videoScale;
  rows = height / videoScale;
  // Construct the Capture object
  video = createCapture(VIDEO, ready);
  video.size(cols, rows);
  video.hide();

  //ellipses = new Ellipses;

  for (let i = 0; i < cols * 4; i += 4) {
    ellipses[i] = [];
    for (let j = 0; j < rows; j++) {
      ellipses[i][j] = new Ellipses(i, j);
    }
  }
  console.log(`ellipses = ${ellipses.length} x ${ellipses[0].length}`);
  // console.log(ellipses[0][0]);
  // console.log(ellipses[0][2]);
}

function ready() {
  videoIsReady = true;
}

// draw()
//
// Description of draw()

function draw() {
  let fov = PI / 3.0;
  let cameraZ = (height / 2.0) / tan(fov / 2.0);
  perspective(fov, width / height, cameraZ / 10.0, cameraZ * 10.0);

  translate(-width / 2, -height / 2, 0);
  //texture(video);
  //image(video, 0, 0);
  background(0);
  if (videoIsReady) {
    video.loadPixels();
    xoff = 0.0;

    // 15 octaves, with each octave having 60% impact of the one immediately below it
    noiseDetail(15, 0.6);

    // Begin loop for columns
    for (let i = 0; i < cols * 4; i += 4) {

      yoff = 1000.0;

      // Begin loop for rows
      for (let j = 0; j < rows; j++) {

        //         let index = (video.width - i + 1 + (j * video.width)) * 4;
        //       let r = video.pixels[index + 0];
        //       let g = video.pixels[index + 1];
        //       let b = video.pixels[index + 2];
        //       let bright = (r + g + b) / 3;
        //
        // console.log(`${r}, ${g}, ${b}, ${bright}`);
        ellipses[i][j].update();



        //ellipses[i][j].display();

        yoff += 0.01;
      }
      xoff += 0.01;
    }

    for (let i = 0; i < cols * 4; i += 4) {
      for (let j = 0; j < rows; j++) {
        // here I want to make an condition to avoid the program to go to the matrix when the pixels are not in
        // the range of Gaussian distribution ... In the other words, I just want to draw the pixels based on the
        // Gaussian distribution in each frame, and ignore drawing the other ones.
        // For the accuracy, I applied the Gaussian distribution to the pixels and then I scaled it down to rows and cols
        let sd = 36.0;
        let xMean = width / 2;
        let yMean = height / 2;
        x2 = randomGaussian(xMean, sd);
        y2 = randomGaussian(yMean, sd);

        //console.log(`x2 = ${floor(x2)}, y2= ${floor(y2)}`);

        ellipses[floor((x2 / videoScale)) * 4][floor((y2 / videoScale))].display();

        //ellipses[floor(i)][floor(j)].display();
      }
    }
    //updatePixels();

    // update zoff once per draw cycle
    zoff += 0.03;
  }
}
