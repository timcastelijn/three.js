//CELL Class
function Cell(size, flip){
  THREE.Object3D.call( this );

  this.width  = size[0];
  this.height = size[1];
  this.flip   = flip;

  this.interior_width   = size[0]-CELL_CREASE;
  this.interior_height  = size[1]-CELL_CREASE

  var face_thickness = 0.5 * size[2];
  if(this.flip == -1){
    this.rotation.set(0,Math.PI,0);
  }
  var geometry = new THREE.BoxGeometry( size[0], size[1], face_thickness );
  // offset pivot to corner
  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( this.flip * this.width / 2, size[1] / 2 , face_thickness/2 + size[2] /2) );

  // geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0.5 * width, cell_height/2, MODULE_THICKNESS/2) );
  this.mesh_exterior = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: getColor("exterior") } ) );

  this.add(this.mesh_exterior);


  var geometry2 = new THREE.BoxGeometry( this.interior_width, this.interior_height, face_thickness );

  // offset pivot to corner
  geometry2.applyMatrix( new THREE.Matrix4().makeTranslation( this.flip * this.interior_width / 2, this.interior_height / 2 , face_thickness/2  ) );


  this.mesh_interior_clad = new THREE.Mesh( geometry2, new THREE.MeshLambertMaterial( { color: getColor('interior') } ) );
  this.mesh_interior_clad.position.set(CELL_CREASE/2, CELL_CREASE/2 , 0);
  this.mesh_interior = this.mesh_interior_clad

  this.add(this.mesh_interior);

}
Cell.prototype = new THREE.Object3D();
Cell.prototype.constructor = Cell;

Cell.prototype.setWidth = function(value){

  // value = value >CELL_CREASE? value: CELL_CREASE

  var factor = value / this.width || 0.0000001;
  var factor2 = (value- CELL_CREASE)  / this.interior_width || 0.0000001;

  this.mesh_interior.scale.x = factor2;
  this.mesh_exterior.scale.x = factor;

}

Cell.prototype.setHeight = function(value){

  var factor = value / this.height || 0.0000001;
  var factor2 = (value - CELL_CREASE) / this.interior_height || 0.0000001;

  this.mesh_exterior.scale.y = factor;
  this.mesh_interior.scale.y = factor2;
}

Cell.prototype.setType = function(type){

  var col = type == 0 ? "interior": "heater"
  if(heater_object){
    if(type==1){
      this.remove(this.mesh_interior);
      this.mesh_interior = heater_object.clone();
      if(this.flip == -1){
        this.mesh_interior.applyMatrix( new THREE.Matrix4().makeTranslation( - (this.interior_width), 0 , 0  ) );
      }
      this.add(this.mesh_interior);
    }else {
      this.remove(this.mesh_interior);
      this.mesh_interior = this.mesh_interior_clad;
      this.add(this.mesh_interior)
    }
  }
}
