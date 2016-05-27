
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
  this.name     = "wall_instance";
  this.visible  = properties.visible;
  this.index    = index;
  this.flip     = properties.flip || 1;
  this.door     = properties.door;
  this.cells    = [];
  this.first_col = 0;


  // calculate width division
  this.rest = length % MODULE_WIDTH;
  this.n = (length - this.rest) / MODULE_WIDTH;

  // calculate height division
  this.rest_height = this.height % MODULE_HEIGHT;
  this.n_height    = (this.height - this.rest_height) / MODULE_HEIGHT;

  // var axisHelper = new THREE.AxisHelper( 5 );
  // this.add( axisHelper );


  // create wall base-pivot
  this.base = new THREE.Object3D();
  this.add(this.base);
  this.base.position.set(-this.flip * this.length/2,0,0);
  if (this.flip == -1) this.base.rotation.set(0,Math.PI,0);

  // set first col to make door-void
  if(this.door){
    this.first_col = 3;
    this.addDoorPlate();
  }

  if(this.first_col > this.n ) alert("door is too wide for initial startup condition");

  // add columns
  for(var i = this.first_col; i< this.n + 1; i++){
    // iterate over full columns +1
    this.addCol(i);
  }

  this.updateConfig();

  this.addCorner();
}
Wall.prototype = new THREE.Object3D();
Wall.prototype.constructor = Wall;

// update wall length
Wall.prototype.setLength = function(value){

  this.length = value;

  //update the base position
  this.base.position.set(- this.flip * this.length/2,0,0);

  //compare previous config with new config
  var temp_n = this.n;
  this.rest = this.length % MODULE_WIDTH;
  this.n = (this.length - this.rest) / MODULE_WIDTH;
  var diff = this.n-temp_n;

  if (this.n > temp_n){
    // increase number of modules

    for(var i =0; i< diff; i++){
      this.addCol(temp_n + i);
    }

    this.setRestColPos();
    this.updateConfig();

  }else if (this.n < temp_n) {
    // decrease numnber of modules

    for(var i =0; i< (-diff); i++){
      this.removeCol(temp_n -1 -  i);
    }

    this.setRestColPos();
    this.updateConfig();
  }

  this.setRestColSize(this.rest);

  this.updateVaporizerPosition();

  this.updateCornerPosition();

  if (this.door_plate_mesh) {
    this.updateDoorPlatePos()
  }

}


Wall.prototype.updateConfig = function(){

  var wall_config = HEATER_CONFIG[this.index][this.n] || [];

  //for each module, get the module type
  for(var i = 0; i< this.n; i++){
    var module_type = wall_config[i] || 0;
    if (this.cells[i]){
      this.cells[i][1].setType(module_type);
    }
  }

  if(this.aromatherapy){
    this.cells[this.n-1][1].setType(3);
  }

}

Wall.prototype.updateColors=function(){
  //for each module, get the module type
  for(var n = 0; n< this.n+1; n++){
    for(var i =0; i< this.n_height+1; i++){
      if(this.cells[n]){
        this.cells[n][i].updateColor();
      }
    }
  }
  for (var i = 0; i < 3; i++) {
    this.corner_mesh[i].material.color.set(colors.exterior);
  }

  if (this.door_plate_mesh) {
    this.door_plate_mesh.material.color.set(colors.exterior);
    this.door_plate_mesh2.material.color.set(colors.exterior);
  }
}



Wall.prototype.colBehindBench = function(index, i){
  if(index ==2){
    return true;
  } else if ( (index ==1 || index ==3) && i <= 1 ) {
    return true;
  }
  return false
}

