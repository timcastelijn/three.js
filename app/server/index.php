<!DOCTYPE html>
<html lang="en">
	<head>
		<title>experience cabine - three.js webgl</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<!-- <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"> -->
		<link rel="stylesheet" href="https://bootswatch.com/cosmo/bootstrap.min.css">
		<link rel="stylesheet" href="style.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
		<script src="https://ajax.aspnetcdn.com/ajax/jquery.validate/1.15.0/jquery.validate.min.js"></script>
		<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
		<script src="validate.js"></script>


	</head>
	<body>
    <!-- <form action="saveState.php" method="post" enctype="application/x-www-form-urlencoded" name="classic_form" id="classic_form"> -->
    <div id="message"></div>
    <form id='myform' class="form-horizontal" role="form" method="post" action="saveState.php">
    	<div class="form-group">
    		<label for="name" class="col-sm-2 control-label">Name</label>
    		<div class="col-sm-10">
    			<input type="text" class="form-control" id="name" name="name" placeholder="First & Last Name" value="ti">
    		</div>
    	</div>
    	<div class="form-group">
    		<label for="email" class="col-sm-2 control-label">Email</label>
    		<div class="col-sm-10">
    			<input type="email" required class="form-control" id="email" name="email" placeholder="example@domain.com" value="t.m@gagahg.fe">
    		</div>
    	</div>
    	<div class="form-group">
    		<label for="message" class="col-sm-2 control-label">Message</label>
    		<div class="col-sm-10">
    			<textarea class="form-control" rows="4" name="message" >aanvraag voor sauna</textarea>
    		</div>
    	</div>
    	<div class="form-group">
    		<label for="human" class="col-sm-2 control-label">2 + 3 = ?</label>
    		<div class="col-sm-10">
    			<input type="text" class="form-control" id="human" name="human" placeholder="Your Answer" value='5'>
    		</div>
    	</div>
    	<div class="form-group">
    		<div class="col-sm-10 col-sm-offset-2">
    			<input id="submit" name="submit" type="submit" value="Send" class="btn btn-primary" onC>
    		</div>
    	</div>
    	<div class="form-group">
    		<div class="col-sm-10 col-sm-offset-2">
    			<!-- Will be used to display an alert to the user -->
    		</div>
    	</div>
    </form>
    <div id="response"></div>


  </body>
  <script>
  $(function() {
        $("#myform").on("submit", function(e) {
            e.preventDefault();
            $.ajax({
                url: $(this).attr("action"),
                type: 'POST',
                data: $(this).serialize(),
                beforeSend: function() {
                    $("#message").html("sending...");
                },
                success: function(data) {
                    $("#message").hide();
                    $("#response").html(data);
                }
            });
        });
    });
  </script
</html>
