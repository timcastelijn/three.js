
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


// SELECTOR class
////////////////
function Selector(camera, controls){
  this.selectables   = [];
  this.parent_lookup   = [];
  this.intersected  = null;
  this.dragged      = null;
  this.selected     = null;
  this.snap_objects = [];
  this.camera       = camera;
  this.controls     = controls;

  this.raycaster    = new THREE.Raycaster();
  this.mouse        = new THREE.Vector2();

  this.materials={
    selected: new THREE.MeshBasicMaterial( { color: 0x0000ff, opacity: 0.5, transparent: true } ),
    prohibited: new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } ),
  }

  // rollOverGeo = new THREE.BoxGeometry( 0.2, 2.5, 0.3 );
  // rollOverGeo.applyMatrix( new THREE.Matrix4().makeTranslation(0, 2.5/2, 0) );
  // rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
  // this.rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
  // scene.add( this.rollOverMesh );

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
  document.addEventListener( 'keydown', onDocumentKeyDown, false );

}
function onDocumentMouseDown( event ) {

  event.preventDefault();
  selector.onMouseDown(event);

}

function onDocumentMouseUp( event ) {
  event.preventDefault();
  selector.onMouseUp(event);
}

function onDocumentMouseMove( event ) {
  event.preventDefault();
  selector.onMouseMove(event);
}

function onDocumentKeyDown( event ) {
  switch( event.keyCode ) {
    case 8:
      selector.deleteObject();
      break;
    case 46:
      selector.deleteObject();
      break;
    case 27:
      selector.forgetSelection();
      break
    default:
  }

}

Selector.prototype.deleteObject=function(object){
  if (this.selected){

    scene_geometry.remove(this.selected);

    // remove all children of selected from selectables
    for(var i =0; i<this.selected.children_meshes.length; i++){
      var selected_index = this.selectables.indexOf(this.selected.children_meshes[i]);
      this.selectables.splice(selected_index, 1)
    }

    delete config.geometry[this.selected.object.fid];

    price -= block_files[this.selected.object.type].price;
    updatePriceGui()
    this.selected = null;
  } else{
    console.log('nothing selected');
  }
}

Selector.prototype.add=function(object){
  this.selectables.push(object)
}