Wall.prototype.addCol = function(n){

  // copy previous rest coll to new coll
  this.cells[n+1] = this.cells[n];

  // create new coll
  this.cells[n] = [];


  //ADDCELLS
  for(var i =0; i<this.n_height+1; i++){

    var is_col_behind_bench = this.colBehindBench(this.index, n)

    var module_height = is_col_behind_bench?  MODULE_FIXED_HEIGHT[i]: MODULE_HEIGHT;

    var cell_height = (i<this.n_height)? module_height: this.rest_height;

    var width       = (n<this.n)? MODULE_WIDTH: this.rest;

    var size    = [width, cell_height, MODULE_THICKNESS];
    var cell_id = this.index + "-" + n + "-" + i;
    this.cells[n][i] = new Cell(size, this.flip, cell_id);

    var pos_y =0;
    if(is_col_behind_bench){
      for(var j = 0; j < i; j++) {
        pos_y += MODULE_FIXED_HEIGHT[j];  // Iterate over your first array and then grab the second element add the values up
      }
    }else {
      pos_y = MODULE_HEIGHT * i;
    }

    this.cells[n][i].position.set(n*MODULE_WIDTH, pos_y, 0);


    this.base.add( this.cells[n][i] );
  }
}

Wall.prototype.updateVaporizerPosition = function(){
  if(this.vaporizer){
    var pos_x = (this.n -1 )*0.256;
    var pos_y = Math.min( (this.n_height * 0.67 + this.rest_height - 0.25), 3* 0.67 - 0.25 );
    var pos_z = 0;

    this.vaporizer.visible = (this.height<1.65)? false: true;

    this.vaporizer.position.set(pos_x, pos_y, pos_z);
  }
}

Wall.prototype.addVaporizer = function( boolean){
  if(boolean){
    this.vaporizer = _models.vaporizer.mesh;

    this.updateVaporizerPosition();

    this.base.add(this.vaporizer)
  } else {
    this.base.remove(this.vaporizer)
    this.vaporizer = null;
  }
}

Wall.prototype.addAromaTherapy = function( boolean ){

  var target_cell = this.cells[this.n-1][1];


  var type_index = boolean? 3: 0;
  target_cell.setType(type_index);
  this.aromatherapy = boolean;
}

Wall.prototype.setHeight = function(value){
  this.height = value;

  // calculate height division
  var temp_n_height = this.n_height;
  this.rest_height = this.height % MODULE_HEIGHT;
  this.n_height    = (this.height - this.rest_height) / MODULE_HEIGHT;

  //get the difference in number of rows
  var diff = this.n_height-temp_n_height;

  if (this.n_height > temp_n_height){
    for(var i=0; i < diff; i++){
      this.addRow(temp_n_height+i);
    }
    this.setRestRowPos()
  }else if (this.n_height < temp_n_height) {
    for(var i=0; i < (-diff); i++){
      // this.removeRow(this.n_height)
      this.removeRow(temp_n_height-1-i);
    }
    this.setRestRowPos();
  }

  this.setRestRowSize(this.rest_height);

  this.updateVaporizerPosition();

  this.updateCornerHeight();

  if( this.door_plate_mesh){
    var factor = this.height / this.door_plate_mesh.geometry.parameters.height;
    this.door_plate_mesh.scale.y = factor;
    this.door_plate_mesh2.scale.y = factor;
  }

}

Wall.prototype.setRestColPos = function(){
  for(var i=0; i< this.n_height + 1; i++){
    this.cells[this.n][i].position.x = this.n* MODULE_WIDTH;
  }
}

Wall.prototype.setRestColSize = function(rest_length){

  for(var i=0; i< this.n_height + 1; i++){
    this.cells[this.n][i].setWidth(rest_length);
  }
}
Wall.prototype.removeCol = function(n){



  for(var i=0; i< this.n_height + 1; i++){
    //iterate over cells in this column, including 'rest_height' cell

    // remove geometry from scene
    this.base.remove( this.cells[n][i] );
  }
  // remove data
  this.cells[n] = this.cells[n+1];
  this.cells[n+1] = null;

}

Wall.prototype.setRestRowPos = function(){
  var i = this.n_height;

  for(var n=0; n< (this.n +1); n++){
    if(this.cells[n]){
      this.cells[n][i].position.y = this.n_height * MODULE_HEIGHT;
    }
  }
}

