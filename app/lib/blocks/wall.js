function Wall(object, selector){
  Block.call( this, object, selector );

  var texture = new THREE.TextureLoader().load( "textures/underlayment.jpg" );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( this.size[0], this.size[1] );

  var type = object.type;

  var material = getMaterialIndex(type, 'cladding');

  if(material){
    material.map = texture;
  }

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
