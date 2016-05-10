function Floor(geometry){
  Block.call( this, geometry );

}

Floor.prototype = Object.create(Block.prototype);

// Floor.prototype = new Block();
// Floor.prototype.constructor = Block;


Floor.prototype.addPlaceHolders = function(){

  var geometry = new THREE.BoxGeometry(0.2,2.7,0.6);

  geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0.2/2,2.7/2,-0.6/2) );
  var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xff000000 } ) );
  this.add(mesh)
  this.placeholders.push(mesh)
}
