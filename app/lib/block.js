function Block(geometry){
  THREE.Object3D.call( this );

  this.placeholders = [];
  this.type = geometry.type;
  this.name = geometry.type;

  this.mesh_object = _mesh_objects[this.type].clone()



  this.width = geometry.size;

  // this.updateSize();


  this.edges = new THREE.EdgesHelper( this.mesh_object.clone(), 0x000000 );
  this.add(this.edges);
  this.add(this.mesh_object)


  this.addPatches();

  var axisHelper = new THREE.AxisHelper( 0.2 );
  this.add( axisHelper );

}

Block.prototype = new THREE.Object3D();
Block.prototype.constructor = Block;


Block.prototype.updateSize = function(){
  if(this.width){
    console.log(this.width);
    // this.mesh_object.morphTargetInfluences[0] = 0;
    this.mesh_object.morphTargetInfluences[1] = this.width-1;

    // this.updateVertices()
  }
}

Block.prototype.updateVertices = function(){

  for (var i = 0; i < this.mesh_object.geometry.vertices.length; i++) {

    var morphTargets = this.mesh_object.geometry.morphTargets;
    var morphInfluences = this.mesh_object.morphTargetInfluences;

    var vA = new THREE.Vector3();
    var tempA = new THREE.Vector3();

    var fvA = this.mesh_object.geometry.vertices[ i ]; // the vertex to transform

    for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

        var influence = morphInfluences[ t ];

        if ( influence === 0 ) continue;

        var targets = morphTargets[ t ].vertices;

        vA.addScaledVector( tempA.subVectors( targets[ i ], fvA ), influence ); // targets index must match vertex index

    }

    fvA.add( vA ); // the transformed value
    // this.mesh_object.geometry.vertices[ i ] = vA.add( fvA ); // the transformed value
  }
}

Block.prototype.addPatches = function(){
    console.log('cannot add placeholders for abstract class "block"');
}

Block.prototype.addBlock = function(){


}

Block.prototype.setWidth = function(value){

}


Block.prototype.updateColors = function(){

}
