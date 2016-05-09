function Bench(width, depth){
  THREE.Object3D.call( this );

  this.width = width;
  this.depth = depth;

  var json_loader = new THREE.JSONLoader( );
  json_loader.load( "models/bench.json", loadBench);


}

Bench.prototype = new THREE.Object3D();
Bench.prototype.constructor = Bench;


Bench.prototype.addBench = function(){

  this.mesh = bench_object.clone()

  this.add(this.mesh )


  this.mesh.morphTargetInfluences[1]=this.width/4;
  this.position.z = -this.depth/2+MODULE_WIDTH;

}

Bench.prototype.setWidth = function(value){
  this.width = value;
  this.mesh.morphTargetInfluences[1]=this.width/4;
}


Bench.prototype.updateColors = function(){
    this.mesh.material.materials[0].color.set(colors.interior);
}
