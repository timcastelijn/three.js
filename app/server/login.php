<?php


   if (!empty($_POST['username']) && !empty($_POST['password'])) {

      if ($_POST['username'] == 'tim' &&
         $_POST['password'] == '1234') {
         $_SESSION['valid'] = true;
         $_SESSION['timeout'] = time();
         $_SESSION['username'] = 'tutorialspoint';

         echo 'You have entered valid use name and password <br>';
         echo 'session ' . $_SESSION['valid'] . '?';
      }else {
         echo 'Wrong username or password';
      }
   }else{
     echo 'please enter credentials';
   }
?>
