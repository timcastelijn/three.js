function loadTextures(){
  var textures = {}
  var texture_loader = new THREE.TextureLoader();

  var files = {
    wood:{file:"textures/underlayment.jpg", wrapping:THREE.RepeatWrapping, repeat:[1,1]},
    aluminium:{file:"textures/label1.jpg", wrapping:THREE.RepeatWrapping, repeat:[1,1]},
  }

  for (var name in files) {
    if (files.hasOwnProperty(name)) {
      _textures_loading++;
      var item = files[name];
      textures[name] = texture_loader.load(item.file, initMaterials)
      textures[name].wrapS = item.wrapping
      textures[name].wrapT = item.wrapping
      textures[name].repeat.set(item.repeat[0], item.repeat[1])

    }
  }
}

var _textures = loadTextures()

function initMaterials(){
  _textures_loading--;
  if (_textures_loading >0){
    return
  }
  _materials = {
    cladding:new THREE.MeshPhongMaterial( { map:_textures.wood, color: 0xffffff, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } ),
    glass:new THREE.MeshPhongMaterial( {color: 0xeeeeff, shininess:0.5, reflectivity:0.2, transparent:true, opacity:0.2, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } ),
    basic:new THREE.MeshPhongMaterial( { color: 0xffffff, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } )
  }
}
