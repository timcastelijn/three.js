function updatePriceGui(){
  $('#label_price').text(price);
}

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

    var width = event.data.width? event.data.width: 1;

    var geometry={
      floor:{"type":"floor", "position":["-1","0","0"], "size":width, "rotation":["0","0","0"]},
      wall:{"type":"wall", "position":["-1","0","0"], "size":2.5, "rotation":["0","180","0"]},
      roof:{"type":"roof", "position":["0","0","0"], "rotation":["0","0","0"]},
    }
    var block = addObject(geometry[event.data.type])
    console.log(block);
    selector.selected = block;
    selector.mouse_down = true;
    selector.intersected = block;
    selector.setSnapObjects()
    selector.calculateBBVolumes()
  }

  $('#btn_add_wall').click( {type:"wall"}, addBlock);
  $('#btn_add_floor_32').click( {type:"floor", width:3.2}, addBlock);
  $('#btn_add_floor_48').click( {type:"floor", width:4.8}, addBlock);
  $('#btn_add_roof').click( {type:"roof"}, addBlock);

  function saveConfig(event){
    if($('#save_file_name').val() == "model1.json"){
      alert("this name is not allowed");
      return false;
    }

    console.log("saving", Object.keys(config.geometry).length , "blocks to" , "config/" + $('#save_file_name').val(), config);

    $.ajax({
        url: 'server/saveJson.php',
        type: "POST",
        dataType : 'json',
        data: {
          filename: "../config/" + $('#save_file_name').val(),
          json: config
        },
        success: function(data) {console.log("succes", data); },
        failure: function(data) {console.log("failure", data); },
    });

  }

  function loadSavedConfig(event){
      clearScene()

      console.log("loading ", "config/" + $('#save_file_name').val());
      loadConfig("config/" + $('#save_file_name').val())
  }

  $('#save_config').click( saveConfig );
  $('#load_config').click( loadSavedConfig );

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
