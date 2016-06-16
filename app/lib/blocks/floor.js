function Floor(geometry, selector){
  Block.call( this, geometry, selector );

}

Floor.prototype = Object.create(Block.prototype);


Floor.prototype.addPatches = function(){
  this.patches = {
      2:{types:["wall", "roof"], position:new THREE.Vector3(this.width,0.3,0.3), rotation:Math.PI},
      3:{types:["wall", "roof"], position:new THREE.Vector3(this.width,0.3,0.3), rotation:Math.PI},
      14:{types:["wall", "roof"], position:new THREE.Vector3(0, 0.3, 0)},
      15:{types:["wall", "roof"], position:new THREE.Vector3(0, 0.3, 0)},
      18:{types:["floor"], position:new THREE.Vector3(0, 0.0, 0.3)},
      19:{types:["floor"], position:new THREE.Vector3(0, 0.0, 0.3)},
      30:{types:["floor"], position:new THREE.Vector3(0, 0.0, 0.3)},
      31:{types:["floor"], position:new THREE.Vector3(0, 0.0, 0.3)},
      6:{types:["floor"], position:new THREE.Vector3(0, 0.0, 0.3)},
      7:{types:["floor"], position:new THREE.Vector3(0, 0.0, 0.3)},
      10:{types:["floor"], position:new THREE.Vector3(this.width, 0.0, 0.0), rotation:Math.PI},
      11:{types:["floor"], position:new THREE.Vector3(this.width, 0.0, 0.0), rotation:Math.PI},
      34:{types:["floor"], position:new THREE.Vector3(this.width, 0.0, 0.0), rotation:Math.PI},
      35:{types:["floor"], position:new THREE.Vector3(this.width, 0.0, 0.0), rotation:Math.PI},
      22:{types:["floor"], position:new THREE.Vector3(this.width, 0.0, 0.0), rotation:Math.PI},
      23:{types:["floor"], position:new THREE.Vector3(this.width, 0.0, 0.0), rotation:Math.PI},
  },
  this.snap_areas ={
    wo:{
      patch_wall2:{position:[this.size[0], 0.3, 0.3 ],  rotation:[0, Math.PI, 0] },
      patch_wall1:{position:[0, 0.3, 0],                rotation:[0,0,0]}
    },
    ro:{
      patch_wall2:{position:[this.size[0],0.3,0.3], rotation:[0, Math.PI, 0] },
      patch_wall1:{position:[0, 0.3, 0],            rotation:[0, 0, 0] }
    },
    // fl:{
    //   // 2:{position:new THREE.Vector3(0, 0.0, 0.3)}
    //   // 2:{base_point:[0.3, 0.0, 0.3], step:[0.3, 0, 0.0], bounds_min:[0.3,0.0,]},
    // }
  }
}

Floor.prototype.moveOverPlane = function(){

  var intersects = this.selector.raycaster.intersectObject( this.selector.plane );
  if ( intersects.length > 0 ) {

    // this.dragged.moveTo(intersects[ 0 ].point);
    var position = new THREE.Vector3().copy(intersects[0].point).divideScalar( 0.3 ).round().multiplyScalar( 0.3 ).add(new THREE.Vector3(0,0,0))//.addScalar( 0.15 );
    console.log(position);
    this.position.copy( position );
  }
}
