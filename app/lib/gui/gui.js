$(function() {
  
  //document ready
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
          .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
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
