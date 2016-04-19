<?php

	if(isset($_POST['submit']))

		// date_default_timezone_set("Europe/Amsterdam");
		// date.timezone = "Europe/Amsterdam";

		$name = $_POST['name'];
		$email = $_POST['email'];
		$from = 'Nobelsaunas Order Form';

		$tz = 'Europe/Amsterdam';
		$timestamp = time();
		$dt = new DateTime("now", new DateTimeZone($tz)); //first argument "must" be a string
		$dt->setTimestamp($timestamp); //adjust the object to correct timestamp

		$message = $_POST['message'] . " " . $dt->format('d.m.Y, H:i:s') . "<br>" ;


		$to = 'configuratornobelsaunas@gmail.com';
		$subject 	= 'Message from Contact Demo ';
		$headers 	= 'MIME-Version: 1.0' . "\r\n";
		$headers 	.= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
		$headers 	.= 'From: _www@macbook-pro-van-tim-castelijn.local' . "\r\n";
		// $headers 	.= 'From: Nobelsaunas@timcastelijn.nl' . "\r\n";
		$message 	= "<html><head>" .
						 "<meta http-equiv='Content-Language' content='en-us'>" .
						 "<meta http-equiv='Content-Type' content='text/html; charset=windows-1252'>" .
						 "</head><body>" .$message .
						 "<br><br></body></html>";
		// mail($to, $subject, $message, $headers);

		$body = "From: $name\n E-Mail: $email\n Message:\n $message";

		if (mail ($to, $subject, $message, $headers)) {
			echo "succes";
			echo '<p> name is: ' . $_POST['name'];
			echo '<p> email is: ' . $_POST['email'];
			echo '<p> message is: ' . $_POST['message'];
			echo '<p> human is: ' . $_POST['human'];
		}


		// if(file_exists ( $folder ))
		// 	{
		// 		//do nothing
		// 	}else{
		// 		mkdir($folder);
		// 	}
		//  $filename = "object.obj";
		//  $Handle = fopen($folder."/".$filename, 'a');
    //     	 fwrite($Handle, $data);
    //     	 fclose($Handle);
?>
