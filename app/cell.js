//CELL Class
function Cell(size, flip){
  THREE.Object3D.call( this );


  this.width  = size[0];
  this.height = size[1];
  this.flip   = flip;
  this.interior_width = size[0]-0.005

  var face_thickness = 0.5 * size[2];
  var flip_factor = 1
  if(flip){
    this.rotation.set(0,Math.PI,0);
    flip_factor = -1
  }
  var geometry = new THREE.BoxGeometry( size[0], size[1], face_thickness );
  // offset pivot to corner
  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( flip_factor * this.width / 2, size[1] / 2 , face_thickness/2 + size[2] /2) );

  // geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0.5 * width, cell_height/2, MODULE_THICKNESS/2) );
  this.mesh_exterior = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: getColor("exterior") } ) );

  this.add(this.mesh_exterior);


  var geometry2 = new THREE.BoxGeometry( this.interior_width, size[1]-0.005, face_thickness );

  // offset pivot to corner
  geometry2.applyMatrix( new THREE.Matrix4().makeTranslation( flip_factor * this.interior_width / 2, size[1] / 2 , face_thickness/2  ) );


  this.mesh_interior_clad = new THREE.Mesh( geometry2, new THREE.MeshLambertMaterial( { color: getColor('interior') } ) );
  this.mesh_interior_clad.position.set(0.005/2, 0 , 0);
  this.mesh_interior = this.mesh_interior_clad

  this.add(this.mesh_interior);

}
Cell.prototype = new THREE.Object3D();
Cell.prototype.constructor = Cell;

Cell.prototype.setWidth = function(value){

  value = value >0.005? value: 0.005

  var factor = value / this.width || 0.0000001;
  var factor2 = (value- 0.005)  / this.interior_width || 0.0000001;

  this.mesh_interior.scale.x = factor2;
  this.mesh_exterior.scale.x = factor;

}

Cell.prototype.setHeight = function(value){

  var factor = value / this.height || 0.0000001;

  this.mesh_interior.scale.y = factor;
  this.mesh_exterior.scale.y = factor;
}

Cell.prototype.setType = function(type){

  var col = type == 0 ? "interior": "heater"
  if(heater_object){
    if(type==1){
      this.remove(this.mesh_interior);
      this.mesh_interior = heater_object.clone();
      if(this.flip){
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
