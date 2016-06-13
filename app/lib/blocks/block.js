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



function Block(geometry, selector){
  Selectable.call( this );

  this.type     = geometry.type;
  this.name     = geometry.type;

  this.fid      = geometry.fid;




  this.geometry = cloneGeometry(_mesh_objects[this.type].geometry);
  this.material.basic = _mesh_objects[this.type].material
  this.mesh_object = new THREE.Mesh(this.geometry, this.material.basic);
  this.mesh_object.name = "mesh_object";
  this.add(this.mesh_object)

  this.size = geometry.size;
  this.angle = geometry.angle;

  this.mt_index = block_files[this.type].mt

  this.setMorphtargets();

  this.updateSize();




  this.edges = new THREE.EdgesHelper( this.mesh_object.clone(), 0x000000 );
  this.edges.name = "edgesHelper";
  this.add(this.edges);


  this.addPatches();

  if(_AXIS_HELPERS){
    var axisHelper = new THREE.AxisHelper( 0.2 );
    axisHelper.name = 'axisHelper';
    this.add( axisHelper );
  }

  // add block to the selector
  this.setSelector(this.mesh_object, selector)

}

Block.prototype = new Selectable();
Block.prototype.constructor = Block;

Block.prototype.setMorphtargets = function () {

  if(!this.mesh_object.morphTargetInfluences){
    return;
  }

  for (var i = 0; i < this.mt_index.length; i++) {

    var index = this.mt_index[i];
    var size = parseFloat(this.size[index]);

    this.mesh_object.morphTargetInfluences[ i + 1] = size;
  }
};

Block.prototype.updateSize = function(){

  this.updateVertices()
  this.mesh_object.updateMorphTargets();
  this.mesh_object.geometry.computeBoundingSphere();
  this.mesh_object.geometry.computeBoundingBox();


}

Block.prototype.updateMaterials = function(){
  // if  multimaterial
  var material = this.mesh_object.material
  if(material.materials.length > 0 ){
    for (var i = 0; i < material.materials.length; i++) {
      material.materials[i] = this.mesh_material.normal
    }
  }
}

Block.prototype.updateVertices = function(){
  var morphTargets = this.mesh_object.geometry.morphTargets;
  var morphInfluences = this.mesh_object.morphTargetInfluences;
  // 
  // if (this instanceof Roof){
  //   for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {
  //     console.log(t,  morphInfluences[ t ]);
  //   }
  // }
  for (var i = 0; i < this.mesh_object.geometry.vertices.length; i++) {

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

Block.prototype.setTransformations = function(position, rotation){
  this.position.set(parseFloat(position[0]),parseFloat(position[1]),parseFloat(position[2]));

  this.rotation.set(0, parseFloat(rotation[1])/180*Math.PI, 0);
}

Block.prototype.addPatches = function(){
    console.log('cannot add placeholders for abstract class "block"');
}

Block.prototype.addBlock = function(){


}




Block.prototype.updateColors = function(){

}
