function RoofEnd(object, selector){
  Block.call( this, object, selector );

  this.geometry.uvsNeedUpdate = true;


}

RoofEnd.prototype = Object.create(Block.prototype);

RoofEnd.prototype.setMorphtargets = function () {

  var angle_rad = this.angle/180*Math.PI;

  this.size[1] =  this.size[0]*Math.tan(angle_rad) / 2;

  this.mesh_object.morphTargetInfluences[ 1] = this.size[0];
  this.mesh_object.morphTargetInfluences[ 2] = this.size[1];

};

RoofEnd.prototype.getNormal = function () {
  var end = this.localToWorld(new THREE.Vector3(0,0,-1))
  var begin = this.localToWorld(new THREE.Vector3(0,0,0))

  return end.sub(begin);
};

RoofEnd.prototype.addPatches = function(){

}
