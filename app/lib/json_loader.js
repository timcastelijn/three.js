var modelLoadedCallback = function(model){
  return function ( geometry, materials ) {

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();


    var material = new THREE.MultiMaterial( materials );

    model.mesh = new THREE.Mesh( geometry, material );


    _models_loading--
    if(_models_loading ==0){
      console.log('all models loaded');
      loadConfig()
    }
  }
}
