function Bench(width, depth){
  THREE.Object3D.call( this );

  this.width = width;
  this.depth = depth;

  this.mesh = _models.bench.mesh;
  this.mesh.material.materials[0] = new THREE.MeshPhongMaterial( { color: colors.interior, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
  this.mesh.material.materials[1] = new THREE.MeshPhongMaterial( { color: "#111111", shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );


  this.add(this.mesh )


  this.mesh.morphTargetInfluences[1]=this.width/4;
  this.position.z = -this.depth/2+MODULE_WIDTH;


}

Bench.prototype = new THREE.Object3D();
Bench.prototype.constructor = Bench;


Bench.prototype.setWidth = function(value){
  this.width = value;
  this.mesh.morphTargetInfluences[1]=this.width/4;
}


Bench.prototype.updateColors = function(){
    this.mesh.material.materials[0].color.set(colors.interior);
}
