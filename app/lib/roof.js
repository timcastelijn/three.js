function Roof(geometry){
  Block.call( this, geometry );

}

Roof.prototype = Object.create(Block.prototype);

Roof.prototype.addPatches = function(){
  this.patches = {
      2:{type:"floor", position:new THREE.Vector3(0,2.5,0)},
      3:{type:"floor", position:new THREE.Vector3(0,2.5,0)},
  }

}
