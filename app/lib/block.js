function cloneGeometry(geometry){

  var geometry2 = geometry.clone();

  for (var i = 0; i < geometry.morphTargets.length; i++) {
    var mt = geometry.morphTargets[i]
    geometry2.morphTargets[i] = {name:mt.name};
    geometry2.morphTargets[i].vertices = []
    for (var j = 0; j < mt.vertices.length; j++) {
      geometry2.morphTargets[i].vertices.push( mt.vertices[j].clone() );
    }
  }

  // console.log("A", geometry, "B", geometry2);
  return geometry2;
}

function Block(geometry){
  THREE.Object3D.call( this );

  this.placeholders = [];
  this.type     = geometry.type;
  this.name     = geometry.type;
  this.fid      = geometry.fid;

  this.geometry = cloneGeometry(_mesh_objects[this.type].geometry);
  var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );

  this.mesh_object = new THREE.Mesh(this.geometry, material);

  // this.mesh_object = _mesh_objects[this.type].clone();
  // this.mesh_object.visible = false;

  this.width = geometry.size;

  this.updateSize();


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
    this.mesh_object.morphTargetInfluences[1] = this.width;

    this.updateVertices()
    this.mesh_object.updateMorphTargets();
    this.mesh_object.geometry.computeBoundingSphere();
    this.mesh_object.geometry.computeBoundingBox();

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
