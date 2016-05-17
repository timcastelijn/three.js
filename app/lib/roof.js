function Roof(geometry){
  Block.call( this, geometry );

}

Roof.prototype = Object.create(Block.prototype);

Roof.prototype.addPatches = function(){
  this.patches = {}

}
