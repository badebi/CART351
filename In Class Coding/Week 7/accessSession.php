<?php
session_start();
?>
<html>
  <head>
    <title></title>
  </head>
  <body>

    <?php
      echo "My session ID:". session_id()."</br>";
      echo "My favorite color: ".$_SESSION["favColor"]."</br>";
      echo "My favorite color: ".$_SESSION["favAnimal"]."</br>";
    ?>

  </body>
</html>
