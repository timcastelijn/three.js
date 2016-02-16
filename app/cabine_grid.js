

// define constants
WALLS = 4;
MODULE_WIDTH = 0.256; //m
MODULE_HEIGHT = 0.600; //m
MODULE_THICKNESS = 0.1; //m

// var items;
// parent class ModuleSmall
function CabineGrid(){

  THREE.Object3D.call( this );

	this.length = 5*0.256-0.130;
	this.width = 4*0.256-0.13;
  this.height = 1.800;

  this.walls = [];

  this.position.set(-this.length/2, 0, -this.width/2);

  //initialize walls
  var items = this.getWallPositions(this.length, this.width);

  for(var i=0; i<items.length ;i++) {
    item = items[i];

    //create new wall item
    var wall = new Wall( item.length, this.height, item.flip, item.door);

    //set wall properties
    wall.position.set(item.position[0], item.position[1], item.position[2]);
    wall.rotation.set(0,item.orientation,0);

    //add wall to Cabinegrid
    this.add(wall);
  }
}
CabineGrid.prototype = new THREE.Object3D();
CabineGrid.prototype.constructor = CabineGrid;

CabineGrid.prototype.getWallPositions=function(length, width){
  var items =[];

  items[0] = {position:[0,0,0], orientation:0, length:length, flip:false,door:3};
  items[1] = {position:[-MODULE_THICKNESS,0,width+MODULE_THICKNESS], orientation:0.5 * Math.PI, length:width, flip:false};
  items[2] = {position:[length,0,width+2*MODULE_THICKNESS], orientation:1 * Math.PI, length:length, flip:false,door:3};
  items[3] = {position:[length+MODULE_THICKNESS,0,MODULE_THICKNESS], orientation:1.5 * Math.PI, length:width, flip:true};

  return items;
}
//

//wall class
function Wall( length, height, flip, door){
  THREE.Object3D.call( this );
  //var geometry = new THREE.BoxGeometry(1,1,1);
  //var wall = new THREE.Mesh(geometry);
  // var wall = new THREE.Object3D();
  this.length=length;
  this.height=height;

  var rest_width = this.length%MODULE_WIDTH;

  var length_offset = 0;
  if(flip){
      length_offset = rest_width;
  }

  var i;
  for(i=0;i<this.length/MODULE_WIDTH-1; i++){
    if(door && i < door){
    }else{
      for(var j=0; j<this.height/MODULE_HEIGHT; j++){
        //define normal cells
        var cell = new Cell(MODULE_WIDTH, MODULE_HEIGHT, MODULE_THICKNESS);
        this.add(cell);
        objects.push(cell);
        cell.position.set( (i + 0.5) * MODULE_WIDTH + length_offset, (j +0.5) * MODULE_HEIGHT, 0.5*MODULE_THICKNESS );
      }
    }

    //define rest cells
  }

  for(var j=0; j<this.height/MODULE_HEIGHT; j++){
    //define normal cells
    var cell = new Cell(rest_width, MODULE_HEIGHT, MODULE_THICKNESS);
    this.add(cell);
    var length_pos = (i + 0.5) * MODULE_WIDTH -0.5* rest_width
    if(flip){
      length_pos = 0 + 0.5* rest_width;
    }
    cell.position.set( length_pos, (j +0.5) * MODULE_HEIGHT, 0.5*MODULE_THICKNESS );
  }

}
Wall.prototype = new THREE.Object3D();
Wall.prototype.constructor = Wall;


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
