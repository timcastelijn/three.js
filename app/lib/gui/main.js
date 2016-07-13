function updatePriceGui(){
  $('#label_price').text(price);
}

function guiLog(message){
    if( message){
      $( "#messages").html(message);
    }else {
      // $( "#messages").html('hold "Alt" to navigate');
      $( "#messages").html('message:');
    }
}


_button_table = {
  floor:{
    options:{
      length:{
        "2.4":{state:""},
        "3.6":{state:""},
        "4.8":{state:"checked"},
        "5.4":{state:""},
      },
    },
    elements:{
      "normal":{button_text:"2.4m", image:"images/fl.jpg", type:"floor", size:[2.4, 0.3, 0.3]},
      "end piece":{button_text:"3.6m", image:"images/fl_e.jpg", type:"fl_e", size:[3.6, 0.3, 0.3]},
      "filler":{button_text:"2.4m", image:"images/fl_filler.jpg", type:"fl_filler", size:[2.4, 0.3, 0.3]},
    },
  },
  wall:{
    options:{
      height:{
        "2.7":{size:[-1,2.7,-1] ,state:"checked"},
        "3.0":{size:[-1,3.0,-1] ,state:""},
      },
    },
    elements:{
        "wall 300":{button_text:"2.7m", image:"images/wo_i_300.jpg", type:"wo_i_300", size:[0.3, 2.7, 0.3]},
        "wall 600":{button_text:"2.7m", image:"images/wo_i_600.jpg", type:"wo_i_600", size:[0.6, 2.7, 0.3]},
        "corner piece":{button_text:"2.7m", image:"images/wo_i_300.jpg", type:"wo_oc", size:[0.6, 2.7, 0.3]},
        "window 600":{button_text:"3.6m", image:"images/wo_w_600.jpg", type:"wo_w_900", size:[0.9, 2.7, 0.3]},
        "window 900":{button_text:"3.6m", image:"images/wo_w_900.jpg", type:"wo_w_900", size:[0.9, 2.7, 0.3]},
    }
  },
  roof:{
    options:{
      length:{
        "1.2":{size:[1.2,-1,-1] ,state:"checked"},
        "1.8":{size:[1.8,-1,-1] ,state:""},
        "2.4":{size:[2.4,-1,-1] ,state:""},
        "2.7":{size:[2.7,-1,-1] ,state:""},
      },
      angle:{
        "30º":{angle:30 ,state:""},
        "45º":{angle:45 ,state:"checked"},
        "60º":{angle:60 ,state:""},
      }
    },
    elements:{
        "roof":{button_text:"2.7m", image:"images/ro_600.jpg", type:"roof", size:[2.4, 1, 0.6], angle:45},
        "roof end":{button_text:"2.7m", image:"images/ro_e.jpg", type:"ro_e", size:[2.4, 1, 0.3], angle:45},
    }
  },
  // window:{
  //   all:{
  //     "w600":{button_text:"3.6m", image:"images/wo_w_600.jpg", type:"wo_w_900", size:[0.9, 2.7, 0.3]},
  //     "w900":{button_text:"3.6m", image:"images/wo_w_900.jpg", type:"wo_w_900", size:[0.9, 2.7, 0.3]},
  //   }
  // },
  interior:{
    options:{
      height:{
        "2.7":{size:[-1,2.7,-1] ,state:"checked"},
        "3.0":{size:[-1,3.0,-1] ,state:""},
      },
    },
    elements:{
      "w300":{button_text:"3.6m", image:"images/wi_i_300.jpg", type:"wi_i", size:[0.3, 2.7, 0.1]},
      "w600":{button_text:"3.6m", image:"images/wi_i_600.jpg", type:"wi_i", size:[0.6, 2.7, 0.1]},
      "t":{button_text:"3.6m", image:"images/wi_t.jpg", type:"wi_i", size:[0.6, 2.7, 0.1]},
      "x":{button_text:"3.6m", image:"images/wi_x.jpg", type:"wi_i", size:[0.6, 2.7, 0.1]},
    }
  },
}


