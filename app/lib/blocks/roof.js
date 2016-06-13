function Roof(object, selector){
  Block.call( this, object, selector );

}

Roof.prototype = Object.create(Block.prototype);

Roof.prototype.setMorphtargets = function () {

  var angle_rad = this.angle/180*Math.PI;

  this.size[1] =  this.size[0]*Math.tan(angle_rad);

  this.mesh_object.morphTargetInfluences[ 1] = this.size[0];
  this.mesh_object.morphTargetInfluences[ 2] = this.size[1];
  this.mesh_object.morphTargetInfluences[ 3] = this.size[2];

  var h = this.size[1];
  var l = this.size[0];

  this.mesh_object.morphTargetInfluences[ 4] = 0.3 / Math.cos(angle_rad);
  this.mesh_object.morphTargetInfluences[5] = 0.3 / l * h
};


Roof.prototype.addPatches = function(){
  this.patches = {},
  this.snap_areas ={

  }

}
