

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
  // this.plane.material.visible = false;
  scene.add( this.plane );

  //create screen-intersection plane
  this.screen_plane = new THREE.Plane();
  // rotate plane to xz orientation
  // this.screen_plane.material.visible = false;

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
    this.forgetSelection();
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
  if (this.dragged){
    console.log(this.dragged.rotation)
    //rotate selected object
    var rotation  = (dir=="CW")?  -Math.PI/2: Math.PI/2;
    this.dragged.rotation.y += rotation;
    if(this.keep_adding){
      this.keep_adding.rotation[1] = this.dragged.rotation.y
    }
  } else{
    console.log('nothing selected');
  }
}

Selector.prototype.add=function(object){
  this.selectables.push(object)
}

Selector.prototype.moveDraggedObject = function(){
  container.style.cursor = 'move';


  for(var i=0; i<this.snap_objects.length;i++){
    this.snap_objects[i].parent.setMaterial('basic');
  }

  var intersects = this.raycaster.intersectObjects( this.snap_objects );
  if ( intersects.length > 0 ) {
    // intersected object change
    // this.defineSnapPoint(intersects[0], this.parent_lookup[intersects[0].object.id]);

    this.dragged.snap(intersects[0]);
  } else {

    this.dragged.moveOverPlane();
    return;
  }
}


Selector.prototype.highlightPatches=function(boolean){

  // check the dragged type
  if(boolean){

    console.log('highlight the patches');
    this.highlights = []

    for (var i = 0; i < _blocks.length; i++) {
      // if (_blocks[i] != this.dragged){
        var block = _blocks[i];

          var category = this.dragged.type.substring(0,2)
          if(block.snap_areas && block.snap_areas[this.dragged.type]){
            category = this.dragged.type;
          }

          // console.log(category, block.patch_materials);
          if(block.patch_materials && block.patch_materials[category]){

            block.patch_materials[category].color.set("#E1E6B9")
            this.highlights.push(block.patch_materials[category].color  )
          }
        }
      // }


  }else{
    if(!this.highlights) return;

    console.log('unhighlight the patches');

    for (var j = 0; j <this.highlights.length; j++) {
      this.highlights[j].set("#ffffff");

    }
  }
}



