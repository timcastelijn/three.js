$("#messages").

$( "#messages" ).on( "custom", function( event, param1, param2 ) {
  alert( param1 + "\n" + param2 );
});

function guiLog(message){
  $( "#message").text(message);
}
