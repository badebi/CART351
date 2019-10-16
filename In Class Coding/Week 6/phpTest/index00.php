<!DOCTYPE html>
<?php
  echo "Hello world!"."<br/>";

 ?>

<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Hello World Example in php</title>

    <style>
      div
      {
        width: 200px;
        height: 200px;
        margin: 2px;
        padding: 4px;
        border-width:2px;
        border-style:solid;
        border-color:#ccc;
        background-color:#98bf21;
        font-size:14px;
        color:#111111;
        font-family:arial;

      }

      #divWithSpecificStyle
      {
        width: 200px;
        height: 200px;
        margin: 2px;
        padding: 4px;
        border-width:2px;
        border-style:solid;
        border-color:#ccc;
        background-color:#3ad7ff;
        font-size:14px;
        color:#333333;
        font-family:arial;
       }

      </style>

  </head>
  <body>
    <?php
    /*
    echo "<div> Hello World in div tags </div>";
    echo "<div id ='divWithSpecificStyle'> Hello World in div tags using a <strong>specific</strong> style </div>";

    $firstName = "Maria";
    $lastName = "Smith";
    $age = 22;
    $occupation = "Receptionist";
    # . is like + in JS => concatination
    echo $firstName."<br/>";
    $firstName = "Sabin";
    echo $firstName."<br/>";
    echo "$age";
    echo "<br/>".$firstName." ".$lastName."<br/>";
    echo '$firstName';
    echo "<br/>";
    echo "$firstName $lastName";

    $sum = 27 + 4;
    echo "<br/>";
    echo "$sum";
    $sumAge = $age * 23;
    echo "<br/>";
    echo "$sumAge";

    $valOne = 34;
    $valTwo = 40;
    $todayIsMonday = false;
    if ($valOne > $valTwo) {
      echo "<br/>";
      echo "valOne is >";
    } else {
      echo "<br/>";
      echo "valTwo is >";
    }

    if ($valOne < $valTwo && $todayIsMonday) {
      echo "<br/>";
      echo "today is Monday";
    }
    if ($valOne < $valTwo || $todayIsMonday) {
      echo "<br/>";
      echo "today is perhaps Monday";
    }
    if ($valOne < $valTwo || $todayIsMonday) {
      echo "<br/>";
      echo "today is not Monday";
    }
    */

    $shoppingList = array('crackers', 'chocolate', 'oranges');
    echo "$shoppingList[0] <br/>";
    $shoppingList[0] = 'peanuts';
    echo "$shoppingList[0]";
    $shoppingList[3] = "pears";
    $arrayLength = count($shoppingList);
    echo "<br/>";
    echo "$arrayLength";
    $shoppingList[5] = "weetabix";
    echo "<br/> $shoppingList[4]";
    $arrayLength = count($shoppingList);
    echo "<br/> $arrayLength";

    #assosiative array
    $math201Grades = array();
    $math201Grades['Sabin'] = "C";
    $math201Grades['Sandra'] = "B+";
    $math201Grades['Philip'] = "A-";
    echo "<br/> $math201Grades[Sabin]";

    $keys = array_keys($math201Grades);
    echo "<br/>";
    var_dump($keys);
    $values = array_values($math201Grades);
    echo "<br/>";
    var_dump($values);

    for ($i=0; $i < count($shoppingList) ; $i++) {
      echo "<br/> $shoppingList[$i]";
    }

    // assosiative for loop
    for ($j=0; $j < count($keys); $j++) {
      echo ("<br/>".$math201Grades[$keys[$j]]);
    }

    foreach ($math201Grades as $entry) {
      echo "<br/> $entry";
    }
    foreach ($math201Grades as $key => $value) {
      echo "<br/> $key $value";
    }


    ?>
    <p> today is fucked </p>

  </body>
</html>
