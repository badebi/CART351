<?php
  // fopen() returnes a boolean ... if it doesn't workout ----> die();
  // fopen() also gets the permission ... w -> write (and overwrite => file pointer is always at the beginning); r -> read; a -> it appends to the file instead of overwriting the shit
  // of the path exists, php either open the file or creates it if it doesn't exist
  $theFile = fopen("files/fileA.txt","r") or die("unable to open file");
  // it moves the file pointer
  // echo (fread($theFile,filesize("files/fileA.txt")));
  // read line by line untile the end of the file
  while (!feof($theFile)) {
    // fgets() gets a string by line
    // fgetc() gets chaaracter by character
    echo ("a string".fgets($theFile)."</br>");
  }

  echo "DONE";
 ?>