Selector.prototype.onMouseMove=function(event){

  this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  this.raycaster.setFromCamera( this.mouse, this.camera );


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

      this.screen_plane.setFromNormalAndCoplanarPoint(
        this.camera.getWorldDirection( this.screen_plane.normal ),
        this.intersected.position );
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

Selector.prototype.meshOverlap = function(other){

  var m1      =  this.dragged.mesh_object

  // this.updateDebugSpheres(bb)


  // console.log(m1, other);
  return meshMeshIntersect(m1, other)


}

function meshMeshIntersect(m1, m2){
  var vertex_names = ['a', 'b', 'c'];

  for (var i = 0; i < m1.geometry.faces.length; i++) {
    var vertex_indices = m1.geometry.faces[i]

    // get global face A vertexes
    var face_a = []
    for (var j = 0; j < 3; j++) {
      var index = vertex_indices[vertex_names[j]]
      face_a[j] = m1.parent.localToWorld( m1.geometry.vertices[index] )
    }
    // console.log(face_a);

    for (var j = 0; j < m2.geometry.faces.length; j++) {


      var vertex_indices_b = m2.geometry.faces[j]

      // get global face B vertexes
      var face_b = []
      for (var k = 0; k < 3; k++) {
        var name = vertex_indices_b[vertex_names[k]]
        face_b[k] = m2.parent.localToWorld( m2.geometry.vertices[name] )
      }

      // intersect faceA with faceB
      // console.log(face_a, face_b);
      if ( triIntersect(face_a, face_b)){
        console.log('true');
        return true;
      }

    }
  }

  return false;
}

function triIntersect(t1, t2){


  var n2 = t2[1].sub(t2[0]).cross( t2[2].sub(t2[0]) )
  var d2 = n2.negate().dot(t2[0])

  // calculate distance to plane
  var dv1=[]
  for (var i = 0; i < 3; i++) {
    dv1[i] = n2.dot(t1[i]) + (d2)
  }

  // if dv1 all signs are equal and not 0 triangle lies completely on one side of the plane, there is no intersection
  dv10dv11 = dv1[0] * dv1[1];
  dv10dv12 = dv1[0] * dv1[2];

  // same sign on all of them + not equal 0 ?
  if (dv10dv11 > 0.0 && dv10dv12 > 0.0){
      // no intersection occurs
      return false;
  }

  var n1 = t1[1].sub(t1[0]).cross( t1[2].sub(t1[0]) )
  var d1 = n1.negate().dot(t1[0])

  // calculate distance to plane
  var dv2=[];
  for (var i = 0; i < 3; i++) {
    dv2[i] = n1.dot(t1[i]) + d1
  }

  // if dv1 all signs are equal and not 0 triangle lies completely on one side of the plane, there is no intersection
  dv20dv21 = dv2[0] * dv2[1];
  dv20dv22 = dv2[0] * dv2[2];

  // if all signs are positive, triangle lies on outside

  // same sign on all of them + not equal 0 ?
  if (dv20dv21 > 0.0 && dv20dv22 > 0.0){
      // no intersection occurs
      return false;
  }



  // compute direction of intersection line
  dd = n1.cross( n2);

  // compute and index to the largest component of D
  max = Math.abs(dd.X);
  index = "X";
  bb = Math.abs(dd.Y);
  cc = Math.abs(dd.Z);
  if (bb > max) { max = bb; index = "Y"; }
  if (cc > max) { max = cc; index = "Z"; }


  // this is the simplified projection onto L
  vp0 = t1[0][index];
  vp1 = t1[1][index];
  vp2 = t1[2][index];

  up0 = t2[0][index];
  up1 = t2[0][index];
  up2 = t2[0][index];

  t11 = vp0 + ( vp1 - vp0 ) * ( dv1[0] / (dv1[0] - dv1[1]) );
  t12 = vp1 + ( vp2 - vp1 ) * ( dv1[1] / (dv1[1] - dv1[2]) );
  t21 = up0 + ( up1 - up0 ) * ( dv2[0] / (dv2[0] - dv2[1]) );
  t22 = up1 + ( up2 - up1 ) * ( dv2[1] / (dv2[1] - dv2[2]) );

  if ((t21>t11 && t21 <t12 )||( t22>t11 && t22 <t12 )){
    // return true
  }

  return true;
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
      return this.snap_objects[i];
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
    this.snap_objects.splice(selected_index, 1);
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
  guiLog()

  if (this.selected) {
    this.selected.setMaterial("basic")
    this.selected = null;
  }
}

Selector.prototype.selectObject = function(intersect){


  //forget previous selection
  this.forgetSelection();


  this.selected = intersect.object.parent;

  guiLog('selected "' + this.selected.fid+ '".<br> press "Escape" to clear selection, "Delete" to delete object');

  // console.log(this.selected);

  this.selected.setMaterial('selected')
}


Selector.prototype.getSelection=function(){
  //ready to select an object
  this.raycaster.setFromCamera( this.mouse, this.camera );

  var intersects = this.raycaster.intersectObjects( this.selectables );

  if ( intersects.length > 0 ) {

    this.controls.enabled = false;

    this.selectObject(intersects[0]);

    this.selected.previous_position = new THREE.Vector3().copy( this.selected.position);

    this.setSnapObjects()

    this.calculateBBVolumes()

  }else{
    this.forgetSelection()
  }
}


Selector.prototype.tryDrag = function() {

  if(this.mouse_down && this.selected ){
    this.dragged = this.selected;
    this.forgetSelection()

    this.dragged.scale.set(1.1 ,1.1 ,1.1 );
    setTimeout( ()=>{ this.dragged.scale.set(1,1,1);     }, 20);
  }
}

Selector.prototype.onMouseDown=function(event){

  switch ( event.button ) {
    case 0: // left
        this.mouse_down = true;

        if(!this.dragged){
          this.getSelection()

          clearTimeout(this.timer)
          this.timer = setTimeout( ()=>{console.log('trydrag'); this.tryDrag() }, 1000);
        }
        break;
    case 1: // middle
        break;
    case 2: // right
        break;
  }
}

Selector.prototype.updateConfig=function(){
  var fid = this.dragged.fid;
  config.geometry[fid].position = [this.dragged.position.x, this.dragged.position.y, this.dragged.position.z];

  var rotation = this.dragged.rotation.toArray()
  config.geometry[fid].rotation = [rotation[0]/Math.PI *180, rotation[1]/Math.PI *180, rotation[2]/Math.PI *180];

}



Selector.prototype.addBlock=function(object){

    var block = addObject(object);

    this.selected = block;
    this.dragged = block;
    this.intersected = block;
    this.setSnapObjects()

    this.highlightPatches(true);
    this.calculateBBVolumes()
}
Selector.prototype.stopAdding=function(){
    this.highlightPatches(false);

    this.keep_adding = null;
    if (this.dragged){
      this.deleteObject(this.dragged);
      this.dragged.overlap = false;
      this.dragged = null;
    }
}

Selector.prototype.stopDrag=function(){


  if (this.dragged.overlap || !this.dragged.snapped ){
    // placement failed, move back to previously known position
    if (this.dragged.previous_position){
      this.dragged.position.copy(  this.dragged.previous_position );
    }else{
      // no previous_position, keep object in hand
      return
    }
  } else {
    // placement succesful, update registry and prepare to add new block
    this.updateConfig()

    if(this.keep_adding){
      this.addBlock(this.keep_adding);
      return
    }


    this.dragged.overlap = false;
  }

  this.dragged = null;


}

Selector.prototype.onMouseUp=function(event){
  this.mouse_down = false;
  this.controls.enabled = true;

  // reset drag timer
  clearTimeout(this.timer)

  // only if object was dragged
  if ( this.dragged ) {
    this.stopDrag();
  }

  //reset snap objects to basic material
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