Selector.prototype.moveDraggedObject = function(){

  for(var i=0; i<this.snap_objects.length;i++){
    this.snap_objects[i].material = new THREE.MeshPhongMaterial( { color: 0xffffff, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
  }

  var intersects = this.raycaster.intersectObjects( this.snap_objects );
  if ( intersects.length > 0 ) {
    // intersected object change

    this.defineSnapPoint(intersects[0], this.parent_lookup[intersects[0].object.id]);
  } else {

    // else move over plane
    var intersects = this.raycaster.intersectObject( this.plane );
    if ( intersects.length > 0 ) {

      // this.dragged.moveTo(intersects[ 0 ].point);
      this.dragged.position.copy( intersects[ 0 ].point );
    }
    return;
  }
}

Selector.prototype.startDrag=function(){
  // only start dragging when moving mouse with button down

  if (this.mouse_down && this.intersected) {
    if(this.selected && !this.dragged){
      // make selected object the dragged object
      this.dragged = this.selected;
      this.forgetSelection();
    }
  }
}

Selector.prototype.onMouseMove=function(event){

  this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  this.raycaster.setFromCamera( this.mouse, this.camera );

  this.startDrag();

  if ( this.dragged ) {
    this.moveDraggedObject();
    return;
  }

  //else
  var intersects = this.raycaster.intersectObjects( this.selectables );
  if ( intersects.length > 0 ) {
    // intersected object changes
    if ( this.intersected != intersects[ 0 ].object ) {
      this.intersected = intersects[ 0 ].object;
    }
    container.style.cursor = 'pointer';
  } else {
    this.intersected = null;
    container.style.cursor = 'auto';
  }
}

Selector.prototype.updateDebugSpheres = function(bb){
  this.dragged.sphere_min.position.set(bb.min.x, bb.min.y, bb.min.z);
  this.dragged.sphere_max.position.set(bb.max.x, bb.max.y, bb.max.z);
  this.dragged.sphere_min.visible = true;
  this.dragged.sphere_max.visible = true;
}

Selector.prototype.bboxOverLap=function(){

  var bb      =  new THREE.Box3().setFromObject(this.dragged.object)//.mesh_object.geometry.boundingBox;
  var others  = this.snap_objects;

  // this.updateDebugSpheres(bb)

  for(var i =0; i<others.length; i++){

    var bb2 = others[i].bb;

    var volume = Math.max(Math.min(bb2.max.x, bb.max.x)-Math.max(bb2.min.x, bb.min.x),0)
    * Math.max(Math.min(bb2.max.y,bb.max.y)-Math.max(bb2.min.y,bb.min.y),0)
    * Math.max(Math.min(bb2.max.z,bb.max.z)-Math.max(bb2.min.z,bb.min.z),0)

    if (volume>0.1){
      this.snap_objects[i].material = this.materials.prohibited;
      return true;
    };
  }
  return false
}

Selector.prototype.defineSnapPoint=function(intersect, parent){
  // console.log(intersect.faceIndex);

  //iterate over faceIndexes
  for (index in parent.object.patches) {
    if((index) == intersect.faceIndex){

      // test wether object is allowed to snap on patch
      if( parent.object.patches[index].types.indexOf(this.dragged.object.type)> -1 ){

        // move object to patch reference point
        var vector = parent.object.localToWorld(new THREE.Vector3().copy(parent.object.patches[index].position) )
        this.dragged.position.copy( vector  );


        //rotate if possible
        var rot_y = (parent.object.patches[index].rotation)?  parent.object.patches[index].rotation: 0;

        this.dragged.rotation.y =  parent.rotation.y + rot_y

        this.dragged.overlap = this.bboxOverLap()
        return;
      }
    }
  }
  this.dragged.position.copy(intersect.point)
}

Selector.prototype.setSnapObjects = function(){
  //clone array
  this.snap_objects = this.selectables.slice(0);

  // remove all children of selected from snap objects
  for(var i =0; i<this.selected.children_meshes.length; i++){
    var selected_index = this.snap_objects.indexOf(this.selected.children_meshes[i]);
    this.snap_objects.splice(selected_index, 1)
  }
}


Selector.prototype.calculateBBVolumes=function(event){
  //for each snap object, calculate bb
  for(var i = 0; i<this.snap_objects.length; i++){
    var obj   = this.snap_objects[i]

    this.snap_objects[i].bb = new THREE.Box3().setFromObject(obj);

    // var bb      =   new THREE.BoundingBoxHelper( obj, 0x000000 );
    // bb.update();
    // scene.add(bb)
  }
}



Selector.prototype.forgetSelection = function(){
  if (this.selected) {
    this.selected.setMaterial("basic")
    this.selected = null;
  }
}

Selector.prototype.selectObject = function(intersect){
  //forget previous selection
  this.forgetSelection();

  if(this.parent_lookup[intersect.object.id]){
    this.selected = this.parent_lookup[intersect.object.id];
  } else {
    this.selected = intersect.object;
  }

  this.selected.setMaterial('selected')
}


Selector.prototype.onMouseDown=function(event){

  switch ( event.button ) {
    case 0: // left
        if(!this.dragged){
          //ready to select an object
          this.mouse_down = true;
          this.raycaster.setFromCamera( this.mouse, this.camera );

          var intersects = this.raycaster.intersectObjects( this.selectables );

          if ( intersects.length > 0 ) {

            this.controls.enabled = false;

            this.selectObject(intersects[0]);

            this.selected.previous_position = new THREE.Vector3().copy( this.selected.position);

            this.setSnapObjects()
            this.calculateBBVolumes()

            container.style.cursor = 'move';
          }
        }
        break;
    case 1: // middle
        break;
    case 2: // right
        break;
  }
}

Selector.prototype.updateConfig=function(event){
  var fid = this.dragged.object.fid;

  config.geometry[fid].position = [this.dragged.position.x, this.dragged.position.y, this.dragged.position.z];
  config.geometry[fid].rotation = [0, this.dragged.rotation.y/Math.PI *180, 0];

}

Selector.prototype.onMouseUp=function(event){
  this.mouse_down = false;
  this.controls.enabled = true;

  if ( this.dragged ) {
    if (this.dragged.overlap){
      this.dragged.position.copy(  this.dragged.previous_position );
    }

    this.updateConfig()
    this.dragged.overlap = false;
    this.dragged = null;
  }

  for(var i =0; i<this.snap_objects.length; i++){
    this.snap_objects[i].material = new THREE.MeshPhongMaterial( { color: 0xffffff, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
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

//Selectable class
/////////////////
function Selectable(object, selector){
  THREE.Object3D.call( this );

  this.object = object
  this.add(this.object);

  this.name = object.name

  this.materials={
    basic:this.object.mesh_object.material,
    selected:selector.materials.selected,
    prohibited:selector.materials.prohibited,
  }

  this.sphere_min = new THREE.Mesh( new THREE.SphereGeometry( 0.05, 16, 8 ), new THREE.MeshBasicMaterial( { color: 0xff0040 } ) );
  scene.add( this.sphere_min );
  this.sphere_min.visible =false
  this.sphere_max = new THREE.Mesh( new THREE.SphereGeometry( 0.05, 16, 8 ), new THREE.MeshBasicMaterial( { color: 0xff0040 } ) );
  scene.add( this.sphere_max );
  this.sphere_max.visible =false

  // this.bbox = new THREE.BoundingBoxHelper( object.mesh_object, 0xff0000 );
  // this.bbox.update();
  // this.add( this.bbox );

  //traverse over children and add parent to draggables under child identifier
  var children = getChildMeshes(this);
  this.children_meshes = children;
  for(var i = 0; i<children.length; i++){
    selector.selectables.push(children[i]);
    selector.parent_lookup[children[i].id] = this;
  }

}

Selectable.prototype = new THREE.Object3D();
Selectable.prototype.constructor = Selectable;

Selectable.prototype.setMaterial = function(key){
  for(var i =0; i<this.children_meshes.length; i++){
    this.children_meshes[i].material = this.materials[key];
  }
}
