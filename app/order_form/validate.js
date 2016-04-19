$().ready(function(){
  $('#myform').validate({
    rules:{
      name: {
        required:true,
        minlength: 3,
      },
    },
    messages:{
      name: 'vul voor en achternaam in, minimaal 3 characters',
    }
  })
})
