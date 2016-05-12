function Wall(geometry){
  Block.call( this, geometry );

}

Wall.prototype = Object.create(Block.prototype);

Wall.prototype.addPatches = function(){
  this.patches = {
      2:{type:"floor", position:new THREE.Vector3(0,2.5,0)},
      3:{type:"floor", position:new THREE.Vector3(0,2.5,0)},
  }

}

Wall.prototype.addPlaceHolders = function(){


}
