var modelLoadedCallback = function(type, config_file){
  return function ( geometry, materials ) {

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    if(geometry.morphTargets.length>0){
      materials[0].morphTargets = true
    }
    // var material = new THREE.MultiMaterial( materials );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );

    _mesh_objects[type] = new THREE.Mesh( geometry, material );



    _models_loading--
    console.log('models left to load', _models_loading);
    if(_models_loading ==0){
      console.log('ready to load config file');
      loadConfig(config_file)
    }
  }
}

var loadFloor = function ( geometry, materials ) {

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  materials[0] = new THREE.MeshPhongMaterial( { color: colors.floor, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
  materials[1] = new THREE.MeshPhongMaterial( { color: colors.exterior, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );

  var material = new THREE.MultiMaterial( materials );
  floor_object = new THREE.Mesh( geometry, material );

  floor_object.castShadow = SHADOWS_ENABLED
  floor_object.receiveShadow = SHADOWS_ENABLED

  cabine.floor.addCap()
}

var loadBench = function ( geometry, materials ) {

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  materials[0] = new THREE.MeshPhongMaterial( { color: colors.interior, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );

  var material = new THREE.MultiMaterial( materials );
  bench_object = new THREE.Mesh( geometry, material );

  bench_object.castShadow = SHADOWS_ENABLED
  bench_object.receiveShadow = SHADOWS_ENABLED

  cabine.bench.addBench()
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
