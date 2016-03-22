// var modelLoadedCallback = function( geometry, materials ) {
//
//   mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x606060, shading:THREE.FlatShading, morphTargets: true, vertexColors: THREE.FaceColors } ) );
//   // mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0x606060, morphTargets: true, vertexColors: THREE.FaceColors } ) );
//   console.log(mesh);
//   mesh.traverse( function ( child )
//   {
//       if ( child instanceof THREE.Mesh )
//           child.material.color.setRGB (1, 1, 1);
//           child.geometry.computeBoundingBox();
//           //objects.push( child );
//           //draggables.push(child);
//   });
//   mesh.morphTargetInfluences[ 0 ] = 0.66
//   mesh.morphTargetInfluences[ 1 ] = 0.66
//
//   mesh.castShadow = CAST_SHADOW;
//   mesh.receiveShadow = CAST_SHADOW;
//
//
//   scene.add( mesh );
//
//
//   console.log(mesh.geometry.boundingBox);
// }

var modelLoadedCallback = function ( geometry, materials ) {


  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  materials[1] = new THREE.MeshPhongMaterial( { color: getColor("interior"), shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );

  console.log(materials[1]);

  var material = new THREE.MultiMaterial( materials );


  heater_object = new THREE.Mesh( geometry, material );
  if(SHADOWS_ENABLED){
    heater_object.castShadow = true
    heater_object.receiveShadow = true
  }

  cabine.placeHeaters();

}
