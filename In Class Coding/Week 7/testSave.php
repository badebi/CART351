<?php
  // fopen() returnes a boolean ... if it doesn't workout ----> die();
  // fopen() also gets the permission ... w -> write (and overwrite => file pointer is always at the beginning); r -> read; a -> it appends to the file instead of overwriting the shit
  // of the path exists, php either open the file or creates it if it doesn't exist
  $theFile = fopen("files/fileA.txt","a") or die("unable to open file");
  $txt = "Sabin \n";
  fwrite($theFile, $txt);
  $txt = "Wednesday \n";
  fwrite($theFile, $txt);
  fclose($theFile);
 ?>
