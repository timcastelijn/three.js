

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

var BACKREST_TOTAL_WIDTH= 5; //m
var BACKREST_THICKNESS  = 0.1; //m


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

    this.walls[i].updateConfig();

  }

  // add ceiling
  this.ceiling  = new Cap(this.width, this.depth);
  this.ceiling.position.set(0,this.height,0);
  this.ceiling.rotation.set(0,0,Math.PI);
  this.add(this.ceiling);

  // //add floor
  this.floor = new Cap(this.width, this.depth);
  this.add(this.floor)

  this.bench = new Bench(this.width, this.depth);
  this.add(this.bench)


}
CabineGrid.prototype = new THREE.Object3D();
CabineGrid.prototype.constructor = CabineGrid;


CabineGrid.prototype.getCellLayout=function(){
  config.heaters = []

  if(cabine){
    for(var i = 0; i<this.walls.length; i++){
      var wall = this.walls[i];
      for(var j = 0; j<wall.cells.length; j++){
        var column = wall.cells[j];
        console.log(column);
        if(column){
          for(var k = 0; k<this.walls[i].cells[j].length; k++){
            var cell = column[k];
            if (cell.type == 1){
              config.heaters.push(i + '-'+ j +',' + k);
            }
          }
        }
      }
    }
  } else {
    config.heaters = "de simpele editor ondersteunt deze optie nog niet"
  }
}

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


// updates the dimensions and walls accordingly
CabineGrid.prototype.setOption = function(index, boolean){
  switch(index){
    case 2: //zout
      this.walls[2].addVaporizer( boolean);
      break;
    case 3: //rugsteun
      this.addBackrest(boolean)
      break;
    case 4: //aromatherapie
      this.walls[3].addAromaTherapy( boolean )
      break;
    case 5: //Sterrenhemel
      this.addLeds( boolean )
      break;
    default:
      console.log("default");
  }
}

// add backrest to the scene
CabineGrid.prototype.addLeds = function(boolean){

    if (this.leds){
      this.leds.setVisible(boolean);
    } else {
      // create leds
      this.leds = new Leds(this.width, this.height, this.depth);
      this.leds.setVisible(boolean);
    }
}

// add backrest to the scene
CabineGrid.prototype.addBackrest=function(boolean){

  if(boolean){
    this.add(_models.backrest.mesh);
  }else {
    this.remove(_models.backrest.mesh)
  }
  this.setBackrestWidth();
}

CabineGrid.prototype.setBackrestWidth=function(){
  _models.backrest.mesh.morphTargetInfluences[1] = this.width/BACKREST_TOTAL_WIDTH;
  // backrest_object.morphTargetInfluences[2] = 0.8;
  _models.backrest.mesh.position.set(-0.5*this.width, MODULE_FIXED_HEIGHT[0] + 0.05, -0.5 * this.depth + BACKREST_THICKNESS);
}


// set width of the complete cabine
CabineGrid.prototype.setWidth=function(value){

  // test value so it doesn't exceed minimum
  value = (value < this.minimum_size)? this.minimum_size: value;

  this.width = value - 2 * MODULE_THICKNESS;


  this.ceiling.setWidth(value);
  this.floor.setWidth(value);
  this.bench.setWidth(this.width);

  this.setBackrestWidth();


  if (this.leds){
    this.leds.setWidth(this.width);
  }

  this.walls[1].position.x = this.width/2;
  this.walls[3].position.x = -this.width/2;

  this.walls[0].setLength(this.width);
  this.walls[2].setLength(this.width);

}

// set width of the complete cabine
CabineGrid.prototype.setDepth = function(value){

  value = (value < this.minimum_size)? this.minimum_size: value;

  this.depth = value - 2* MODULE_THICKNESS;

  this.ceiling.setDepth(value);
  this.floor.setDepth(value);
  this.bench.position.set(0,0,- this.depth/2 + MODULE_WIDTH);

  this.setBackrestWidth();

  if (this.leds){
    this.leds.setDepth(this.depth);
  }

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

  if (this.leds){
    this.leds.setHeight(this.height);
  }

}

// set width of the complete cabine
CabineGrid.prototype.updateColors=function(){
  this.floor.updateColors();
  this.ceiling.updateColors();
  this.bench.updateColors();

  for(var i=0; i<this.walls.length; i++){
    this.walls[i].updateColors();
  }

  //update parent colors
  _models.heater.mesh.material.materials[1].color.set(colors.interior);
}
