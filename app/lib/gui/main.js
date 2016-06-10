function updatePriceGui(){
  $('#label_price').text(price);
}

_button_table = {
  floor:{
    normal:{
      "l2.4":{button_text:"2.4m", type:"floor", size:[2.4, 0.3, 0.3]},
      "l3.6":{button_text:"3.6m", type:"floor", size:[3.6, 0.3, 0.3]},
      "l4.8":{button_text:"4.8m", type:"floor", size:[4.8, 0.3, 0.3]},
      "l5.4":{button_text:"5.4m", type:"floor", size:[5.4, 0.3, 0.3]},
    },
    end_pieces:{
      "l2.4":{button_text:"2.4m", type:"fl_e", size:[2.4, 0.3, 0.3]},
      "l3.6":{button_text:"3.6m", type:"fl_e", size:[3.6, 0.3, 0.3]},
      "l4.8":{button_text:"4.8m", type:"fl_e", size:[4.8, 0.3, 0.3]},
    },
  },
  wall:{
    normal:{
      "h2.7":{button_text:"2.7m", image:"images/wo-i-600.jpg", type:"wo_i_600", size:[0.6, 2.7, 0.3]},
      "h3.0":{button_text:"3.0m", type:"wo_i_600", size:[0.6, 3.0, 0.3]},
    },
    corner_pieces:{
      "h2.7":{button_text:"2.7m", type:"wo_oc", size:[0.6, 2.7, 0.3]},
    }
  },
  roof:{
    "h1.2":{
      "l1.2_h3.6":{button_text:"3.6m", type:"roof", size:[1.2, 1.2, 0.3]},
      "l1.8_h2.4":{button_text:"3.6m", type:"roof", size:[1.8, 1.2, 0.3]},
      "l2.4_h1.2":{button_text:"3.6m", type:"roof", size:[2.4, 1.2, 0.3]},
    },
    "h2.4":{
      "l1.2_h2.4":{button_text:"3.6m", type:"roof", size:[1.2, 2.4, 0.3]},
      "l1.8_h2.4":{button_text:"3.6m", type:"roof", size:[1.8, 2.4, 0.3]},
      "l2.4_h2.4":{button_text:"3.6m", type:"roof", size:[2.4, 2.4, 0.3]},
    },
    "h3.6":{
      "l1.2_h3.6":{button_text:"3.6m", type:"roof", size:[1.2, 3.6, 0.3]},
      "l1.8_h3.6":{button_text:"3.6m", type:"roof", size:[1.8, 3.6, 0.3]},
      "l2.4_h3.6":{button_text:"3.6m", type:"roof", size:[2.4, 3.6, 0.3]},
    },
  },
  window:{
    all:{
      "h2.7":{button_text:"3.6m", type:"wo_w_900", size:[0.9, 2.7, 0.3]},
    }
  },
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



  for (var name in _button_table) {
    if (_button_table.hasOwnProperty(name)) {
      //floor
      var category = _button_table[name];

      for (var name2 in category) {
        if (category.hasOwnProperty(name2)) {

          var $row = $('<div/>', {
            text: name2,
            class: "row",
          });

          var $row2 = $('<div/>', {
             class: "row",
          });

          $("#collapse1").find("#"+name).find('.container-fluid').append($row);
          $("#collapse1").find("#"+name).find('.container-fluid').append($row2);


          //normal
          var subcategory = category[name2];

          for (var name3 in subcategory) {
            if (subcategory.hasOwnProperty(name3)) {

              var $col = $('<div/>', {
                 class: "col-sm-4",
              });

              var item = subcategory[name3];

              var img = item.image? ('<img src="' + item.image + '" width="35"/>'): name3;
              // create buttons
              var $button= $('<button class="btn btn-default">' + img + '</button><p>'+ name3 +'</p>').click({type:item.type, size:item.size}, startBlockAdder )


              $col.append($button);
              $row2.append($col);
            }
          }
        }
      }
    }
  }

  function startBlockAdder(event){
    var type = event.data.type;
    var size = event.data.size;

    if(selector){
      selector.keep_adding = {type:type, size:size};
      selector.addBlock(type, size);
    }
  }

  // material selection
  /////////////////////
  function selectMaterial(e){
    console.log($(this)[0].selectedIndex);
    if($(this)[0].selectedIndex ==0){
      config.materials.cladding = new THREE.MeshPhongMaterial( { color: 0xffffff, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
    }else{

    }
    updateMaterials();

  }

  $("#select-material").change(selectMaterial)

  function saveConfig(event){

    if($('#save_file_name').val() == "model1.json"){
      alert("this name is not allowed");
      return false;
    }

    console.log("saving", Object.keys(config.geometry).length , "blocks to" , "config/" + $('#save_file_name').val(), config);

    $.ajax({
        url: 'server/saveJson.php',
        type: "POST",
        // dataType : 'json',
        data: {
          filename: "../config/" + $('#save_file_name').val(),
          json: config
        },
        beforeSend: function() {
          console.log('sending')
        },
        success: function(data) {
          console.log("succes", data);
        },
        failure: function(data) {
          console.log("failure", data);
        },
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
