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

    var type = event.data.type;
    var size = event.data.size;

    var geom_input = block_files[type];
    geom_input.size = size;

    var block = addObject(geom_input)

    selector.selected = block;
    selector.mouse_down = true;
    selector.intersected = block;
    selector.setSnapObjects()
    selector.calculateBBVolumes()
  }

  $('#btn_add_wall').click( {type:"wo_i_600", size:[0,2.7,0] }, addBlock);
  $('#btn_add_window').click( {type:"wo_w_900", size:[0,2.7,0]}, addBlock);
  $('#btn_add_floor_36').click( {type:"floor", size:[3.6,0,0]}, addBlock);
  $('#btn_add_floor_48').click( {type:"floor", size:[4.8,0,0]}, addBlock);
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
