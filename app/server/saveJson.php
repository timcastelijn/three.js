<?php


  // if($_SESSION['valid']){

    $filename = $_POST['filename'];
    $json = $_POST['json'];

    $len = 0;
    foreach($json['geometry'] as $key => $item) { //foreach element in $arr
      // echo $key . "\n" ; //etc
      $len = $len + 1;
    }


    $info = json_encode($json, JSON_PRETTY_PRINT);

    // echo 'strlen: '. strlen($info);



    $file = fopen($filename,'w+');
    fwrite($file, $info);
    fclose($file);

    echo " server received ". $len . " blocks. Saved to " . $filename ."\n";

    ;
  // } else {
  //   echo 'valid ' .$_SESSION['valid'] .'<br>';
  //   echo "Not logged in";
  // }

?>
