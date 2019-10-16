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
      $_SESSION["favColor"] = "light-blue";
      $_SESSION["favAnimal"] = "iguana";
      echo "I just set some variables";
    ?>

  </body>
</html>
