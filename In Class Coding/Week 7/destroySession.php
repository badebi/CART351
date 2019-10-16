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
      session_unset();
      session_destroy();
    ?>

  </body>
</html>
