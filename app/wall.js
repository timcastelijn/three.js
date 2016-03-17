
HEATER_CONFIG = [
  [
    // FRONT
    [],
    [],
    [],
    [0,0,0,],
    [0,0,0,0,],
    [0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
  ],
  [
    // LEFT
    [],
    [],
    [],
    [0,0,1],
    [0,0,0,1],
    [0,0,0,0,1],
    [0,0,0,0,0,1],
    [0,0,0,0,0,0,1],
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
  ],
]


//wall class
function Wall( length, height, flip, door, index){
  // inherit from Object3D class
  THREE.Object3D.call( this );

  this.length=length;
  this.height=height;
  this.name = "wall_instance"
  this.index = index
  this.flip = flip

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

  if(this.index ==2){
    console.log(this.rest);

    console.log(this.cells[this.n][1].width);
  }

  this.updateConfig();


  this.addCorner();
}
Wall.prototype = new THREE.Object3D();
Wall.prototype.constructor = Wall;

// update wall length
Wall.prototype.setLength = function(value){

  this.length = value;

  //compare previous config with new config
  var temp_n = this.n
  this.rest = this.length % MODULE_WIDTH;
  this.n = (this.length - this.rest) / MODULE_WIDTH;

  if (this.rest!=0) this.setRestColSize(this.rest);

  if (this.n > temp_n){
    // increase number of modules
    this.addCol(this.n -1, MODULE_WIDTH);
    this.setRestColPos(this.n)

    this.updateConfig();

    console.log("addCol");
  }else if (this.n < temp_n) {
    // decrease numnber of modules
    this.removeCol(this.n)
    this.setRestColPos(this.n)

    this.updateConfig();


  }else {
      // do nothing
  }
  //update rest module size


  this.corner_mesh.position.x = value+MODULE_THICKNESS/2
}



Wall.prototype.updateConfig = function(){

  for(var i = 0; i< this.n; i++){
    var local_module_type = HEATER_CONFIG[this.index][this.n][i]
    if (this.cells[i]){
      this.cells[i][1].setType(local_module_type);
    }
  }

}

Wall.prototype.addCol = function(n, width){

  var cell_count = 3;
  var cell_height = this.height/3;

  this.cells[n] = [];


  for(var i =0; i<3; i++){

    var size      = [width, cell_height, MODULE_THICKNESS];


    this.cells[n][i] = new Cell(size);
    this.cells[n][i].position.set(n*MODULE_WIDTH, cell_height * i, 0)

    this.add( this.cells[n][i] );
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
