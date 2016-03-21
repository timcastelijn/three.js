
HEATER_CONFIG = [
  [
    // FRONT
  ],
  [
    // LEFT
    [],
    [],
    [],
    [1,0,0],
    [1,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0,0],
    [1,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0],
  ],
  [
    // BACK
    [],
    [],
    [],
    [1,1,1],
    [1,1,1,1],
    [1,0,1,0,1],
    [1,0,1,1,0,1],
    [1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0],
    [1,0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0,1,0],
    [1,0,1,0,1,0,1,0,1,0,1],
  ],
  [
    // RIGHT
    [],
    [],
    [],
    [1,0,0],
    [1,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0,0],
    [1,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0],
  ],
]


//wall class
function Wall( length, height, index, properties){
  // inherit from Object3D class
  THREE.Object3D.call( this );

  this.length   = length;
  this.height   = height;
  this.name     = "wall_instance"
  this.visible  = properties.visible
  this.index    = index
  this.flip     = properties.flip
  this.door     = properties.door
  this.cells = []

  // create wall
  this.rest = length % MODULE_WIDTH;
  this.n = (length - this.rest) / MODULE_WIDTH;

  // var axisHelper = new THREE.AxisHelper( 5 );
  // this.add( axisHelper );

  var flip_factor = this.flip? 1: -1;

  // create wall base-pivot
  this.base = new THREE.Object3D()
  this.add(this.base);
  this.base.position.set(flip_factor * this.length/2,0,0);
  if (this.flip) this.base.rotation.set(0,Math.PI,0);

  // set first col to make door-void
  this.first_col = this.door? 3: 0;

  if(this.first_col > this.n ) alert("door is too wide for initial startup condition");


  for(var i = this.first_col; i< this.n; i++){
    // create placeholder box
    this.addCol(i, MODULE_WIDTH);
  }
  this.rest_col = this.addCol(this.n, this.rest);

  this.updateConfig();


  this.addCorner();
}
Wall.prototype = new THREE.Object3D();
Wall.prototype.constructor = Wall;

// update wall length
Wall.prototype.setLength = function(value){

  this.length = value;

  //update the base position
  var flip_factor = this.flip? 1: -1;
  this.base.position.set(flip_factor * this.length/2,0,0);

  //compare previous config with new config
  var temp_n = this.n
  this.rest = this.length % MODULE_WIDTH;
  this.n = (this.length - this.rest) / MODULE_WIDTH;

  this.setRestColSize(this.rest);

  if (this.n > temp_n){
    var diff = this.n-temp_n

    for(var i =0; i< diff; i++){
      this.addCol(temp_n + i, MODULE_WIDTH);
    }

    // increase number of modules
    this.setRestColPos(this.n)

    this.updateConfig();

  }else if (this.n < temp_n) {

    var diff = temp_n - this.n;

    // decrease numnber of modules
    for(var i =0; i< diff; i++){
      this.removeCol(temp_n -1 -  i, MODULE_WIDTH);
    }

    this.setRestColPos(this.n)
    this.updateConfig();
  }else {
      // do nothing
  }

  this.corner_mesh.position.x = value/2;
}



Wall.prototype.updateConfig = function(){

  var wall_config = HEATER_CONFIG[this.index][this.n] || []

  //for each module, get the module type
  for(var i = 0; i< this.n; i++){
    var module_type = wall_config[i] || 0;
    if (this.cells[i]){
      this.cells[i][1].setType(module_type);
    }
  }

}


Wall.prototype.addCol = function(n, width){

  var cell_count = 3;
  var cell_height = this.height/3;

  this.cells[n] = [];


  for(var i =0; i<3; i++){

    var size      = [width, cell_height, MODULE_THICKNESS];


    this.cells[n][i] = new Cell(size, this.flip);
    this.cells[n][i].position.set(n*MODULE_WIDTH, cell_height * i, 0)

    this.base.add( this.cells[n][i] );
  }
  // create placeholder box

  return this.cells[n];
}

Wall.prototype.setRestColPos = function(n){

  for(var i=0; i< this.rest_col.length; i++){
    this.rest_col[i].position.set(n* MODULE_WIDTH, this.height / 3 * i, 0);
  }
}

Wall.prototype.setRestColSize = function(rest_length){

  for(var i=0; i< this.rest_col.length; i++){
    this.rest_col[i].setWidth(rest_length);
  }
}

Wall.prototype.removeCol = function(n){

  // remove geometry from scene
  for(var i=0; i< this.rest_col.length; i++){
    this.base.remove( this.cells[n][i] );
  }
  // remove data
  this.cells[n] = null;
}

Wall.prototype.addCorner = function(){

  // create corner box
  var geometry = new THREE.BoxGeometry( MODULE_THICKNESS, this.height, MODULE_THICKNESS );
  this.corner_mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: getColor("exterior") } ) );

  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( MODULE_THICKNESS/2, this.height/2, MODULE_THICKNESS/2 ));

  this.corner_mesh.position.set(this.length /2 , 0, 0);
  this.add( this.corner_mesh );
}
