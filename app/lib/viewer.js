if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var browser_ok = browser_detector.detect()

var container, stats;
var camera, controls, scene, renderer;
var objects = [], plane, heater_object, vaporizer_object, cabine;

var document_edited = false;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();

var SHADOWS_ENABLED = false;

if (browser_ok){
  init();
  animate();
}

function init() {
  // create renderer container
  container = document.createElement( 'div' );
  container.setAttribute( 'id', "renderer" );
  container.setAttribute( 'position', "absolute" );
  container.setAttribute( 'top', "0px" );
  container.setAttribute( 'left', "0px" );
  container.setAttribute( 'z-index', "-1" );
  document.body.appendChild( container );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.05, 100 );
  camera.position.set( 0, 1.5, 2.5 );

  scene.add( new THREE.AmbientLight( 0x707070 ) );



  var light = new THREE.SpotLight( 0xffffff, 0.5 );
  light.position.set( 2, 3, 5 );

  if (SHADOWS_ENABLED){
    light.castShadow = true;

    light.shadow.camera.near = 1;
    light.shadow.camera.far = camera.far;
    light.shadow.camera.fov = 50;

    light.shadow.bias = -0.00022;

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    var light2 = new THREE.SpotLight( 0xffffff, 0.5 );
    light2.position.set( 2, 3, 5 );
    scene.add( light2 );
  }

  scene.add( light );

  //create cabine
  cabine = new CabineGrid(1.24, 2.0, 1.4);
  scene.add(cabine);

  //create intersection plane
  plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
    new THREE.MeshBasicMaterial( { visible: true, wireframe: true } )
  );
  // rotate plane to xz orientation
  plane.rotation.x = Math.PI * -0.5;
  plane.visible = false;
  scene.add( plane );

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true} );
  // renderer = new THREE.WebGLRenderer( { antialias: true} );
  renderer.setClearColor( 0x000000, 0);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.sortObjects = false;

  if(SHADOWS_ENABLED){
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
  }

  // add renderer to container
  container.appendChild( renderer.domElement );

  // create controls
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  controls.rotateSpeed = 0.25;
  controls.target = new THREE.Vector3(0,0.8,0)

  var info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.bottom = '40px';
  info.style.right = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'right';
  info.innerHTML = 'created by <a href="http://timcastelijn.nl">timcastelijn.nl</a> using <a href="http://threejs.org" target="_blank">three.js</a>';
  container.appendChild( info );

  // stats = new Stats();
  // stats.domElement.style.position = 'absolute';
  // stats.domElement.style.top = '0px';
  // stats.domElement.style.right = '0px';
  // container.appendChild( stats.domElement );

  renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
  renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
  renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

  // before-unload warning message
  window.addEventListener("beforeunload", function (e) {
      if (document_edited) {
        var confirmationMessage = 'If you leave now, your changes will be lost.';

        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
      }

  });


  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'keydown', onDocumentKeyDown, false );

  return true;
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );


}

function onDocumentMouseMove( event ) {

  event.preventDefault();

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onDocumentMouseDown( event ) {

  event.preventDefault();


}

function onDocumentMouseUp( event ) {



}

function onDocumentKeyDown( event ) {
  switch( event.keyCode ) {

    case 8: event.preventDefault(); console.log("Delete"); break;

  }

}

//

function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

function render() {

  controls.update();

  renderer.render( scene, camera );

}

//apply dimension change to grid
function applyDim(dim_index, value){
  if(cabine){
    value = value/100;
    // 0:width 1:height 2:length
    cabine.setDim(dim_index, value)

    document_edited = true;
  }
}

// 0:zoutvernevelaar
// 1:rugsteun
// 2:aromatherapie
function addOption(index, boolean_add){
  // console.log(index, boolean_add);
  cabine.setOption(parseInt(index), boolean_add);
}
