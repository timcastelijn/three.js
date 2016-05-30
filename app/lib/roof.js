function Roof(geometry, selector){
  Block.call( this, geometry, selector );

}

Roof.prototype = Object.create(Block.prototype);

Roof.prototype.addPatches = function(){
  this.patches = {},
  this.snap_areas ={

  }

}