Wall.prototype.setRestRowSize = function(rest_height){

  var i = this.n_height;

  for(var n=0; n< (this.n +1); n++){
    if(this.cells[n]){
      this.cells[n][i].setHeight(rest_height);
    }
  }
}

Wall.prototype.addRow = function(i){

  for(var n=0; n<this.n+1; n++){
  //iterate over number of full cells + 1

    if(this.cells[n]){
      //column exists

      // copy rest cell to next index
      this.cells[n][i+1] = this.cells[n][i];

      // get width corresponding to column
      var width = (n<this.n)? MODULE_WIDTH: this.rest;

      //create a new cell
      var size    = [width, MODULE_HEIGHT, MODULE_THICKNESS];
      var cell_id = this.index + "-" + n + "-" + i;

      this.cells[n][i] = new Cell(size, this.flip, cell_id);
      this.cells[n][i].position.set(n*MODULE_WIDTH, MODULE_HEIGHT * i, 0);

      // add cell to 'base' in scene
      this.base.add( this.cells[n][i] );

    }
  }
}

Wall.prototype.removeRow = function(i){

  for(var n=0; n<this.n+1; n++){
    //iterate over number of full cells + 1

    if(this.cells[n]){
      // column does exist

      //remove the cell
      this.base.remove(this.cells[n][i]);
      this.cells[n][i] = this.cells[n][i+1];
      this.cells[n][i+1] = null;
    }
  }
}



Wall.prototype.addCorner = function(){

  // create corner box
  var geometry = new THREE.BoxGeometry( MODULE_THICKNESS/2, this.height, MODULE_THICKNESS/2 );

  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( MODULE_THICKNESS/4, this.height/2, MODULE_THICKNESS/4 ));

  this.corner_mesh = []

  this.corner_mesh[0] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: colors.exterior } ) );
  this.corner_mesh[1] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: colors.exterior } ) );
  this.corner_mesh[2] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: colors.exterior } ) );
  this.corner_mesh[3] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: "#333333" } ) );

  this.updateCornerPosition();

  for (var i = 0; i < this.corner_mesh.length; i++) {
    this.add(this.corner_mesh[i]);
  }
}

Wall.prototype.updateCornerPosition = function(){
  var positions = [
    [this.length/2, 0, MODULE_THICKNESS/2],
    [this.length /2 + MODULE_THICKNESS/2 , 0, MODULE_THICKNESS/2],
    [this.length /2 + MODULE_THICKNESS/2 , 0, 0],
    [this.length /2 , 0, 0],
  ]

  for (var i = 0; i < this.corner_mesh.length; i++) {
    this.corner_mesh[i].position.set(positions[i][0],positions[i][1],positions[i][2])
  }
}

Wall.prototype.updateCornerHeight = function(){
  // scale corners
  var factor = this.height / this.corner_mesh[0].geometry.parameters.height;

  for (var i = 0; i < this.corner_mesh.length; i++) {
    this.corner_mesh[i].scale.y = factor
  }
}


Wall.prototype.addDoorPlate = function(){

  this.door_plate_thickness = 0.005;
  // create corner box
  var geometry = new THREE.BoxGeometry( this.door_plate_thickness, this.height, MODULE_THICKNESS );

  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( this.door_plate_thickness/2, this.height/2, MODULE_THICKNESS/2 ));

  this.door_plate_mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: colors.exterior } ) );

  this.door_plate_mesh2 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: colors.exterior } ) );

  this.updateDoorPlatePos()

  this.add( this.door_plate_mesh );
  this.add( this.door_plate_mesh2 );
}

Wall.prototype.updateDoorPlatePos = function(){
  this.door_plate_mesh.position.set(-this.length / 2 + 3*MODULE_WIDTH - this.door_plate_thickness, 0, 0);
  this.door_plate_mesh2.position.set( -this.length / 2 , 0, 0);

}
