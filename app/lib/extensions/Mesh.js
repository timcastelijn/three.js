



THREE.Mesh.prototype.updateBoundingVolumes = function(){

  var vertexSets = this.geometry.morphTargets.map(function(target) { return target.vertices; })
  var allVertices = this.geometry.vertices.concat.apply(this.geometry.vertices, vertexSets);

  this.geometry.boundingSphere = new THREE.Sphere();
  this.geometry.boundingSphere.setFromPoints(allVertices);
  this.geometry.boundingBox = new THREE.Box3();
  this.geometry.boundingBox.setFromPoints(allVertices);
}



THREE.Mesh.prototype.updateVertices = function(){

  if(!this.geometry.original_vertices){
    this.geometry.original_vertices = []
    for (var i = 0; i < this.geometry.vertices.length; i++) {
      this.geometry.original_vertices[i]= this.geometry.vertices[i].clone();
    }
  }

  var morphTargets = this.geometry.morphTargets;
  // var morphInfluences = this.morphTargetInfluences;
  var morphInfluences = this.mti;
  morphInfluences[0] = this.morphTargetInfluences[0];

  for (var i = 0; i < this.geometry.vertices.length; i++) {


    var vA = new THREE.Vector3();
    var tempA = new THREE.Vector3();


    var fvA = this.geometry.original_vertices[i]; // the vertex to transform

    for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

        var influence = morphInfluences[ t ];

        if ( influence === 0 ) continue;

        var targets = morphTargets[ t ].vertices;

        vA.addScaledVector( tempA.subVectors( targets[ i ], fvA ), influence ); // targets index must match vertex index

    }

    this.geometry.vertices[i].x = fvA.x +  vA.x;
    this.geometry.vertices[i].y = fvA.y +  vA.y;
    this.geometry.vertices[i].z = fvA.z +  vA.z;


  }

  this.geometry.verticesNeedUpdate = true;
  this.geometry.computeBoundingSphere();
  this.geometry.computeBoundingBox();
}


THREE.Mesh.prototype.cloneGeometry = function(){

  var clone =this.geometry.clone();

  for (var i = 0; i < this.geometry.morphTargets.length; i++) {
    var morph_target = this.geometry.morphTargets[i]
    clone.morphTargets[i] = {name:morph_target.name};
    clone.morphTargets[i].vertices = []
    for (var j = 0; j < morph_target.vertices.length; j++) {
      clone.morphTargets[i].vertices.push( morph_target.vertices[j].clone() );
    }
  }

  return clone;
}
