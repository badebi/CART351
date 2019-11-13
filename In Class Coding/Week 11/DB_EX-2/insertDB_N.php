<?php
// Set default timezone
//  date_default_timezone_set('UTC');
//https://www.sqlitetutorial.net/sqlite-foreign-key/
//https://www.techonthenet.com/sqlite/foreign_keys/foreign_keys.php
//** Important:
// we cannot insert into a table if the associated foreign key does NOT exist! */

try {
    /**************************************
    * Create databases and                *
    * open connections                    *
    **************************************/

    // Create (connect to) SQLite database in file
    $file_db = new PDO('sqlite:../db/artCollCombo.db');
    // Set errormode to exceptions
    /* .. */
    $file_db->setAttribute(PDO::ATTR_ERRMODE,
                            PDO::ERRMODE_EXCEPTION);

// ENABLE THE CONSTRAINT...
    $file_db->exec("PRAGMA foreign_keys = on");

    echo("opened or connected to the database graffitiGalleryCombo<br/>");


// locations TEXT, long TEXT, lat TEXT, descript TEXT
/*  $queryInsertLocs = array(
     "INSERT INTO locations(location,lat,long, descript) VALUES('Montreal','45.5017','73.5673','Montreal Coords')",
     "INSERT INTO locations(location,lat,long, descript) VALUES('New York','40.7128','74.0060','NY coords')",
     "INSERT INTO locations(location,lat,long, descript) VALUES('Edinborough','55.9533','3.1883','Edinborough coords')",
     "INSERT INTO locations(location,lat,long, descript) VALUES('Paris','48.8566','2.3522','Paris coords')",
     "INSERT INTO locations(location,lat,long, descript) VALUES('Toronto','43.6532','79.3832','Toronto coords')",
     "INSERT INTO locations(location,lat,long, descript) VALUES('Halifax','44.6488','63.5752','Halifax coords')",
    "INSERT INTO locations(location,lat,long, descript) VALUES('London','51.5074','0.1278','London coords')"


   );
   for($i =0; $i< count($queryInsertLocs); $i++){
     $file_db->exec($queryInsertLocs[$i]);
  }

  // users
  $queryArrayA = array(
     "INSERT INTO users(userID,username,pass) VALUES(1,'Sarah','23')",
     "INSERT INTO users(userID,username,pass) VALUES(2,'Harold','89')",
     "INSERT INTO users(userID,username,pass) VALUES(3,'Stephen','PASS')",
     "INSERT INTO users(userID,username,pass) VALUES(4,'Martha','pASS')"


  );
  // art coll sub
    $queryArray = array(
      "INSERT INTO artCollectionSub (artist, title, creationDate, geoLoc, descript, image,uID) VALUES ('Sarah', 'Hippos','2002-06-12','Montreal','Description for the arts','images/Artists-Lane-2.jpg',1)",
        	   "INSERT INTO artCollectionSub (artist, title, creationDate, geoLoc, descript, image,uID) VALUES ('Harold', 'Untitled', '2012-10-21','New York','Description for the arts','images/gorod-stena-grafiti-4927.jpg',2)",
         	   "INSERT INTO artCollectionSub (artist, title, creationDate, geoLoc, descript, image,uID) VALUES ('Stephen', 'Scotland','1999-07-18','Edinborough','Description for the arts','images/graffiti-artist-scotland.jpg',3)",
         	   "INSERT INTO artCollectionSub (artist, title, creationDate, geoLoc, descript, image,uID) VALUES ('Martha', 'Tigers','2017-08-21','Paris','Description for the arts','images/maxresdefault.jpg',4)",
        	   "INSERT INTO artCollectionSub (artist, title, creationDate, geoLoc, descript, image,uID) VALUES ('Sarah', 'WIndow','2005-06-13','Toronto','Description for the arts','images/windows.jpg',1)",
        	   "INSERT INTO artCollectionSub (artist, title, creationDate, geoLoc, descript, image,uID) VALUES ('Sarah', 'Untitled', '2003-03-19','Halifax','Description for the arts','images/work-50.jpg',1)",
         	   "INSERT INTO artCollectionSub (artist, title, creationDate, geoLoc, descript, image,uID) VALUES ('Stephen', 'Zoo','2000-05-06','London','Description for the arts','images/multi.jpg',3)"
     );

     for($i =0; $i< count($queryArrayA); $i++)
     {
        $file_db->exec($queryArrayA[$i]);

     }
      // go through each entry in the array and execute the INSERT query statement....
      for($i =0; $i< count($queryArray); $i++)
      {
  	     $file_db->exec($queryArray[$i]);

      } */
/* TO FIX THE VIOLATION */
  /*$qT = "INSERT INTO users(userID,username,pass) VALUES(5,'Maria','23')";
   $file_db->exec($qT);*/


// WILL INCUR A VIOLATION ...

/*  $qA = "INSERT INTO artCollectionSub (artist, title, creationDate, geoLoc, descript, image,uID) VALUES ('Maria', 'Hippos','2003-06-12','London','Untitled II','images/Artists-Lane-2.jpg',5)";
   $file_db->exec($qA);*/


  // if we reach this point then all the data has been inserted successfully.
  echo ("INSERTION OF ENTRY into artCollection Table successful");
      // Close file db connection
       $file_db = null;

  }
  catch(PDOException $e) {
    // Print PDOException message
    echo $e->getMessage();
  }
  ?>
