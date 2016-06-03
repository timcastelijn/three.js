<?php

	if(isset($_POST['submit']))

		// date_default_timezone_set("Europe/Amsterdam");
		// date.timezone = "Europe/Amsterdam";

		$name = $_POST['name'];
		$email = $_POST['email'];

		$tz = 'Europe/Amsterdam';
		$timestamp = time();
		$dt = new DateTime("now", new DateTimeZone($tz)); //first argument "must" be a string
		$dt->setTimestamp($timestamp); //adjust the object to correct timestamp

		$message = "<br>" ;
		$message .= "datum/tijd " . $dt->format('d.m.Y, H:i:s') . "<br>" ;
		$message .= "naam: " . $_POST['name'] . "<br>";
		$message .= "telefoonnummer: " . $_POST['telephone'] . "<br>";
		$message .= "emailadres: " . $_POST['email'] . "<br>";
		$message .= "opmerkingen: <br>" . $_POST['message'] . "<br>";
		$message .= "<br>";

		$json_a = json_decode($_POST['config'], true);
		$message .= "configuratie:"  . "<br>";
		$message .= "- afmetingen: \t" . $json_a['dimensions'][0] . " * " . $json_a['dimensions'][2] . " * " . $json_a['dimensions'][1] . "cm (l*b*h)<br>";
		$message .= "- aantal heaters: \t" . $json_a['heaters'] ."<br>";
		$message .= "- opties: \t" ;
		$count =0;
		if($json_a['options']["salt_vaporizer"]){
			$message .= "zoutvernevelaar, " ;
			$count = $count + 1;
		}
		if($json_a['options']["backrest"]){
			$message .= "rugsteun, " ;
			$count = $count + 1;
		}
		if($json_a['options']["aromatherapy"]){
			$message .= "aromatherapie, " ;
			$count = $count + 1;
		}
		if($json_a['options']["led_lighting"]){
			$message .= "Sterrenhemel, " ;
			$count = $count + 1;
		}
		if($count == 0){
			$message .= "geen " ;
		}
		$message .= "<br>";

		// kleur
		$message .= "kleur: <br>" ;
		$message .= "- interieur: ". $json_a['colors']['interior'] ."<br>" ;
		$message .= "- exterior: ". $json_a['colors']['exterior'] ."<br>" ;
		$message .= "- floor: ". $json_a['colors']['floor'] ."<br>" ;
		$message .= "- backrest: ". $json_a['colors']['backrest'] ."<br>" ;




		$to = 'configuratornobelsaunas@gmail.com';
		// $to = 't.castelijn@hotmail.com';
		$subject 	= 'offerteaanvraag ';
		$headers 	= 'MIME-Version: 1.0' . "\r\n";
		$headers 	.= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
		// $headers 	.= 	'From: ' . $_POST['name'] .'<staunir@timcastelijn.nl>' . "\r\n" .
		$headers 	.= 	'From: ' . $_POST['name'] .'<'. $_POST['email'] .'>' . "\r\n" .
									'Reply-To: ' . $_POST['email'] . "\r\n" .
    							'X-Mailer: PHP/' . phpversion();
		$message 	= "<html><head>" .
						 "<meta http-equiv='Content-Language' content='en-us'>" .
						 "<meta http-equiv='Content-Type' content='text/html; charset=windows-1252'>" .
						 "</head><body>" .$message .
						 "<br><br></body></html>";
		// mail($to, $subject, $message, $headers);

		if (mail ($to, $subject, $message, $headers)) {
			echo '<p> beste ' . $_POST['name'];
			echo "<p> uw aanvraag is verstuurd";
			echo '<p> er wordt spoedig contact opgenomen via: ' . $_POST['email'];
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
