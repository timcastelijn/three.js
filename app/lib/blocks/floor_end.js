function FloorEnd(geometry, selector){
  Floor.call( this, geometry, selector );

}

FloorEnd.prototype = Object.create(Floor.prototype);


FloorEnd.prototype.addPatches = function(){
  this.snap_areas ={
    wo:{
      4:{position_min:[0.3, 0.3, 0], position_max:[this.size[0] - 0.3, 0.3, 0.0], offset:[0.3, 0,0], rotation:- 0.5 * Math.PI }
    },
    wo_oc:{
      1:{position:new THREE.Vector3(this.size[0],0.3,0.3), rotation:Math.PI},
      3:{position:new THREE.Vector3(0, 0.3, 0), rotation:0},
    }

  }

}
