function Roof(geometry, selector){
  Block.call( this, geometry, selector );

}

Roof.prototype = Object.create(Block.prototype);

Roof.prototype.addPatches = function(){
  this.patches = {},
  this.snap_areas ={

  }

}

Roof.prototype.updateSize = function(){



  if(!this.mesh_object.morphTargetInfluences){

    return;

  }

  var temp = this.size[2];
  this.size[2] = temp * Math.pow(1 + Math.pow((this.size[0]/this.size[1]), 2 ) , 0.5);


  for (var i = 0; i < this.size.length; i++) {
    if(this.size[i]){
      var size = parseFloat(this.size[i]);
      this.mesh_object.morphTargetInfluences[ this.mt_index[i] ] = size;
    }
  }

  this.updateVertices()
  this.mesh_object.updateMorphTargets();
  this.mesh_object.geometry.computeBoundingSphere();
  this.mesh_object.geometry.computeBoundingBox();


}
