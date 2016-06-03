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

  this.mesh_exterior = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: colors.exterior } ) );

  this.add(this.mesh_exterior);


  var geometry2 = new THREE.BoxGeometry( this.interior_width, this.interior_height, face_thickness );

  // offset pivot to corner
  geometry2.applyMatrix( new THREE.Matrix4().makeTranslation( this.flip * this.interior_width / 2, this.interior_height / 2 , face_thickness/2  ) );


  this.mesh_interior_clad = new THREE.Mesh( geometry2, new THREE.MeshLambertMaterial( { color: colors.interior } ) );
  this.mesh_interior_clad.position.set(CELL_CREASE/2, CELL_CREASE/2 , 0);
  this.mesh_interior = this.mesh_interior_clad
  this.type = 0;

  this.add(this.mesh_interior);

  if(SHADOWS_ENABLED){
    this.mesh_exterior.castShadow = true
    this.mesh_exterior.receiveShadow = true
    this.mesh_interior.castShadow = true
    this.mesh_interior.receiveShadow = true
  }

  var geometry = new THREE.BoxGeometry( size[0], size[1], 0.01 );

  // offset pivot to corner
  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( this.flip * this.width / 2, size[1] / 2 , face_thickness/2 + size[2] /2) );

  this.mesh_divider = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: "#333333" } ) );
  this.mesh_divider.position.z = -0.05

  this.add(this.mesh_divider);

}
Cell.prototype = new THREE.Object3D();
Cell.prototype.constructor = Cell;

Cell.prototype.setWidth = function(value){

  // value = value >CELL_CREASE? value: CELL_CREASE

  var factor = value / this.initial_width || 0.0000001;
  var factor2 = (value- CELL_CREASE)  / this.interior_width || 0.0000001;

  this.mesh_interior.scale.x = factor2;
  this.mesh_exterior.scale.x = factor;
  this.mesh_divider.scale.x = factor;

  this.width = value;

}

Cell.prototype.setHeight = function(value){

  var factor = value / this.initial_height || 0.0000001;
  this.mesh_exterior.scale.y = factor;
  this.mesh_divider.scale.y = factor;

  var factor2 = (value - CELL_CREASE) / this.interior_height || 0.0000001;
  this.mesh_interior.scale.y = factor2;

  this.height = value;
}

Cell.prototype.setType = function(type){

  this.type = type;

  if(this.leds){
    this.leds.ditch();
    this.leds = null;
  }

  // check whether objects are defined
  switch(type){
    case 1:
      this.replaceInteriorGometry(_models.heater.mesh)
      this.mesh_interior.morphTargetInfluences[1]=this.height;
      this.leds = new Heater(this, 0.128, 0.085, -0.005, 0.03, 0.75, 2, 40);
      break
    case 3:
      this.replaceInteriorGometry(_models.aromatherapy.mesh);
      this.mesh_interior.morphTargetInfluences[1]=this.height;
      break
    default:
      this.replaceInteriorGometry(this.mesh_interior_clad);
      this.setHeight(this.height);
      break
  }
}

Cell.prototype.replaceInteriorGometry = function(object_mesh){
  if(object_mesh){
    this.remove(this.mesh_interior);
    this.mesh_interior = object_mesh.clone();
    if(this.flip == -1 && (object_mesh != this.mesh_interior_clad) ){
      this.mesh_interior.applyMatrix( new THREE.Matrix4().makeTranslation( - (this.interior_width), 0 , 0  ) );
    }
    this.add(this.mesh_interior);
  }
}
Cell.prototype.updateColor = function(){
  this.mesh_exterior.material.color.set(colors.exterior);

  switch(this.type){
    case 0:
      this.mesh_interior.material.color.set(colors.interior);
      break;
    case 1:
      this.mesh_interior.material.materials[1].color.set(colors.interior);
      break;
    case 2:
      this.mesh_interior.material.materials[0].color.set(colors.interior);
      break;
    case 3:
      this.mesh_interior.material.materials[0].color.set(colors.interior);
      break;
    default:
      console.log("could not update cell color");
  }

  this.mesh_interior_clad.material.color.set(colors.interior)

}

Cell.prototype.isVaporizer = function(){
    return this.type == 2;
}
