//CELL Class
function Cell(size, flip){
  THREE.Object3D.call( this );

  this.width  = size[0];
  this.height = size[1];
  this.flip   = flip;

  this.initial_height = this.height;
  this.initial_width = this.width;

  this.interior_width   = size[0]-CELL_CREASE;
  this.interior_height  = size[1]-CELL_CREASE

  var face_thickness = 0.5 * size[2];
  if(this.flip == -1){
    this.rotation.set(0,Math.PI,0);
  }
  var geometry = new THREE.BoxGeometry( size[0], size[1], face_thickness );

  // offset pivot to corner
  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( this.flip * this.width / 2, size[1] / 2 , face_thickness/2 + size[2] /2) );

  this.mesh_exterior = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: getColor("exterior") } ) );

  this.add(this.mesh_exterior);


  var geometry2 = new THREE.BoxGeometry( this.interior_width, this.interior_height, face_thickness );

  // offset pivot to corner
  geometry2.applyMatrix( new THREE.Matrix4().makeTranslation( this.flip * this.interior_width / 2, this.interior_height / 2 , face_thickness/2  ) );


  this.mesh_interior_clad = new THREE.Mesh( geometry2, new THREE.MeshLambertMaterial( { color: getColor('interior') } ) );
  this.mesh_interior_clad.position.set(CELL_CREASE/2, CELL_CREASE/2 , 0);
  this.mesh_interior = this.mesh_interior_clad


  this.add(this.mesh_interior);

  if(SHADOWS_ENABLED){
    this.mesh_exterior.castShadow = true
    this.mesh_exterior.receiveShadow = true
    this.mesh_interior.castShadow = true
    this.mesh_interior.receiveShadow = true
  }

}
Cell.prototype = new THREE.Object3D();
Cell.prototype.constructor = Cell;

Cell.prototype.setWidth = function(value){

  // value = value >CELL_CREASE? value: CELL_CREASE

  var factor = value / this.initial_width || 0.0000001;
  var factor2 = (value- CELL_CREASE)  / this.interior_width || 0.0000001;

  this.mesh_interior.scale.x = factor2;
  this.mesh_exterior.scale.x = factor;

  this.width = value;

}

Cell.prototype.setVaporizerHeight = function(value){

  if (value < 0.3 && this.vaporizer_visible){
    //hide vaporizer, show normal cladding
    this.remove(this.mesh_interior);
    this.mesh_interior = this.mesh_interior_clad;
    this.add(this.mesh_interior)

    this.vaporizer_visible = false;

  }else if(value > 0.3 && !this.vaporizer_visible){
    //show vaporzier
    this.replaceInteriorGometry(vaporizer_object);
    this.vaporizer_visible = true;
  }

  // update height
  if(this.vaporizer_visible){
    this.mesh_interior.morphTargetInfluences[1] = value;
  }else{
    var factor2 = (value - CELL_CREASE) / this.interior_height || 0.0000001;
    this.mesh_interior.scale.y = factor2;
  }
}

Cell.prototype.setHeight = function(value){

  var factor = value / this.initial_height || 0.0000001;
  this.mesh_exterior.scale.y = factor;

  if (this.isVaporizer()){
    this.setVaporizerHeight(value);
  }else{
    var factor2 = (value - CELL_CREASE) / this.interior_height || 0.0000001;
    this.mesh_interior.scale.y = factor2;
  }

  this.height = value;
}

Cell.prototype.setType = function(type){

  this.type = type;

  var col = type == 0 ? "interior": "heater"
  // check whether objects are defined
    switch(type){
      case 1:
        this.replaceInteriorGometry(heater_object)
        break
      case 2:
        this.replaceInteriorGometry(vaporizer_object);
        this.vaporizer_visible = true;
        this.setHeight(this.height);
        break
      default:
        this.remove(this.mesh_interior);
        this.mesh_interior = this.mesh_interior_clad;
        this.add(this.mesh_interior)
        this.setHeight(this.height);
        break
      }
}

Cell.prototype.replaceInteriorGometry = function(object_mesh){
  if(object_mesh){
    this.remove(this.mesh_interior);
    this.mesh_interior = object_mesh.clone();
    if(this.flip == -1){
      this.mesh_interior.applyMatrix( new THREE.Matrix4().makeTranslation( - (this.interior_width), 0 , 0  ) );
    }
    this.add(this.mesh_interior);
  }
}

Cell.prototype.isVaporizer = function(){
    return this.type == 2;
}
