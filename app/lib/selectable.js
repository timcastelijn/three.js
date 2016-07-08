/////////////////
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

// try to find specific category and otherwise return first two letters
Selectable.prototype.getSnapAreas = function(intersect_parent){
  if(intersect_parent.snap_areas){
    var category;

    if(intersect_parent.snap_areas[this.type]){
      category = this.type
    }else{
      category = this.type.substring(0,2)
    }

    return intersect_parent.snap_areas[category];
  }
}

// tries to snap the object
Selectable.prototype.snap = function(intersect){

  var intersect_parent = intersect.object.parent;
  var m_index = intersect.object.geometry.faces[intersect.faceIndex].materialIndex;

  // get snap_areas and the id of the intersected face
  var snap_areas = this.getSnapAreas(intersect_parent);
  var patch_id = _patch_table[intersect_parent.type][m_index];

  // console.log(this.fid, snap_areas, patch_id);

  if(snap_areas && snap_areas[patch_id]){
    this.moveToArea(snap_areas[patch_id], intersect)
    this.snapped = true;
    return true;
  }
  this.snapped = false;
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

  // remove from _blocks
  var selected_index = _blocks.indexOf(this);
  _blocks.splice(selected_index, 1)




  delete config.geometry[this.fid];


}



Selectable.prototype.moveToArea = function(snap_area, intersect){


  if (snap_area.position){

    // move object to patch reference point
    var vector = intersect.object.parent.localToWorld(new THREE.Vector3().fromArray(snap_area.position) );
    this.position.copy( vector  );

    //rotate if possible
    var vec_rot = new THREE.Vector3().fromArray(snap_area.rotation).add(intersect.object.parent.rotation);
    this.rotation.set(vec_rot.x, vec_rot.y, vec_rot.z);

    console.log(vector, vec_rot);

    this.overlap = this.selector.bboxOverLap()
    return;

  } else {

    var local_intersection = intersect.object.parent.worldToLocal(intersect.point).toArray()

    var snap_point = [];
    for (var i = 0; i < local_intersection.length; i++) {

      var temp = Math.round( local_intersection[i] / 0.3 + 0.001);
      snap_point[i] = temp * 0.3 + snap_area.offset[i];

      // clamp value within snap bounds


      snap_point[i] = Math.min(Math.max(snap_point[i], snap_area.position_min[i]), snap_area.position_max[i])

    }

    var position = intersect.object.parent.localToWorld(new THREE.Vector3().fromArray( snap_point ) );

    this.position.copy(position);

    //rotate if possible
    if(snap_area.rotation){
      var vec_rot = new THREE.Vector3().fromArray(snap_area.rotation).add(intersect.object.parent.rotation);
      this.rotation.set(vec_rot.x, vec_rot.y, vec_rot.z);
    }

    this.overlap = this.selector.bboxOverLap();
    return;
  }
}
