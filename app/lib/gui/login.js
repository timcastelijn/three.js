// handle form submit
$("#form-login").on("submit", function(e) {
  // if($('#myform').valid()){

    //prevent default redirecting to '*.php'
    e.preventDefault();
    $.ajax({
        url: 'server/login.php',
        type: 'POST',
        data: $(this).serialize(),
        beforeSend: function() {
            console.log('sending')
        },
        success: function(data) {
            console.log('succes');
            console.log(data);
            // $("#form-login").hide();
            $("#login-response").html(data);        }
    });
  // }
});
