function Wall(object, selector){
  Block.call( this, object, selector );

  var texture = new THREE.TextureLoader().load( "textures/underlayment.jpg" );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 1, 1 );

  var type = object.type;

  var index = getMaterialIndex(type, 'cladding');
  this.mesh_object.material.materials[index] = new THREE.MeshPhongMaterial({map:texture, color: 0xffffff, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading});

}

Wall.prototype = Object.create(Block.prototype);

Wall.prototype.addPatches = function(){
  this.patches = {
    2:{types:["floor"], position:new THREE.Vector3(0,2.5,0)},
    3:{types:["floor"], position:new THREE.Vector3(0,2.5,0)},
  },
  this.snap_areas ={
    fl:{
      1:{position_min:[0, 2.5, 0], position_max:[this.size[0], 2.5, 0], offset:[0.0, 0, 0.0], rotation:0 * Math.PI }
    }
  }

}
