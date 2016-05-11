function Floor(geometry){
  Block.call( this, geometry );

  this.addPatches()
}

Floor.prototype = Object.create(Block.prototype);

// Floor.prototype = new Block();
// Floor.prototype.constructor = Block;

Floor.prototype.addPatches = function(){
  this.patches = {
      2:{type:"wall", position:new THREE.Vector3(this.width - 0.1,0.3,0.15)},
      3:{type:"wall", position:new THREE.Vector3(this.width - 0.1,0.3,0.15)},
      14:{type:"wall", position:new THREE.Vector3(0.1,0.3,0.15)},
      15:{type:"wall", position:new THREE.Vector3(0.1,0.3,0.15)},
  }

}

Floor.prototype.addPlaceHolders = function(){

  // ================= geom split

  // //split geometry
  // var faces = this.mesh_object.geometry.faces
  // var vertices = this.mesh_object.geometry.vertices
  //
  // var geometry = [];
  //
  // for(var m=0; m<4; m++){
  //   geometry[m] = new THREE.Geometry();
  //   var n_face =0;
  //
  //   for(var i=0; i<faces.length; i++){
  //     if(faces[i].materialIndex == m){
  //
  //
  //       var vertexIndices =[faces[i].a, faces[i].b, faces[i].c];
  //
  //       for(var j =0; j< vertexIndices.length; j++){
  //           geometry[m].vertices.push( vertices[ vertexIndices[j] ].clone() );
  //       }
  //
  //       geometry[m].faces.push(new THREE.Face3(3*n_face + 0, 3*n_face +1, 3*n_face +2));
  //
  //       n_face++;
  //     }
  //
  //   }
  //
  //   console.log(geometry[m]);
  //
  //   var mesh = new THREE.Mesh(geometry[m], new THREE.MeshBasicMaterial({color:0xffffff / m}))
  //   mesh.position.set(0,1,0);
  //   this.add(mesh);
  //
  // }

  // ============== snap volumes ============

  // var volumes = [
  //   {size:[0.2,2.5,0.3],position:[0,0.3,0],type:"wall"},
  //   {size:[0.2,2.5,0.3],position:[this.width-0.2,0.3,0],type:"wall"},
  //   {size:[this.width,0.3,0.3],position:[0,0, 0.3],type:"floor"},
  //   {size:[this.width,0.3,0.3],position:[0,0, -0.3],type:"floor"},
  // ]
  //
  // for (var i = 0; i < volumes.length; i++) {
  //
  //   console.log(volumes[i].position);
  //   var geometry = new THREE.BoxGeometry(volumes[i].size[0],volumes[i].size[1],volumes[i].size[2]);
  //
  //   geometry.applyMatrix( new THREE.Matrix4().makeTranslation(volumes[i].size[0]/2,volumes[i].size[1]/2,volumes[i].size[2]/2) );
  //   var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xff000000 } ) );
  //   mesh.position.set(volumes[i].position[0], volumes[i].position[1], volumes[i].position[2]);
  //   this.placeholders[i] = mesh;
  //   this.add(this.placeholders[i]);
  // }



}
