

$(function() {
  //document ready
  $( "#view-selector" ).find( "button" ).click(function(e){
    console.log(e.target.value);
    setCameraPosition(e.target.value)
  });


  $( "#view-selector" ).find( "button" ).tooltip()



  var color_presets = {
    modern:{interior:"#ffffff", exterior:"#333333", floor:"#C28B6B"},
    gek:{interior:"#969690", exterior:"#F2E16F", floor:"#969690", backrest:"#ffffff"},
  }

  $('#sel1').on("change", function (event) {
    var preset = color_presets[event.target.value]
    for(target in preset){
      setColor(target, preset[target]);
    }
  });

  //colorselectors
  $('#colorselector1').colorselector({
      callback: function (value, color, title) {
        setColor('exterior', color);
      }
  });
  $('#colorselector2').colorselector({
      callback: function (value, color, title) {
        setColor('interior', color);
      }
  });

  $('#colorselector3').colorselector({
        callback: function (value, color, title) {
          setColor('floor', color);
        }
  });

  function handleChange(input) {
    if (input.value < parseInt(input.min)) input.value = parseInt(input.min);
    if (input.value > parseInt(input.max)) input.value = parseInt(input.max);
  }

  function toggleChevron(e) {
      $(e.target)
          .prev('.panel-heading')
          .find("i.indicator")
          .toggleClass('glyphicon-plus-sign glyphicon-minus-sign');
  }
  $('#accordion').on('hidden.bs.collapse', toggleChevron);
  $('#accordion').on('shown.bs.collapse', toggleChevron);

  function defineHeaterPositions(number){
    var slots = cabine.walls[2].n;
    var array = [];

    if (number>slots){
      number = slots;
      $('#numberInputHeaters').val(slots);
    }
    array.push(0);
    if (number > 0 ) {
      //add element 0
      for(var i=1; i< number; i++){
          array.push(Math.round(i*slots/number));
      }
    }
    console.log(array);
  }
})
