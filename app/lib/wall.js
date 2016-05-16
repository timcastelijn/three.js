function Wall(geometry){
  Block.call( this, geometry );

}

Wall.prototype = Object.create(Block.prototype);

Wall.prototype.addPatches = function(){
  this.patches = {}

}
