<?php


  // if($_SESSION['valid']){

    $filename = $_POST['filename'];
    $json = $_POST['json'];
    $info = json_encode($json, JSON_PRETTY_PRINT);

    $file = fopen($filename,'w+');
    fwrite($file, $info);
    fclose($file);

    echo 'saved config to ' . $filename;
  // } else {
  //   echo 'valid ' .$_SESSION['valid'] .'<br>';
  //   echo "Not logged in";
  // }

?>
