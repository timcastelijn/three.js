var modelLoadedCallback = function(type, config_file){
  return function ( geometry, materials ) {

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    _material_table[type] = {}
    for (var i = 0; i < materials.length; i++) {

      _material_table[type][materials[i].name] = i;
      console.log(type, materials[i].name, i);

      if (materials[i].opacity<1) {

        materials[i] = new THREE.MeshPhongMaterial( {
          color: materials[i].color,
          shininess:0.5,
          reflectivity:0.2,
          transparent:true,
          opacity:materials[i].opacity,
          morphTargets: true,
          vertexColors: THREE.FaceColors,
          shading: THREE.FlatShading } );

      }else{
        materials[i] = new THREE.MeshPhongMaterial( { color: 0xffffff, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
      }
    }

    var material = new THREE.MultiMaterial( materials );

    _mesh_objects[type] = new THREE.Mesh( geometry, material );


    _models_loading--
    if(_models_loading ==0){
      console.log('all models loaded');
      loadConfig(config_file)
    }
  }
}

function getMaterialIndex(type, name){
  return _material_table[type][name];
}
