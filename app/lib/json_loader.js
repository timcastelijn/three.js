var modelLoadedCallback = function(type, config_file){
  return function ( geometry, materials ) {

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();


    for (var i = 0; i < materials.length; i++) {
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
    // var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
    // var material = new THREE.MeshLambertMaterial( { color: 0xffffff, morphTargets: true, vertexColors: THREE.FaceColors} );



    _mesh_objects[type] = new THREE.Mesh( geometry, material );

    // if(geometry.morphTargets.length>0){
    //   m = _mesh_objects[type].clone();
    //   m.morphTargetInfluences[1] = 1;
    //   m.material.wireframe = true
    //   scene.add(m)
    //   m.position.set(-2,0, 5)
    //
    //
    // }

    _models_loading--
    if(_models_loading ==0){
      console.log('all models loaded');
      loadConfig(config_file)
    }
  }
}
