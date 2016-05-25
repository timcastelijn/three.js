function Cap(width, depth){
  THREE.Object3D.call( this );

  this.width = width+2*MODULE_THICKNESS;
  this.depth = depth+2*MODULE_THICKNESS;

  //clone the imported mesh and set materials
  this.mesh = _models.cap.mesh.clone()
  this.mesh.material.materials[0] = new THREE.MeshPhongMaterial( { color: colors.exterior, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
  this.mesh.material.materials[1] = new THREE.MeshPhongMaterial( { color: "#333333", shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
  this.mesh.material.materials[2] = new THREE.MeshPhongMaterial( { color: colors.floor, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );

  this.add(this.mesh )

  this.mesh.morphTargetInfluences[1]=this.width;
  this.mesh.morphTargetInfluences[2]=this.depth;
  this.mesh.position.y = -FLOOR_THICKNESS;

}

Cap.prototype = new THREE.Object3D();
Cap.prototype.constructor = Cap;


Cap.prototype.setWidth = function(value){
  this.width = value;
  this.mesh.morphTargetInfluences[1]=this.width;
}

Cap.prototype.setDepth = function(value){
  this.depth = value;
  this.mesh.morphTargetInfluences[2]=this.depth;
}

Cap.prototype.updateColors = function(){

  this.mesh.material.materials[0].color.set(colors.exterior);
  this.mesh.material.materials[2].color.set(colors.floor);

}
