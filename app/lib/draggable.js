

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
      //delete key:
      event.preventDefault();
      selector.deleteObject();
      break;
    case 46:
      selector.deleteObject();
      break;
    case 27:
      selector.forgetSelection();
      selector.stopAdding();
      break
    case 37:
      selector.rotateObject("CW");
      break
    case 39:
      selector.rotateObject("CCW");
      break
    default:
  }

}

Selector.prototype.deleteObject=function(object){

  if (this.selected){
    object = this.selected;
    this.selected = null;
  }
  if(object){
    object.delete();

    price -= block_files[object.type].price;
    updatePriceGui()
  }else{
    console.log('nothing selected');
  }
}

Selector.prototype.rotateObject=function(dir){
  if (this.selected){

    //rotate selected object
    var rotation  = (dir=="CW")?  -Math.PI/2: Math.PI/2;
    this.selected.rotation.y += rotation;

    //update config file
    config.geometry[this.selected.fid].rotation += (rotation /Math.PI * 180);

  } else if(this.dragged){
    //rotate selected object
    var rotation  = (dir=="CW")?  -Math.PI/2: Math.PI/2;
    this.dragged.rotation.y += rotation;
  } else{
    console.log('nothing selected');
  }
}

Selector.prototype.add=function(object){
  this.selectables.push(object)
}

Selector.prototype.moveDraggedObject = function(){

  for(var i=0; i<this.snap_objects.length;i++){
    this.snap_objects[i].parent.setMaterial('basic');
  }

  var intersects = this.raycaster.intersectObjects( this.snap_objects );
  if ( intersects.length > 0 ) {
    // intersected object change
    // this.defineSnapPoint(intersects[0], this.parent_lookup[intersects[0].object.id]);
    this.dragged.snap(intersects[0])
  } else {

    this.dragged.moveOverPlane();
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

  var bb      =  new THREE.Box3().setFromObject(this.dragged)//.mesh_object.geometry.boundingBox;
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

  this.selected = intersect.object.parent;

  console.log(this.selected);

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
          }else{
            this.forgetSelection()
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
  var fid = this.dragged.fid;

  console.log(this.dragged, fid);
  config.geometry[fid].position = [this.dragged.position.x, this.dragged.position.y, this.dragged.position.z];
  config.geometry[fid].rotation = [0, this.dragged.rotation.y/Math.PI *180, 0];

}



Selector.prototype.addBlock=function(object){

    var block = addObject(object);

    this.selected = block;
    this.dragged = block;
    this.mouse_down = true;
    this.intersected = block;
    this.setSnapObjects()
    this.calculateBBVolumes()
}
Selector.prototype.stopAdding=function(){
    this.keep_adding = null;
    this.deleteObject(this.dragged);
    this.dragged.overlap = false;
    this.dragged = null;
}

Selector.prototype.onMouseUp=function(event){
  this.mouse_down = false;
  this.controls.enabled = true;

  // only if object was dragged
  if ( this.dragged ) {
    if (this.dragged.overlap){
      // placement failed
      if (this.dragged.previous_position){
        this.dragged.position.copy(  this.dragged.previous_position );
      }else{
        return
      }
    } else {
      // placement succesful
      if(this.keep_adding){
        this.addBlock(this.keep_adding);
      }
    }

    this.updateConfig()
    this.dragged.overlap = false;
    this.dragged = null;
  }

  //reset to basic material
  for(var i =0; i<this.snap_objects.length; i++){
    this.snap_objects[i].parent.setMaterial('basic')
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
function Selectable(){
  THREE.Object3D.call( this );

  this.material={}
  this.material.basic = new THREE.MeshPhongMaterial( { color: 0xffffff, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } )
  this.material.selected = new THREE.MeshBasicMaterial({color:"#0000ff", opacity: 0.5, transparent: true})
  this.material.prohibited = new THREE.MeshBasicMaterial({color:"#0000ff", opacity: 0.5, transparent: true})


}

Selectable.prototype = new THREE.Object3D();
Selectable.prototype.constructor = Selectable;

Selectable.prototype.setMaterial = function(key){
  for (var i = 0; i < this.children_meshes.length; i++) {
    this.children_meshes[i].material = this.material[key];
  }
}

Selectable.prototype.setSelector = function(mesh_object, selector){
  this.selector = selector;

  this.children_meshes = getChildMeshes(this);


  //traverse over children and add parent to draggables under child identifier
  this.selector.selectables.push(mesh_object);

}

Selectable.prototype.getSnapAreas = function(intersect_parent){
  var category;
  if(intersect_parent.snap_areas[this.type]){
    category = this.type
  }else{
    category = this.type.substring(0,2)
  }

  return intersect_parent.snap_areas[category];
}
Selectable.prototype.snap = function(intersect){


  var intersect_parent = intersect.object.parent;
  var m_index = intersect.object.geometry.faces[intersect.faceIndex].materialIndex;

  // get snap_areas and the id of the intersected face
  var snap_areas = this.getSnapAreas(intersect_parent);
  var patch_id = _patch_table[intersect_parent.type][m_index];

  console.log(patch_id);

  if(snap_areas && snap_areas[patch_id]){

    this.moveToArea(snap_areas[patch_id], intersect)
    return true;
  }
  this.position.copy(intersect.point)

}

Selectable.prototype.moveOverPlane = function(){

  // else move over plane
  var intersects = this.selector.raycaster.intersectObject( this.selector.plane );
  if ( intersects.length > 0 ) {

    // this.dragged.moveTo(intersects[ 0 ].point);
    this.position.copy( intersects[ 0 ].point );

  }
}

Selectable.prototype.delete = function(){

  scene_geometry.remove(this);

  // remove all children of selected from selectables
  for(var i =0; i<this.children_meshes.length; i++){
    var selected_index = this.selector.selectables.indexOf(this.children_meshes[i]);
    this.selector.selectables.splice(selected_index, 1)
  }

  delete config.geometry[this.fid];


}



Selectable.prototype.moveToArea = function(snap_area, intersect){


  if (snap_area.position){

    // move object to patch reference point
    var vector = intersect.object.parent.localToWorld(new THREE.Vector3().fromArray(snap_area.position) );
    this.position.copy( vector  );

    //rotate if possible
    var vec_rot = new THREE.Vector3().fromArray(snap_area.rotation).add(intersect.object.parent.rotation);
    // this.rotation.copy(vec_rot);
    this.rotation.set(vec_rot.x, vec_rot.y, vec_rot.z);

    console.log(vector, vec_rot);

    this.overlap = this.selector.bboxOverLap()
    return;

  } else {

    var local_intersection = intersect.object.parent.worldToLocal(intersect.point).toArray()

    var snap_point = [];
    for (var i = 0; i < local_intersection.length; i++) {

      var temp = Math.floor( local_intersection[i] / 0.3 + 0.001);
      snap_point[i] = temp * 0.3 + snap_area.offset[i];
    }

    var position = intersect.object.parent.localToWorld(new THREE.Vector3().fromArray( snap_point ) );

    this.position.copy(position);
    this.rotation.y = intersect.object.parent.rotation.y + snap_area.rotation;

    this.overlap = this.selector.bboxOverLap();
    return;
  }
}
