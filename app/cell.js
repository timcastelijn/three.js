//CELL Class
function Cell(size){
  THREE.Object3D.call( this );

  this.length = size[0];

  var face_thickness = 0.5 * size[2];

  var geometry = new THREE.BoxGeometry( size[0], size[1], face_thickness );
  // offset pivot to corner
  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( size[0] / 2, size[1] / 2 , face_thickness/2 + size[2] /2) );

  // geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0.5 * width, cell_height/2, MODULE_THICKNESS/2) );
  this.mesh_exterior = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: getColor("exterior") } ) );

  this.add(this.mesh_exterior);


  var geometry = new THREE.BoxGeometry( size[0], size[1], face_thickness );

  // offset pivot to corner
  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( size[0] / 2, size[1] / 2 , face_thickness/2  ) );

  // geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0.5 * width, cell_height/2, MODULE_THICKNESS/2) );
  this.mesh_interior = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: getColor("interior") } ) );

  this.add(this.mesh_interior);

}
Cell.prototype = new THREE.Object3D();
Cell.prototype.constructor = Cell;

Cell.prototype.setWidth = function(value){
  var factor = value / this.length;
  this.mesh_interior.scale.x = factor;
  this.mesh_exterior.scale.x = factor
}
