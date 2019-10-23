<?php
  session_start();

  echo (session_id()."</br>");
  if (isset($_SESSION['a_name']) && isset($_SESSION['a_email']) && isset($_SESSION['tempChoice']) && isset($_SESSION['resultTemp'])) {
    var_dump($_SESSION);
    session_unset();
    session_destroy();
  }

?>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>

  </body>
</html>
