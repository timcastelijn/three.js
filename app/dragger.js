//Dragger Class
function Dragger(){
  // THREE.Object3D.call( this );
	this.dragged = null;



}
// Cell.prototype = new THREE.Object3D();
// Cell.prototype.constructor = Cell;

Dragger.prototype.mouseMove = function(){



	raycaster.setFromCamera( mouse, camera );

	if ( this.dragged ) {

			// try objects intersection
			var intersects = raycaster.intersectObjects( objects );
			if (intersects[0]){
				var vector = new THREE.Vector3();
				vector.setFromMatrixPosition( intersects[0].object.matrixWorld );
				// in case of a hit, copy position
				this.dragged.position.copy(vector);
			}else{
				// else move over plane
				var intersects = raycaster.intersectObject( plane );
				if ( intersects.length > 0 ) {

					this.dragged.position.copy( intersects[ 0 ].point);
					// SELECTED.position = intersects[ 0 ].point;
				}
			}


		return;

	}

	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 && intersects[ 0 ].object.selectable ) {

		if ( INTERSECTED != intersects[ 0 ].object) {
			// If INTERSECTED changes to a new object

			// set doc_edited to true at first edit
			document_edited = true;

			if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

			INTERSECTED = intersects[ 0 ].object;

			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

			// plane.position.copy( INTERSECTED.position );
			// plane.lookAt( camera.position );



		}
		container.style.cursor = 'pointer';

	} else {

		if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

		INTERSECTED = null;

		container.style.cursor = 'auto';

	}
}

Dragger.prototype.mouseUp = function(){

	controls.enabled = true;

	if ( INTERSECTED ) {

		// plane.position.copy( INTERSECTED.position );

		SELECTED = null;
		dragger.dragged = null;

	}

	container.style.cursor = 'auto';
}
