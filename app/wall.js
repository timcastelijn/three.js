

//wall class
function Wall( length, height, flip, door){
  // inherit from Object3D class
  THREE.Object3D.call( this );

  this.length=length;
  this.height=height;
  this.name = "wall_instance"

  var axisHelper = new THREE.AxisHelper( 0.5 );
  this.add( axisHelper );

  // create wall
  this.rest = length % MODULE_WIDTH;
  this.n = (length - this.rest) / MODULE_WIDTH;

  this.cells = []

  for(var i = 0; i< this.n; i++){
    // create placeholder box
    this.addCol(i);
  }

  this.addCorner();
}
Wall.prototype = new THREE.Object3D();
Wall.prototype.constructor = Wall;


Wall.prototype.setLength = function(value){
  this.length = value;

  //update wall config
  var temp_n = this.n
  this.rest = this.length % MODULE_WIDTH;
  this.n = (this.length - this.rest) / MODULE_WIDTH;

  if (this.n > temp_n){
    // increase number of modules
    this.addCol(this.n -1);
    console.log("addCol");
  }else if (this.n < temp_n) {
    // decrease numnber of modules
    this.removeCol(this.n)
  }else {
      // do nothing
  }
  //update rest module size


  this.corner_mesh.position.x = value+MODULE_THICKNESS/2
}

Wall.prototype.addCol = function(n){

  // create placeholder box
  var geometry = new THREE.BoxGeometry( MODULE_WIDTH, this.height, MODULE_THICKNESS );
  this.cells[n] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
  var length_offset = MODULE_WIDTH * (n + 0.5)
  this.cells[n].position.set(length_offset, this.height/2, -MODULE_THICKNESS/2);
  this.add( this.cells[n] );
}

Wall.prototype.removeCol = function(n){

  // create placeholder box
  this.remove( this.cells[n] );
  this.cells[n] = null;
}

Wall.prototype.addCorner = function(){

  // create corner box
  var geometry = new THREE.BoxGeometry( MODULE_THICKNESS, this.height, MODULE_THICKNESS );
  this.corner_mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
  this.corner_mesh.position.set(this.length + MODULE_THICKNESS/2, this.height/2, -MODULE_THICKNESS/2);
  this.add( this.corner_mesh );
}



//CELL Class
function Cell(width, heigth, thickness){
  THREE.Object3D.call( this );

  //create objects
  //define local variables
  // create interior
  var geometry = new THREE.BoxGeometry( width-0.005, heigth-0.005, thickness/2 );
  this.interior = new SelectableMesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff } ) );
  this.interior.selectable =true;
  this.interior.position.set(0,0,thickness/4);

  // create exterior
  var geometry = new THREE.BoxGeometry( width, heigth, thickness/2 );
  this.exterior_mesh = new SelectableMesh( geometry, new THREE.MeshLambertMaterial( { color: 0x111111 } ) );
  this.exterior_mesh.position.set(0,0,-thickness/4);

  objects.push(this.interior);
  objects.push(this.exterior_mesh);

  this.add( this.interior );
  this.add( this.exterior_mesh );

}
Cell.prototype = new THREE.Object3D();
Cell.prototype.constructor = Cell;



//CELL Class
function SelectableMesh(geometry, material){
  THREE.Mesh.call( this,geometry, material );
  this.selectable = false;
}
SelectableMesh.prototype = new THREE.Mesh();
SelectableMesh.prototype.constructor = SelectableMesh;

SelectableMesh.prototype.select=function(bool_select){
  if (bool_select){
    this.interior_color_prev = this.material.color.getHex();
    this.material.color.setHex("0xff0000");
  }else{
    this.material.color.setHex(this.interior_color_prev);
  }
}
