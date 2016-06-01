
function ScrollTimer(controls){

  this.controls       = controls;
  this.timer          = null;
  this.mouse_is_down  = false;

  function disableZoom() {
    controls.enableZoom = false;
    // console.log("disable zoom");
  }

  function resetTimeout(){
    // console.log('reset');
    clearTimeout(this.timer);
    this.timer = setTimeout(disableZoom, 3000);
  }

  function onDocumentMouseDown(event){
    this.mouse_is_down = true;

    if(!controls.enableZoom){
      controls.enableZoom = true;
      resetTimeout()
      // console.log("start zoom");
    }
  }

  function onDocumentMouseUp(event){
    this.mouse_is_down = false;
  }

  function onMouseWheel(event){
    if(controls.enableZoom){
      resetTimeout()
    }
  }
  function onMouseMove(event){
    if(controls.enableZoom && controls.mouse_is_down){
      resetTimeout()
    }
  }

  renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
  renderer.domElement.addEventListener( 'touchstart', onDocumentMouseDown, false );

  renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
  renderer.domElement.addEventListener( 'touchend', onDocumentMouseUp, false );

  renderer.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
  renderer.domElement.addEventListener( 'MozMousePixelScroll', onMouseWheel, false ); // firefox

  renderer.domElement.addEventListener( 'touchmove', onMouseMove, false );
  renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );
}
