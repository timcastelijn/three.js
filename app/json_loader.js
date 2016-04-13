var modelLoadedCallback = function ( geometry, materials ) {

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  materials[1] = new THREE.MeshPhongMaterial( { color: getColor("interior"), shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );

  var material = new THREE.MultiMaterial( materials );


  heater_object = new THREE.Mesh( geometry, material );
  if(SHADOWS_ENABLED){
    heater_object.castShadow = true
    heater_object.receiveShadow = true
  }

  cabine.placeHeaters();
}
