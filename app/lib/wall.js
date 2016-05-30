function Wall(geometry, selector){
  Block.call( this, geometry, selector );

}

Wall.prototype = Object.create(Block.prototype);

Wall.prototype.addPatches = function(){
  this.patches = {
    2:{types:["floor"], position:new THREE.Vector3(0,2.5,0)},
    3:{types:["floor"], position:new THREE.Vector3(0,2.5,0)},
  },
  this.snap_areas ={

  }

}
