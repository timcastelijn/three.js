function Wall(object, selector){
  Block.call( this, object, selector );

}

Wall.prototype = Object.create(Block.prototype);


// Wall.prototype.setMorphtargets = function () {
//
//
//   var n = (this.size[0] == 0.6)? 1: 0;
//
//   // console.log(this.type, this.mesh_object.material.materials);
//
//   this.mesh_object.morphTargetInfluences[ 1] = n;
//   this.mesh_object.morphTargetInfluences[ 2] = this.size[1];
//
// };

Wall.prototype.addPatches = function(){
  this.patches = {
  },
  this.snap_areas ={
    fl:{
      floor_patch:{position_min:[0, this.size[1], 0], position_max:[0, this.size[1], this.size[0]], offset:[0.0, 0, 0.0], rotation:[0,0,0] }
    }
  }

}
