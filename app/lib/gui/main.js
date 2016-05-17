$(function() {

  // toggle arrow when operating accodion
  function toggleChevron(e) {
      $(e.target)
          .prev('.panel-heading')
          .find("i.indicator")
          .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
  }
  $('#accordion').on('hidden.bs.collapse', toggleChevron);
  $('#accordion').on('shown.bs.collapse', toggleChevron);

  // add block buttons
  function addBlock(event){

    var geometry={
      floor:{"type":"floor", "position":["0","0","0"], "size":3.2, "rotation":["0","0","0"]},
      wall:{"type":"wall", "position":["3.2","0.3","0.6"], "rotation":["0","180","0"]},
      roof:{"type":"roof", "position":["0","0","0"], "rotation":["0","0","0"]},
    }

    var block = addObject(geometry[event.data.type])
    selector.dragged = block;
    selector.setSnapObjects()
    selector.calculateBBVolumes()
  }

  $('#btn_add_wall').click( {type:"wall"}, addBlock);
  $('#btn_add_floor').click( {type:"floor"}, addBlock);
  $('#btn_add_roof').click( {type:"roof"}, addBlock);

  // handle form submit
  $("#myform").on("submit", function(e) {
    if($('#myform').valid()){

      cabine.getCellLayout();

      //prevent default redirecting to '*.php'
      e.preventDefault();
      $.ajax({
          url: $(this).attr("action"),
          type: 'POST',
          data: $(this).serialize() + "&config=" + JSON.stringify(config),
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

});
