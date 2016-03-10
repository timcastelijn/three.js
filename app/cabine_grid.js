

// define constants
var WALLS = 4;
var MODULE_WIDTH = 0.256; //m
var MODULE_HEIGHT = 0.600; //m
var MODULE_THICKNESS = 0.1; //m
var FLOOR_THICKNESS = 0.1;
var CEILING_THICKNESS = 0.1;

// var items;
// parent class ModuleSmall
function CabineGrid(width, height, depth){

  THREE.Object3D.call( this );

	this.width = width - 2 * MODULE_THICKNESS;
	this.depth = depth - 2 * MODULE_THICKNESS;
  this.height = height - FLOOR_THICKNESS - CEILING_THICKNESS;

  this.walls = [];

  //initialize walls
  var items = this.getWallPositions(this.width, this.depth);

  for(var i=0; i<items.length ;i++) {
    item = items[i];

    //create new wall item
    var wall = new Wall( item.length, this.height, item.flip, item.door);

    //set wall properties
    wall.position.set(item.position[0], 0, item.position[2]);
    // wall.position.set(0, 0, 0);
    wall.rotation.set(0,item.orientation,0);

    wall.visible = item.visible
    //add wall geometry to Cabinegrid
    this.add(wall);

    //add wall object to Cabinegrid
    this.walls[i] = wall;
  }

  // add ceiling
  this.ceiling  = new CeilingPlaceHolder(width, depth, CEILING_THICKNESS);
  this.ceiling.position.set(0,this.height,0);
  this.add(this.ceiling);



  //add floor
  this.floor    = new CeilingPlaceHolder(width, depth, FLOOR_THICKNESS);
  this.floor.position.set(0,-FLOOR_THICKNESS,0);
  this.add(this.floor);

}
CabineGrid.prototype = new THREE.Object3D();
CabineGrid.prototype.constructor = CabineGrid;

CabineGrid.prototype.getWallPositions=function(length, depth){
  var items =[];

  items[0] = {position:[-length/2,0,-depth/2], orientation:0, length:length, visible:true};
  items[1] = {position:[-length/2,0,depth/2], orientation:0.5 * Math.PI, length:depth, visible:true};
  items[2] = {position:[length/2,0,depth/2], orientation:1 * Math.PI, length:length,visible:true};
  items[3] = {position:[length/2,0,-depth/2], orientation:1.5 * Math.PI, length:depth, visible:true};

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
      this.width = value - 2 * MODULE_THICKNESS;
      this.setWidth(value);
      break;
    case 1:
      this.height = value  - CEILING_THICKNESS - FLOOR_THICKNESS;
      this.setHeight(value);
      break;
    case 2:
      this.length = value - 2 * MODULE_THICKNESS;
      this.setLength(value);
      break;
    default:
      console.log("default");
  }
}

// set width of the complete cabine
CabineGrid.prototype.setWidth=function(value){
  console.log('width:' + value);

  this.ceiling.setWidth(value);
  this.floor.setWidth(value);

  this.walls[0].position.x = -this.width/2;
  this.walls[1].position.x = -this.width/2;
  this.walls[2].position.x = this.width/2;
  this.walls[3].position.x = this.width/2;

  this.walls[0].setLength(this.width);
  this.walls[2].setLength(this.width);
}

// set width of the complete cabine
CabineGrid.prototype.setLength=function(value){
  console.log('depth:' + value);

  this.ceiling.setLength(value);
  this.floor.setLength(value);

  this.walls[0].position.z = -this.length/2;
  this.walls[1].position.z = this.length/2;
  this.walls[2].position.z = this.length/2;
  this.walls[3].position.z = -this.length/2;

  this.walls[1].setLength(this.length);
  this.walls[3].setLength(this.length);
}

// set width of the complete cabine
CabineGrid.prototype.setHeight=function(value){
  console.log('height:' + value);
}

// var items;
// parent class ModuleSmall
function CeilingPlaceHolder(w, d, thickness){

  THREE.Object3D.call( this );

  // create floor box
  var geometry = new THREE.BoxGeometry( w, thickness, d );

  geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, thickness/2, 0) );
  this.mesh_object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x111111 } ) );

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
