
// DRAGGER class
////////////////
function Dragger(camera, controls){
  this.draggables   = [];
  this.parent_lookup   = [];
  this.intersected  = null;
  this.dragged      = null;
  this.camera       = camera;
  this.controls     = controls;

  this.raycaster    = new THREE.Raycaster();
  this.mouse        = new THREE.Vector2();

  //create intersection plane
  this.plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 20, 20, 8, 8 ),
    new THREE.MeshBasicMaterial( { visible: true, wireframe: true } )
  );
  // rotate plane to xz orientation
  this.plane.rotation.x = Math.PI * -0.5;
  this.plane.material.visible = false;
  scene.add( this.plane );

  renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
  renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
  renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

}
function onDocumentMouseDown( event ) {

  event.preventDefault();
  dragger.onMouseDown(event);

}

function onDocumentMouseUp( event ) {
  event.preventDefault();
  dragger.onMouseUp(event);
}

function onDocumentMouseMove( event ) {
  event.preventDefault();
  dragger.onMouseMove(event);
}

Dragger.prototype.add=function(object){
  this.draggables.push(object)
}
Dragger.prototype.onMouseMove=function(event){

  this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  this.raycaster.setFromCamera( this.mouse, this.camera );

  if ( this.dragged ) {
    var intersects = this.raycaster.intersectObject( this.plane );
    if ( intersects.length > 0 ) {

      this.dragged.moveTo(intersects[ 0 ].point);
      // this.dragged.position.copy( intersects[ 0 ].point );
    }
    return;
  }

  //else
  var intersects = this.raycaster.intersectObjects( this.draggables );
  if ( intersects.length > 0 ) {
    // intersected object changes
    if ( this.intersected != intersects[ 0 ].object ) {

      // restore last intersected color
      if ( this.intersected ) this.intersected.material.color.set( this.originalColor );

      // highlight next intersected object
      this.intersected = intersects[ 0 ].object;
      this.originalColor = this.intersected.material.color.getHex();
      this.intersected.material.color.set("#ff0000");

    }
    container.style.cursor = 'pointer';
  } else {
    // unhighligh and forget intersected

    if ( this.intersected ) this.intersected.material.color.set( this.originalColor );
    this.intersected = null;
    container.style.cursor = 'auto';
  }
}

Dragger.prototype.onMouseDown=function(event){

  this.raycaster.setFromCamera( this.mouse, this.camera );

  var intersects = this.raycaster.intersectObjects( this.draggables );

  if ( intersects.length > 0 ) {

    this.controls.enabled = false;

    if(this.parent_lookup[intersects[0].object.id]){

      this.dragged = this.parent_lookup[intersects[0].object.id];

    } else {
      this.dragged = intersects[ 0 ].object;
    }
    container.style.cursor = 'move';
  }
}

Dragger.prototype.onMouseUp=function(event){


  this.controls.enabled = true;

  if ( this.intersected ) {

    this.dragged = null;

  }
  container.style.cursor = 'auto';
}

function getChildMeshes(object){
  var child_array = [];

  function iterate(object, child_array){
    for(var i = 0; i < object.children.length; i++){
      var child = object.children[i];
      if (child instanceof THREE.Mesh) {
        child_array.push(child)
      }
      if (child.children.length > 0) {
        iterate(child, child_array);
      }
    }
  }

  iterate(object, child_array);
  return child_array
}

//Draggable class
/////////////////
function Draggable(object, dragger){
  THREE.Object3D.call( this );

  this.add(object);

  //traverse over children and add parent to draggables under child identifier
  var children = getChildMeshes(this);

  for(var i = 0; i<children.length; i++){
    dragger.draggables.push(children[i]);
    dragger.parent_lookup[children[i].id] = this;
  }

  // add object to the dragger
  dragger.draggables.push(this);
}

Draggable.prototype = new THREE.Object3D();
Draggable.prototype.constructor = Draggable;

Draggable.prototype.moveTo=function( target){
  var pos = new THREE.Vector3(0,0,0);
  pos.x = this.dof.x * target.x
  pos.y = this.dof.y * target.y
  pos.z = this.dof.z * target.z

  this.position.copy( pos );

  cabine.setWidth(pos.x - 1 + 1.24)
}
