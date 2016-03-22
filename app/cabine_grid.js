

// define constants
var MODULE_WIDTH        = 0.256; //m
var MODULE_HEIGHT       = 0.67; //m
var MODULE_FIXED_HEIGHT = [0.450, 0.890]; //m
// var MODULE_FIXED_HEIGHT = [0.670, 0.670]; //m
var MODULE_THICKNESS    = 0.1; //m
var FLOOR_THICKNESS     = 0.1;
var CEILING_THICKNESS   = 0.1;
var CELL_CREASE         = 0.005; //m
var DEBUG               = false;

var getColor = function(category){
  if(DEBUG){
    return Math.random() * 0xffffff
  }else {
    switch (category) {
      case "exterior":
        return 0x333333;
        break;
      case "interior":
        return 0xffffff;
        break;
      case "heater":
        return 0xff0000;
        break;
      default:
        return 0xffffff;
    }
  }
}

// var items;
// parent class ModuleSmall
function CabineGrid(width, height, depth){

  THREE.Object3D.call( this );

	this.width = width - 2 * MODULE_THICKNESS;
	this.depth = depth - 2 * MODULE_THICKNESS;
  this.height = height - FLOOR_THICKNESS - CEILING_THICKNESS;

  this.module_height = MODULE_HEIGHT;
  this.module_height[2] = this.height - this.module_height[1] - this.module_height[0];


  this.minimum_size   = 3*MODULE_WIDTH + 2* MODULE_THICKNESS;
  this.minimum_height = MODULE_FIXED_HEIGHT[1] + MODULE_FIXED_HEIGHT[0] + FLOOR_THICKNESS + CEILING_THICKNESS
  this.walls = [];

  //initialize walls
  var items = this.getWallPositions(this.width, this.depth);

  for(var i=0; i<items.length ;i++) {
    var item = items[i]
    //create new wall item
    var wall = new Wall( item.length, this.height, i, item);

    //set wall properties
    item.offset = item.flip? Math.PI: 0;
    wall.rotation.set(0,item.orientation + item.offset ,0);
    wall.rotation.set(0,item.orientation ,0);

    wall.position.set(item.position[0], 0, item.position[2]);

    //add wall geometry to Cabinegrid
    this.add(wall);

    //add wall object to Cabinegrid
    this.walls[i] = wall;
  }

  var json_loader = new THREE.JSONLoader( );
  json_loader.load( "models/ir-module.json", modelLoadedCallback);

  // add ceiling
  this.ceiling  = new CeilingPlaceHolder(width, depth, CEILING_THICKNESS);
  this.ceiling.position.set(0,this.height,0);
  this.add(this.ceiling);

  //add floor
  this.floor    = new CeilingPlaceHolder(width, depth, FLOOR_THICKNESS);
  this.floor.position.set(0,-FLOOR_THICKNESS,0);
  this.add(this.floor);

  //add becnch
  this.bench    = new CeilingPlaceHolder(this.width, MODULE_WIDTH * 2, MODULE_FIXED_HEIGHT[0]);
  this.bench.mesh_object.material.color.setHex( getColor("interior") );
  this.bench.position.set(0, 0, -(this.depth)/2 + MODULE_WIDTH );
  this.add(this.bench);

}
CabineGrid.prototype = new THREE.Object3D();
CabineGrid.prototype.constructor = CabineGrid;

CabineGrid.prototype.getWallPositions=function(length, depth){
  var items =[];

  items[0] = {position:[0,0,depth/2], orientation:0,              length:length,  visible:true, door:true};
  items[1] = {position:[length/2,0,0], orientation:0.5 * Math.PI, length:depth,   visible:true, flip:-1};
  items[2] = {position:[0,0,-depth/2], orientation:1 * Math.PI,   length:length,  visible:true, flip:-1};
  items[3] = {position:[-length/2,0,0], orientation:1.5 * Math.PI,length:depth,   visible:true};

  return items;
}

// returns dimensions of the cabine
CabineGrid.prototype.getDim=function(){
  return [this.width, this.height, this.length];
}

// updates the dimensions and walls accordingly
CabineGrid.prototype.setDim=function(dim_index, value){

  switch(dim_index){
    case 0:
      this.setWidth(value);
      break;
    case 1:
      this.setHeight(value);
      break;
    case 2:
      this.setDepth(value);
      break;
    default:
      console.log("default");
  }
}

// set width of the complete cabine
CabineGrid.prototype.setWidth=function(value){

  // test value so it doesn't exceed minimum
  value = (value < this.minimum_size)? this.minimum_size: value;

  this.width = value - 2 * MODULE_THICKNESS;


  this.ceiling.setWidth(value);
  this.floor.setWidth(value);
  this.bench.setWidth(this.width);

  this.walls[1].position.x = this.width/2;
  this.walls[3].position.x = -this.width/2;

  this.walls[0].setLength(this.width);
  this.walls[2].setLength(this.width);

}

// set width of the complete cabine
CabineGrid.prototype.setDepth = function(value){

  value = (value < this.minimum_size)? this.minimum_size: value;

  this.depth = value - 2* MODULE_THICKNESS;

  this.ceiling.setLength(value);
  this.floor.setLength(value);
  this.bench.position.set(0,0,- this.depth/2 + MODULE_WIDTH);


  this.walls[0].position.z = this.depth/2;
  this.walls[2].position.z = -this.depth/2;

  this.walls[1].setLength(this.depth);
  this.walls[3].setLength(this.depth);
}

// set width of the complete cabine
CabineGrid.prototype.setHeight=function(value){

  value = (value < this.minimum_height)? this.minimum_height: value;

  this.height = value - FLOOR_THICKNESS - CEILING_THICKNESS;

  for(var i =0; i<this.walls.length; i++){
    this.walls[i].setHeight(this.height)
  }

  this.ceiling.position.y = this.height

}

// set width of the complete cabine
CabineGrid.prototype.placeHeaters=function(){
  for(var i=1; i<this.walls.length; i++){
    this.walls[i].updateConfig();
  }
}

// var items;
// parent class ModuleSmall
function CeilingPlaceHolder(w, d, thickness){

  THREE.Object3D.call( this );

  // create floor box
  var geometry = new THREE.BoxGeometry( w, thickness, d );

  geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, thickness/2, 0) );
  this.mesh_object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x333333 } ) );

  // this.corner_mesh.position.set( 0, thickness/2, 0);
  this.add( this.mesh_object );
}
CeilingPlaceHolder.prototype = new THREE.Object3D();
CeilingPlaceHolder.prototype.constructor = CeilingPlaceHolder;

// set width of the complete cabine
CeilingPlaceHolder.prototype.setWidth=function(value){
  var factor =  value / this.mesh_object.geometry.parameters.width; // === 1
  this.mesh_object.scale.x = factor;
}

// set width of the complete cabine
CeilingPlaceHolder.prototype.setLength=function(value){
  var factor =  value / this.mesh_object.geometry.parameters.depth; // === 1
  this.mesh_object.scale.z = factor;
}

// set width of the complete cabine
CeilingPlaceHolder.prototype.setHeight=function(value){
  console.log('height:' + value);
}
