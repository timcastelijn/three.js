var modelLoadedCallback = function(type, config_file){
  return function ( geometry, materials ) {

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();


    if(type == 'wo_i_300'){console.log(type, materials);}

    _patch_table[type] = {};
    for (var i = 0; i < materials.length; i++) {
      var name = materials[i].name;

      materials[i] = new THREE.MeshPhongMaterial( { name:name, opacity:materials[i].opacity, transparent:materials[i].transparent, color: 0xffffff, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } )
      // console.log(name, materials[i].name);

      _patch_table[type][i] = name;
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
