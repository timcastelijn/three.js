var modelLoadedCallback = function(type, config_file){
  return function ( geometry, materials ) {

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();


    for (var i = 0; i < materials.length; i++) {
      console.log(materials[i]);
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

      }else if(materials[i].name == "cladding"){
        var texture = new THREE.TextureLoader().load( "textures/underlayment.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 1, 1 );

        materials[i] = new THREE.MeshPhongMaterial( { map:texture, color: 0xffffff, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
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
