<?php
   session_start();
   /*session is started if you don't write this line can't use $_Session  global variable*/
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<title>FabField</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>

		<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
		<!-- <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"> -->
		<link rel="stylesheet" href="https://bootswatch.com/cosmo/bootstrap.min.css">

		<script src="https://ajax.aspnetcdn.com/ajax/jquery.validate/1.15.0/jquery.validate.min.js"></script>
		<script src="order_form/validate.js"></script>

		<script src="lib/colorselector/bootstrap-colorselector.js"></script>
		<link rel="stylesheet" href="bootstrap-colorselector.css">

		<link rel="stylesheet" href="style.css">
	</head>
	<body>
			<div id="content">
      <div id ='view-modus'>
        <h3>
          <span><a id="btn-edit" href="javascript:selector.rotateObject('CCW')" class="glyphicon glyphicon-pencil" aria-hidden="true"></a></span>
          <span><a id="btn-orbit" href="javascript:selector.rotateObject('CW')" class="glyphicon glyphicon-globe" aria-hidden="true"></a></span>
        </h3>
      </div>
      <div class="panel-group" id="accordion">
          <p><?php echo $_SESSION["newsession"] ?></p>
          <!-- <p>Stel je eigen <strong>cabine</strong> samen. <strong>Sleep</strong> de sliders om de dimensies aan te passen en <strong>selecteer</strong> de gewenste opties.</p> -->
  				<div>
						<h3>
							<span><a id="btn-rotate-CCW" href="javascript:selector.rotateObject('CCW')" class="glyphicon glyphicon-repeat" aria-hidden="true"></a></span>
							<span><a id="btn-rotate-CW" href="javascript:selector.rotateObject('CW')" class="glyphicon glyphicon-repeat" aria-hidden="true"></a></span>
							<span><a href="javascript:selector.deleteObject()" class="glyphicon glyphicon-trash" aria-hidden="true"></a></span>
						</h3>
					</div>
					<div class="panel panel-default">
	       		<div class="panel-heading">
	         		<h4 class="panel-title">
	           		<a data-toggle="collapse" data-parent="#accordion" href="#collapse1">Blocks<i class="indicator glyphicon glyphicon-chevron-down  pull-right"></i></a>
	         		</h4>
	       		</div>
	       		<div id="collapse1" class="panel-collapse collapse in">
	         		<div class="panel-body">

							  <!-- Nav tabs -->
							  <ul class="nav nav-tabs" role="tablist">
							    <li role="presentation" class="active"><a href="#floor" aria-controls="floor" role="tab" data-toggle="tab">Floors</a></li>
							    <li role="presentation"><a href="#wall" aria-controls="wall" role="tab" data-toggle="tab">Walls</a></li>
							    <li role="presentation"><a href="#roof" aria-controls="roof" role="tab" data-toggle="tab">roof</a></li>
							    <li role="presentation"><a href="#window" aria-controls="window" role="tab" data-toggle="tab">Windows</a></li>
							  </ul>

							  <!-- Tab panes -->
							  <div class="tab-content">
							    <div role="tabpanel" class="tab-pane active" id="floor">
										<div class="container-fluid">
                      <!-- buttons go here -->
										</div>
									</div>

									<div role="tabpanel" class="tab-pane" id="wall">
										<div class="container-fluid">
                      <!-- buttons go here -->
										</div>
									</div>

									<div role="tabpanel" class="tab-pane" id="roof">
										<div class="container-fluid">
                      <!-- buttons go here -->
                    </div>
									</div>

							    <div role="tabpanel" class="tab-pane" id="window">
										<div class="container-fluid">
                      <!-- buttons go here -->
                    </div>
							  	</div>


								</div>
	         		</div>
	       		</div>
	     		</div>
	     	<div class="panel panel-default">
	      	<div class="panel-heading">
	         	<h4 class="panel-title">
	           	<a data-toggle="collapse" data-parent="#accordion" href="#collapse4">Load and save<i class="indicator glyphicon glyphicon-chevron-up  pull-right"></i></a>
	         	</h4>
	       	</div>
	       	<div id="collapse4" class="panel-collapse collapse">
						<!-- save/load -->
						<div class="panel-body">
							<div class='row'>
								<div class="col-sm-12">
  								<input type="text" class="form-control" id="save_file_name" value=model2.json>
								</div>
							</div>
							<div class='row'>
								<div class="col-sm-6">
									<button type="button" id='save_config' class="btn btn-default btn-block">Save</button>
								</div>
								<div class="col-sm-6">
									<button type="button" id='load_config' class="btn btn-default btn-block">Load</button>
								</div>
							</div>
						</div>
	       	</div>
	     	</div>
	     	<div >
					<h2>€ <span id=label_price>0</span>,-</h2>
				</div>
				<div>
					<button type="button" class="btn btn-default" data-toggle="modal" data-target="#myModal">Order now</button>
				</div>
				<a href="" data-toggle="modal" data-target="#helpModal" style="position:relative; right:0px;"><i class="glyphicon glyphicon-info-sign"> </i></a>
				<!-- <button class='btn btn-default' data-toggle="modal" data-target="#modal-login" ><i class="glyphicon glyphicon-lock"> </i></button> -->
			</div>

			<!-- Modal -->
	   	<div id="myModal" class="modal fade" role="dialog">
	     	<div class="modal-dialog">

	      <!-- Modal content-->
	      <div class="modal-content">
	      	<div class="modal-header">
	        	<button type="button" class="close" data-dismiss="modal">&times;</button>
	          <h4 class="modal-title">Vraag offerte aan</h4>
	      	</div>
	        	<div class="modal-body">
	          	<div id="message"></div>
	          	<form id='myform' class="form-horizontal" role="form" method="post" action="order_form/saveState.php">
	           	<div class="form-group">
	      			<label for="name" class="col-sm-3 control-label">Naam</label>
	           		<div class="col-sm-9">
	           			<input type="text" class="form-control" id="name" name="name" placeholder="Voor- & achternaam">
	           		</div>
	           	</div>
	           	<div class="form-group">
	           		<label for="telephone" class="col-sm-3 control-label">Telefoonnummer</label>
	           		<div class="col-sm-9">
	           			<input type="text" class="form-control" id="telephone" name="telephone" placeholder="0612345678">
	           		</div>
	           	</div>
	           	<div class="form-group">
	           		<label for="email" class="col-sm-3 control-label">Emailadres</label>
	           		<div class="col-sm-9">
	           			<input type="email" required class="form-control" id="email" name="email" placeholder="voorbeeld@domein.nl">
	           		</div>
	           	</div>
	           	<div class="form-group">
	           		<label for="message" class="col-sm-3 control-label">opmerkingen</label>
	           		<div class="col-sm-9">
	           			<textarea class="form-control" rows="4" name="message" ></textarea>
	           		</div>
	           	</div>
	           	<div class="form-group">
	           		<div class="col-sm-10 col-sm-offset-2">
	           			<!-- Will be used to display an alert to the user -->
	           		</div>
	           	</div>
									<input type="hidden" class="form-control" name="config" value="javascript:JSON.stringify({apple:green, pear:blue})">
	           </form>
	           <div id="response"></div>
	         </div>
	         <div class="modal-footer">
	           <input id="submit" name="submit" type="submit" value="Verzenden" onclick="$('#myform').submit()" class="btn btn-primary" onC>
	           <button type="button" class="btn btn-default" data-dismiss="modal">Sluit</button>
	         </div>
	       </div>

	     </div>
	   </div>
		 <!-- modal end -->
			<!-- Modal -->
	   	<div id="helpModal" class="modal fade" role="dialog">
	     	<div class="modal-dialog">

	      <!-- Modal content-->
	      <div class="modal-content">
	      	<div class="modal-header">
	        	<button type="button" class="close" data-dismiss="modal">&times;</button>
	          <h4 class="modal-title">Help!</h4>
	      	</div>
	        	<div class="modal-body">
							<h3>help menu</h3>
	         </div>
	         <div class="modal-footer">
	           <!-- <input id="submit" name="submit" type="submit" value="Verzenden" onclick="$('#myform').submit()" class="btn btn-primary" onC> -->
	           <button type="button" class="btn btn-default" data-dismiss="modal">Sluit</button>
	         </div>
	       </div>

	     </div>
	   </div>
		 <!-- modal end -->
	</div>

	<div id="modal-login" class="modal fade" role="dialog">
		<div class="modal-dialog">

		<!-- Modal content-->
		<div class="modal-content">

					<form id="form-login" class = "form-signin" role = "form" method = "post">
						 <h4 class = "form-signin-heading"><?php echo $msg; ?></h4>
						 <input type = "text" class = "form-control"
								name = "username" placeholder = "username = tutorialspoint"
								required autofocus></br>
						 <input type = "password" class = "form-control"
								name = "password" placeholder = "password = 1234" required>
						 <button class = "btn btn-lg btn-primary btn-block" type = "submit" name = "login" onclick="$('#form-login').submit()">Login</button>
					</form>

					<div id="login-response"></div>

					Click here to clean <a href = "server/logout.php" tite = "Logout">Session.

			</div>
		</div>
	</div>
	<!-- <script src="../build/three.min.js"></script> -->
	<script src="../build/three.js"></script>
	<script src="../examples/js/controls/TrackballControls.js"></script>
	<script src="../examples/js/controls/OrbitControls.js"></script>
	<!-- <script src="../examples/js/libs/stats.min.js"></script> -->
	<script src="../examples/js/Detector.js"></script>
	<script src="../src/extras/helpers/AxisHelper.js"></script>
	<script src="../src/extras/helpers/EdgesHelper.js"></script>

	<script src="lib/gui/main.js"></script>
	<script src="lib/gui/login.js"></script>
	<script src="lib/draggable.js"></script>
	<script src="lib/blocks/block.js"></script>
	<script src="lib/blocks/wall.js"></script>
	<script src="lib/blocks/floor.js"></script>
	<script src="lib/blocks/floor_end.js"></script>
	<script src="lib/blocks/roof.js"></script>
	<script src="lib/browser_detector.js"></script>
	<script src="lib/json_loader.js"></script>
	<script src="lib/viewer.js"></script>

	<script>


	</script>

	</body>
</html>
