//CELL Class
function Cell(size){
  THREE.Object3D.call( this );

  this.width = size[0];
  this.interior_width = size[0]-0.005

  var face_thickness = 0.5 * size[2];

  var geometry = new THREE.BoxGeometry( size[0], size[1], face_thickness );
  // offset pivot to corner
  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( size[0] / 2, size[1] / 2 , face_thickness/2 + size[2] /2) );

  // geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0.5 * width, cell_height/2, MODULE_THICKNESS/2) );
  this.mesh_exterior = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: getColor("exterior") } ) );

  this.add(this.mesh_exterior);


  var geometry2 = new THREE.BoxGeometry( this.interior_width, size[1]-0.005, face_thickness );

  // offset pivot to corner
  geometry2.applyMatrix( new THREE.Matrix4().makeTranslation( this.interior_width / 2, size[1] / 2 , face_thickness/2  ) );


  this.mesh_interior_clad = new THREE.Mesh( geometry2, new THREE.MeshLambertMaterial( { color: getColor('interior') } ) );
  this.mesh_interior_clad.position.set(0.005/2, 0 , 0);
  this.mesh_interior = this.mesh_interior_clad

  this.add(this.mesh_interior);

}
Cell.prototype = new THREE.Object3D();
Cell.prototype.constructor = Cell;

Cell.prototype.setWidth = function(value){


  var factor = value / this.width;
  var factor2 = (value- 0.005)  / this.interior_width;

  this.mesh_interior.scale.x = factor2;
  this.mesh_exterior.scale.x = factor;

}

Cell.prototype.setType = function(type){

  var col = type == 0 ? "interior": "heater"
  if(heater_object){
    if(type==1){
      this.remove(this.mesh_interior);
      this.mesh_interior = heater_object.clone();
      this.add(this.mesh_interior);
    }else {
      this.remove(this.mesh_interior);
      this.mesh_interior = this.mesh_interior_clad;
      this.add(this.mesh_interior)
    }
  }
}
