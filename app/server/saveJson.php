<?php
  $filename = $_POST['filename'];
  $json = $_POST['json'];
  $info = json_encode($json, JSON_PRETTY_PRINT);

  echo 'test';

  $file = fopen($filename,'w+');
  fwrite($file, $info);
  fclose($file);

  echo 'saved config to ' . $filename;

?>
