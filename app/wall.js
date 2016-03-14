

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

  this.first_col = door? 3: 0;

  if(this.first_col > this.n ) alert("door is too wide for initial startup condition");

  for(var i = this.first_col; i< this.n; i++){
    // create placeholder box
    this.addCol(i, MODULE_WIDTH);
  }

  this.rest_col = this.addCol(this.n, this.rest);


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
    this.addCol(this.n -1, MODULE_WIDTH);
    this.setRestColPos(this.n)
    console.log("addCol");
  }else if (this.n < temp_n) {
    // decrease numnber of modules
    this.removeCol(this.n)
    this.setRestColPos(this.n)
  }else {
      // do nothing
  }
  if (this.rest!=0) this.setRestColSize(this.rest);
  //update rest module size


  this.corner_mesh.position.x = value+MODULE_THICKNESS/2
}

Wall.prototype.addCol = function(n, width){


  // // create placeholder box
  // var geometry = new THREE.BoxGeometry( width, this.height, MODULE_THICKNESS );
  // geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0.5 * width, this.height/2, MODULE_THICKNESS/2) );
  //
  // this.cells[n] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
  //
  //
  // var length_offset = n * MODULE_WIDTH
  // this.cells[n].position.set(length_offset, 0, 0);
  // this.add( this.cells[n] );
  //
  // return this.cells[n];

  var cell_count = 3;
  var cell_height = this.height/3;

  this.cells[n] = [];

  var geometry = new THREE.BoxGeometry( width, cell_height, MODULE_THICKNESS );
  geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0.5 * width, cell_height/2, MODULE_THICKNESS/2) );

  for(var i =0; i<3; i++){
    // geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0.5 * width, cell_height/2, MODULE_THICKNESS/2) );
    this.cells[n][i] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: getColor("exterior") } ) );

    var length_offset = n * MODULE_WIDTH
    this.cells[n][i].position.set(length_offset, cell_height * i, 0);
    this.add( this.cells[n][i] );
  }
  // create placeholder box

  return this.cells[n];
}

Wall.prototype.setRestColPos = function(n){

  // this.rest_col.position.set(n* MODULE_WIDTH, 0, 0);

  for(var i=0; i< this.rest_col.length; i++){
    this.rest_col[i].position.set(n* MODULE_WIDTH, this.height / 3 * i, 0);
  }
}


Wall.prototype.setRestColSize = function(rest_length){

  var factor =  rest_length / this.rest_col[0].geometry.parameters.width; // === 1
  for(var i=0; i< this.rest_col.length; i++){
    this.rest_col[i].scale.x = factor;
  }
}

Wall.prototype.removeCol = function(n){

  // remove geometry
  for(var i=0; i< this.rest_col.length; i++){
    this.remove( this.cells[n][i] );
  }
  // remove data
  this.cells[n] = null;
}

Wall.prototype.addCorner = function(){

  // create corner box
  var geometry = new THREE.BoxGeometry( MODULE_THICKNESS, this.height, MODULE_THICKNESS );
  this.corner_mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: getColor("exterior") } ) );
  this.corner_mesh.position.set(this.length + MODULE_THICKNESS/2, this.height/2, MODULE_THICKNESS/2);
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
