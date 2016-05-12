function Block(geometry){
  THREE.Object3D.call( this );

  this.placeholders = [];
  this.type = geometry.type;
  this.name = geometry.type;

  this.mesh_object = _mesh_objects[this.type].clone()

  this.width = 1;

  var edges = new THREE.EdgesHelper( this.mesh_object.clone(), 0x000000 );
  this.add(edges);
  this.add(this.mesh_object)


  this.addPlaceHolders();

}

Block.prototype = new THREE.Object3D();
Block.prototype.constructor = Block;


Block.prototype.addPlaceHolders = function(){
    console.log('cannot add placeholders for abstract class "block"');
}

Block.prototype.addBlock = function(){


}

Block.prototype.setWidth = function(value){

}


Block.prototype.updateColors = function(){

}
