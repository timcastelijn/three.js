function RoofEnd(object, selector){
  Block.call( this, object, selector );

}

RoofEnd.prototype = Object.create(Block.prototype);

RoofEnd.prototype.setMorphtargets = function () {

  var angle_rad = this.angle/180*Math.PI;

  this.size[1] =  this.size[0]*Math.tan(angle_rad) / 2;

  this.mesh_object.morphTargetInfluences[ 1] = this.size[0];
  this.mesh_object.morphTargetInfluences[ 2] = this.size[1];

};


RoofEnd.prototype.addPatches = function(){
  this.patches = {},
  this.snap_areas ={

  }

}
