<?php
// Set default timezone

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

    echo("opened or connected to the database artCollCombo");
    //
    $file_db->exec("PRAGMA foreign_keys = on");

   $theQuery = 'CREATE TABLE IF NOT EXISTS users (userID INTEGER PRIMARY KEY NOT NULL, username TEXT, pass TEXT)';
   $file_db ->exec($theQuery);

   // FOREIGN KEY (uID) REFERENCES users(userID) ::: establish a constrain so we make two tables connect || because we are sure that the user exists, then we can use this relationship
   $theQueryT = 'CREATE TABLE IF NOT EXISTS artCollectionSub (artCollectionId INTEGER PRIMARY KEY NOT NULL, artist TEXT, title TEXT, geoLoc TEXT, creationDate TEXT,descript TEXT,image TEXT, uID INTEGER, FOREIGN KEY (uID) REFERENCES users(userID))';
    $file_db ->exec($theQueryT);

    $theQueryLocs = 'CREATE TABLE IF NOT EXISTS locations(locId INTEGER PRIMARY KEY NOT NULL, location TEXT, long TEXT, lat TEXT, descript TEXT )';
    $file_db ->exec($theQueryLocs);
//
      // Close file db connection
       $file_db = null;

  }
  catch(PDOException $e) {
    // Print PDOException message
    echo $e->getMessage();
  }
  ?>
