function Wall(object, selector){
  Block.call( this, object, selector );

}

Wall.prototype = Object.create(Block.prototype);


Wall.prototype.setMorphtargets = function () {


  var n = (this.size[0] == 0.6)? 1: 0;

  this.mesh_object.morphTargetInfluences[ 1] = n;
  this.mesh_object.morphTargetInfluences[ 2] = this.size[1];

};

Wall.prototype.addPatches = function(){
  this.patches = {
    2:{types:["floor"], position:new THREE.Vector3(0,2.5,0)},
    3:{types:["floor"], position:new THREE.Vector3(0,2.5,0)},
  },
  this.snap_areas ={
    fl:{
      1:{position_min:[0, 2.5, 0], position_max:[this.size[0], 2.5, 0], offset:[0.0, 0, 0.0], rotation:0 * Math.PI }
    }
  }

}
