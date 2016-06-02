

$(function() {
  //document ready

  // view selector
  $( "#view-selector" ).find( "button" ).click(function(e){
    console.log(e.target.value);
    setCameraPosition(e.target.value)
  });
  $( "#view-selector" ).find( "button" ).tooltip()

  //accordion
  function toggleChevron(e) {
      $(e.target)
          .prev('.panel-heading')
          .find("i.indicator")
          .toggleClass('glyphicon-plus-sign glyphicon-minus-sign');
  }
  $('#accordion').on('hidden.bs.collapse', toggleChevron);
  $('#accordion').on('shown.bs.collapse', toggleChevron);

  //////////////
  // dimensions
  //////////////
  var slider_index = {
    depth:2,
    width:0,
    height:1,
  }

  function sliderChange(e){

    var index = slider_index[e.target.name];
    var value = e.target.value;

    applyDim(index, e.target.value);

    var number_input = $('#number-' + e.target.name)[0];
    number_input.value =  clamp(value, parseInt(number_input.min), parseInt(number_input.max) );
  }

  function numberChange(e){
    var index = slider_index[e.target.name];
    var value = e.target.value;

    e.target.value =  clamp(value, parseInt(e.target.min), parseInt(e.target.max) );

    applyDim(index, e.target.value);

    //update slider with number nput value
    $('#slider-' + e.target.name).val(e.target.value);
  }

  $("#collapse1").find('input[type=range]').on('change', sliderChange).on('input', sliderChange);
  $("#collapse1").find('input[type=number]').on('change', numberChange);

  // option checkboxes
  ////////////////////

  // 0:zoutvernevelaar
  // 1:rugsteun
  // 2:aromatherapie
  function addOption(e){
    var index       = e.target.value;
    var boolean_add = e.target.checked;
    var name        = e.target.name;

    config.options[name] = boolean_add;

    if(cabine){
      cabine.setOption(parseInt(index), boolean_add);
    }

    document_edited = true;
  }
  $("#collapse2").find('input[type=checkbox]').on('change', addOption);


  // color options
  ////////////////

  function setColor(id, color){
    colors[id] = color;

    config.colors[id] = color;

    if(cabine){
      cabine.updateColors();
    }
    document_edited = true;
  }

  $("#collapse3").find('button').click( function(e){
    var part = $('#part-selector input:radio:checked').attr('id')

    var color = e.target.style['background-color'];
    console.log(part, color);

    setColor(part, color);


  })







  $("#myform").on("submit", function(e) {
    if($('#myform').valid()){
      //prevent default redirrecting

      cabine.getCellLayout();

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

  $(document.body).on('simple_mode', function(event) {

    // add new description
    $( "#view-selector" ).html(
      "<div style='padding: 5px;'>get a quote for your STAUNIR cabine by selecting your options</div>"
    );

    // hide sliders
    $( "#accordion" ).find( "input[type=range]" ).hide();

  });

  $(document.body).on('normal_mode', function(event) {
    //hide heater input and placeholder screen
    $("#no-configurator").hide();
    $("#heater-input").hide();

  });

})


function clamp(value, min, max){
  return Math.min(Math.max(value, min), max)
}

//apply dimension change to grid
function applyDim(dim_index, value){

  config.dimensions[dim_index] = value

  value = value/100;
  document_edited = true;

  if(cabine){
    // 0:width 1:height 2:length
    cabine.setDim(dim_index, value);
  }
}
