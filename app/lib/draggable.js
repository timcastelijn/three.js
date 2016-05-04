
// DRAGGER class
////////////////
function Dragger(camera, controls){
  this.draggables   = [];
  this.plane;
  this.intersected  = null;
  this.dragged      = null;
  this.camera       = camera;
  this.controls     = controls;

  this.raycaster    = new THREE.Raycaster();
  this.mouse        = new THREE.Vector2();
}

Dragger.prototype.onMouseMove(event){
  event.preventDefault();

  this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  this.raycaster.setFromCamera( this.mouse, this.camera );

  if ( this.dragged ) {
    var intersects = this.raycaster.intersectObject( this.plane );
    if ( intersects.length > 0 ) {
      this.dragged.position.copy( intersects[ 0 ].point );
    }
    return;
  }

  //else
  var intersects = raycaster.intersectObjects( this.draggables );
  if ( intersects.length > 0 ) {
    if ( this.intersected != intersects[ 0 ].object ) {
      // highlight next intersected object

      if ( this.intersected ) this.intersected.material.color.setHex( this.intersected.currentHex );
      this.intersected = intersects[ 0 ].object;
      this.intersected.currentHex = this.intersected.material.color.getHex();
    }
    container.style.cursor = 'pointer';
  } else {
    // unhighligh and forget intersected

    if ( this.intersected ) this.intersected.material.color.setHex( this.intersected.currentHex );
    this.intersected = null;
    container.style.cursor = 'auto';
  }
}

Dragger.prototype.onMouseDown(event){
  event.preventDefault();

  this.raycaster.setFromCamera( this.mouse, this.camera );

  var intersects = this.raycaster.intersectObjects( this.draggables );

  if ( intersects.length > 0 ) {

    this.controls.enabled = false;

    this.dragged = intersects[ 0 ].object;

    var intersects = this.raycaster.intersectObject( this.plane );

    if ( intersects.length > 0 ) {

      this.dragged.position.copy(intersects.point);

    }

    container.style.cursor = 'move';
  }
}

Dragger.prototype.onMouseUp(event){

  event.preventDefault();

  this.controls.enabled = true;

  if ( this.intersected ) {

    this.dragged = null;

  }
  container.style.cursor = 'auto';
}

//Draggable class
/////////////////
function Draggable(dragger){
  THREE.Object3D.call( this );



  // add object to the dragger
  dragger.draggables.push(this);
}

Cell.prototype = new THREE.Object3D();
Cell.prototype.constructor = Cell;
