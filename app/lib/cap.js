function Cap(width, depth){
  THREE.Object3D.call( this );

  this.width = width;
  this.depth = depth;

  var json_loader = new THREE.JSONLoader( );
  json_loader.load( "models/floor.json", loadFloor);


}

Cap.prototype = new THREE.Object3D();
Cap.prototype.constructor = Cap;

Cap.prototype.addCap = function(){

  this.mesh = floor_object.clone()

  this.add(this.mesh )

  this.mesh.morphTargetInfluences[2]=this.width/5;
  this.mesh.morphTargetInfluences[1]=this.depth/5;
  this.mesh.position.y = -FLOOR_THICKNESS;

}

Cap.prototype.setWidth = function(value){
  this.width = value;
  this.mesh.morphTargetInfluences[2]=this.width/5;
}

Cap.prototype.setDepth = function(value){
  this.depth = value;
  this.mesh.morphTargetInfluences[1]=this.depth/5;
}

Cap.prototype.updateColors = function(){

  this.mesh.material.materials[1].color.set(colors.exterior);
  this.mesh.material.materials[0].color.set(colors.floor);

}
