function Floor(geometry, selector){
  Block.call( this, geometry, selector );

}

Floor.prototype = Object.create(Block.prototype);


Floor.prototype.addPatches = function(){
  this.snap_areas ={
    wo:{
      patch_wall2:{position:[this.size[0], 0.3, 0.3 ],  rotation:[0, Math.PI, 0] },
      patch_wall1:{position:[0, 0.3, 0],                rotation:[0,0,0]}
    },
    ro:{
      patch_wall2:{position:[this.size[0],0.3,0.3], rotation:[0, Math.PI, 0] },
      patch_wall1:{position:[0, 0.3, 0],            rotation:[0, 0, 0] }
    },
    wi:{
      patch_wall3:{position_min:[0.6, 0.3, 0], position_max:[this.size[0] - 0.6, 0.3, 0.3], offset:[0.0, 0,0] }
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
    this.position.copy( position );

    // set to snapped, so it will accept placement position at mouseup
    this.snapped = true;

    // check collisions
    this.overlap = this.selector.bboxOverLap();
  }
}
