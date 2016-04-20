$().ready(function(){
  $('#myform').validate({
    rules:{
      name: {
        required:true,
        minlength: 3,
      },
      telephone: {
        phoneNL: true,
      },
    },
    messages:{
      name: 'vul a.u.b. uw voor- en achternaam in, minimaal 3 characters',
      email: 'vul a.u.b. een geldig emailadres in',
      telephone: 'vul a.u.b. een telefoonnummer in, e.g. 0612345678',
    },
  });

  jQuery.validator.addMethod("phoneNL", function(phone_number, element) {
      return  phone_number.length == 10 && phone_number.match(/[2-9]/);
  }, "Please specify a valid phone number");

  $("#myform").on("submit", function(e) {
    if($('#myform').valid()){
      //prevent default redirrecting
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
              $("#myform").hide();
              $("#submit").hide();
              $("#response").html(data);
          }
      });
    }
  });
})
