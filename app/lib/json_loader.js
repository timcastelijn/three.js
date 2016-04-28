var modelLoadedCallback = function ( geometry, materials ) {

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  materials[1] = new THREE.MeshPhongMaterial( { color: colors.interior, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );

  var material = new THREE.MultiMaterial( materials );
  heater_object = new THREE.Mesh( geometry, material );

  heater_object.castShadow = SHADOWS_ENABLED
  heater_object.receiveShadow = SHADOWS_ENABLED

  cabine.placeHeaters();
}

// cell type 2
var loadVaporizer = function ( geometry, materials ) {

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  // var material = new THREE.MeshLambertMaterial( { color: getColor("interior"), shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
  // var material = new THREE.MeshPhongMaterial( { color: getColor("interior"), shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );

  materials[0] = new THREE.MeshPhongMaterial( { color: colors.interior, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );


  var material = new THREE.MultiMaterial( materials );

  vaporizer_object = new THREE.Mesh( geometry, material);

  vaporizer_object.castShadow = SHADOWS_ENABLED
  vaporizer_object.receiveShadow = SHADOWS_ENABLED

}

var loadBackrest = function ( geometry ) {

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  // var material = new THREE.MeshLambertMaterial( { color: getColor("interior"), shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
  var material = new THREE.MeshPhongMaterial( { color: colors.bamboo, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );

  backrest_object = new THREE.Mesh( geometry, material);

  backrest_object.castShadow = SHADOWS_ENABLED
  backrest_object.receiveShadow = SHADOWS_ENABLED

}

// type 3
var loadAromatherapy = function ( geometry, materials ) {

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  materials[0] = new THREE.MeshPhongMaterial( { color: colors.interior, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
  materials[3] = new THREE.MeshPhongMaterial( { color: 0xcccccc, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );

  var material = new THREE.MultiMaterial( materials );

  shelf_object = new THREE.Mesh( geometry, material);
  shelf_object.morphTargetInfluences[1]=1;

  shelf_object.castShadow = SHADOWS_ENABLED
  shelf_object.receiveShadow = SHADOWS_ENABLED

}
