
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
  this.first_col = this.door? 3: 0;

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


  this.corner_mesh.position.x = value/2;
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
  this.corner_mesh.material.color.set(colors.exterior)
}



Wall.prototype.addCol = function(n){

  // copy previous rest coll to new coll
  this.cells[n+1] = this.cells[n];

  // create new coll
  this.cells[n] = [];


  //ADDCELLS
  for(var i =0; i<this.n_height+1; i++){

    var cell_height = (i<this.n_height)? MODULE_HEIGHT: this.rest_height;
    var width       = (n<this.n)? MODULE_WIDTH: this.rest;

    var size    = [width, cell_height, MODULE_THICKNESS];
    this.cells[n][i] = new Cell(size, this.flip);
    this.cells[n][i].position.set(n*MODULE_WIDTH, MODULE_HEIGHT * i, 0);


    this.base.add( this.cells[n][i] );
  }
}

Wall.prototype.addVaporizer = function( boolean){

  var target_cell = this.cells[this.n-1][this.n_height];
  this.vaporizer = boolean;

  var type_index = boolean? 2: 0;
  target_cell.setType(type_index);

  if (this.n_height < 3 && target_cell.height < 0.3 && boolean) {
    alert("zoutvernevelaar past niet, maak hoogte groter of vraag offerte op maat aan");
  }

}

Wall.prototype.addSteun = function( boolean){

}

Wall.prototype.addAroma = function( boolean){

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

  // scale coreners
  var factor = this.height / this.corner_mesh.geometry.parameters.height;
  this.corner_mesh.scale.y = factor;

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
      this.cells[n][i] = new Cell(size, this.flip);
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
  var geometry = new THREE.BoxGeometry( MODULE_THICKNESS, this.height, MODULE_THICKNESS );
  this.corner_mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: colors.exterior } ) );

  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( MODULE_THICKNESS/2, this.height/2, MODULE_THICKNESS/2 ));

  this.corner_mesh.position.set(this.length /2 , 0, 0);

  if(SHADOWS_ENABLED){
    this.corner_mesh.castShadow = true;
    this.corner_mesh.receiveShadow = true;
  }

  this.add( this.corner_mesh );
}
