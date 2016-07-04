function FloorEnd(object, selector){
  Floor.call( this, object, selector );

  this.addSlabs()

}

FloorEnd.prototype = Object.create(Floor.prototype);


FloorEnd.prototype.addSlabs = function(){

  var length = this.size[0];
  var num = (length)/0.3;
  var geo = new THREE.BoxGeometry(0.1,0.05,0.04);

  this.slab_edges = []

  for (var i = 1; i < num-1; i++) {

    for (var j = 0; j <2; j++) {
      var mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial( { color:  0xffffff } ) );

      var pos_x = i * 0.3 + 0.15;
      var pos_z = j * 0.2 + 0.04;
      mesh.position.set(pos_x, 0.3 + 0.05/2 , pos_z);


      this.add(mesh);

      var edges = new THREE.EdgesHelper( mesh.clone(), 0x000000 );

      edges.name = "edgesHelper";
      mesh.add(edges);

      this.slab_edges.push(edges);
    }
  }
}

FloorEnd.prototype.delete = function(){

  scene_geometry.remove(this);

  // remove all children of selected from selectables
  for(var i =0; i<this.children_meshes.length; i++){
    var selected_index = this.selector.selectables.indexOf(this.children_meshes[i]);
    this.selector.selectables.splice(selected_index, 1)
  }

  for (var i = 0; i < this.slab_edges.length; i++) {
    scene_geometry.remove(this.slab_edges[i]);
  }

  delete config.geometry[this.fid];


}



FloorEnd.prototype.addPatches = function(){
  this.snap_areas ={
    wo:{
      patch_wall3:{position_min:[0.3, 0.3, 0], position_max:[this.size[0] - 0.3, 0.3, 0.0], offset:[0.3, 0,0], rotation:[0, - 0.5 * Math.PI, 0] }
    },
    wo_oc:{
      patch_wall1:{position:[0, 0.3, 0],                rotation:[0,0,0]},
      patch_wall2:{position:[this.size[0], 3.0, 0 ],  rotation:[0, 0,Math.PI]},
    },
    ro_e:{
      patch_wall1:{position:[this.size[0], 0.3, 0.3],   rotation:[0, Math.PI, 0]},
      patch_wall2:{position:[this.size[0], 0.3, 0.3 ],  rotation:[0, Math.PI, 0]},
      patch_wall3:{position:[this.size[0], 0.3, 0.3 ],  rotation:[0, Math.PI, 0]},
    }
  }

}
