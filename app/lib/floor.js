function Floor(geometry, selector){
  Block.call( this, geometry, selector );

}

Floor.prototype = Object.create(Block.prototype);

// Floor.prototype = new Block();
// Floor.prototype.constructor = Block;

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
    wall:{
      1:{position:new THREE.Vector3(this.width,0.3,0.3), rotation:0},
      0:{position:new THREE.Vector3(0, 0.3, 0), rotation:Math.PI}
    },
    floor:{
      2:{position:new THREE.Vector3(0, 0.0, 0.3)}
      // 2:{base_point:[0.3, 0.0, 0.3], step:[0.3, 0, 0.0]},
    }
  }
}

// Floor.prototype.moveToArea = function(snap_area, intersect){
//
//   var local_int = intersect.object.parent.worldToLocal(intersect.point).toArray()
//
//   var snap_point = [];
//   for (var i = 0; i < local_int.length; i++) {
//     if (snap_area.step[i]>0){
//       var temp = local_int[i] / snap_area.step[i];
//       snap_point[i] = Math.round(temp) * snap_area.step[i] + snap_area.base_point[i];
//     }else {
//       snap_point[i] = snap_area.base_point[i];
//     }
//   }
//
//   var position = intersect.object.parent.localToWorld(new THREE.Vector3().fromArray( snap_point ) );
//
//   this.position.copy(position);
//
//
//
//   this.overlap = this.selector.bboxOverLap();
//   return;
// }