$(function() {

  $('#view-toggle').find('a').click(function(e){
    _view_open = $(this).attr('value')=='true'? true: false;

    if( !_view_open){
      showAllBlocks()
    }

    guiLog('open view selected, place the red dot inside the area ou want to edit')

  })


  // toggle arrow when operating accodion
  function toggleChevron(e) {
      $(e.target)
          .prev('.panel-heading')
          .find("i.indicator")
          .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
  }
  $('#accordion').on('hidden.bs.collapse', toggleChevron);
  $('#accordion').on('shown.bs.collapse', toggleChevron);

  function addRow(text, target){
    var $row = $('<div/>', {
      text: text,
      class: "row",
    });
    target.append($row);
  }

  function addRowRadios(table, target){
    var $row = $('<div/>', {
      class: "row",
    });

    var $form = $('<form/>', {
       role: "form",
    });

    for (var radio_name in table) {
      var radio = table[radio_name];

      var $radio= $('<label class="radio-inline"><input type="radio" name="optradio" '+ radio.state +'>' + radio_name +'</label>').change({category:category, parameters:radio}, setShapeParameters) //.mousedown({type:item.type, size:item.size, angle:item.angle}, startBlockAdder )
      $form.append($radio);
    }
    $row.append($form)
    target.append($row);
  }

  function addRowButtons(table, target){
    var $row = $('<div/>', {
      class: "row",
    });

    for (var button_name in table) {

      var $col = $('<div/>', {
         class: "col-xs-6",
      });

      var item = table[button_name];

      var img = item.image? ('<img src="' + item.image + '"/>'): button_name;
      // create buttons
      var $button= $('<button class="btn btn-default">' + img + '</button><p>'+ button_name +'</p>').mousedown({type:item.type, size:item.size, angle:item.angle}, startBlockAdder )

      $col.append($button);
      $row.append($col);
    }
    target.append($row);
  }

  for (var category in _button_table) {

      var controls = _button_table[category];

      var target = $("#collapse1").find("#"+category).find('.container-fluid');

      for (var option_name in controls.options){

        addRow(option_name, target);
        addRowRadios(controls.options[option_name], target);
      }

      addRowButtons(controls.elements, target)

      // for (var element_type in controls.elements) {
      //   addRow(element_type, target);
      //   addRowButtons(controls.elements[element_type], target)
      // }

  }

  function setShapeParameters(event){
    console.log(event.data.parameters);

    var size  = event.data.parameters.size;
    var cat   = event.data.category;

    if(size){
      for (var i = 0; i < 3; i++) {
        if (size[i] != -1){
          for (button_name in _button_table[cat].elements){
            var button = _button_table[cat].elements[button_name];
            button.size[i] = size[i];
          }
        }
      }
    }
  }

  function startBlockAdder(event){

    var object = {
      type:event.data.type,
      size:event.data.size,
      position:[0,0,0],
      rotation:[0,0,0],
      angle:event.data.angle,
    }

    //delete currently dragged object
    selector.deleteObject(selector.dragged);

    if(selector){
      selector.keep_adding = object;
      selector.addBlock(object);
    }
  }

  // material selection
  /////////////////////
  function selectMaterial(e){
    console.log($(this)[0].selectedIndex);
    if($(this)[0].selectedIndex ==0){
      _materials.cladding.map = textures.aluminium;

    }else{
      _materials.cladding.map = textures.wood

    }

    _materials.cladding.map.wrapS = THREE.RepeatWrapping
    _materials.cladding.map.wrapT = THREE.RepeatWrapping
    _materials.cladding.map.repeat.set(1,1);
    console.log(_materials.cladding.map);
    // scene_geometry.traverse(function(child){
    //   if(child.mesh_object){
    //
    //     // console.log(child.mesh_object);
    //     child.mesh_object.geometry.uvsNeedUpdate = true;
    //     child.mesh_object.material.materials[3];
    //
    //   }
    // });

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
