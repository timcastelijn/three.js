var browser_ok = browser_detector.detect()

var container, stats;
var camera, controls, scene, renderer;
var dragger;
var cabine;

var document_edited = false;


var SHADOWS_ENABLED = false;

var config = {
  dimensions:[
    124,
    200,
    140,
  ],
  heaters:6,
  options:{
    salt_vaporizer:false,
    backrest:false,
    aromatherapy:false,
    led_lighting:false,
  },
  colors:{
    exterior:"black",
    interior:"white",
    backrest:"bamboo",
    floor:"bamboo",
  }
}

var color_table = {
  "l. grey" :"#CEC0B5",
  "grey"    :"#908579",
  "black"   :"#2A2829",
  "choco"   :"#866C53",
  "brown"   :"#885C3F",
  "yellow"  :"#D6A368",
  "mint"    :"#69AB95",
  "green"   :"#4B645B",
  "blue"    :"#275B65",
  "violet"  :"#634956",
  "red"     :"#CE2C25",
  "orange"  :"#E47120",
  "white"   :"#ffffff",
  "bamboo"  :"#885C3F",
}

var colors = {
  exterior:"#2A2829",
  interior:"#ffffff",
  floor:"#885C3F",
  backrest:"#885C3F",
}

var _camera_position = [
  {position:[0, 1.5, 2.5], target:[0,1.0,0]},
  {position:[0, 1.0, 0.4], target:[0,1.0,0]},
]

var _models_loading = 0;
var _models={
  vaporizer:{name:"vaporizer", model:"models/vaporizer.json" },
  aromatherapy:{name:"aromatherapy", model:"models/aromatherapy.json" },
  heater:{name:"heater", model:"models/heater.json" },
  bench:{name:"bench", model:"models/bench.json" },
  cap:{name:"cap", model:"models/floor.json" },
  backrest:{name:"backrest", model:"models/backrest.json" },
}

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

  var screen_width_ratio = (window.innerWidth <640)? 1: 0.8;




  camera = new THREE.PerspectiveCamera( 70, (window.innerWidth * screen_width_ratio)/ window.innerHeight, 0.05, 100 );
  camera.position.set( 0, 1.5, 2.5 );

  scene.add( new THREE.AmbientLight( 0x707070 ) );



  var light = new THREE.SpotLight( 0xffffff, 0.5 );
  light.position.set( 2, 3, 5 );
  scene.add( light );

  var light2 = new THREE.SpotLight( 0xffffff, 0.2 );
  light2.position.set( -2, 3, -5 );
  scene.add( light2 );

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




  renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true} );
  // renderer = new THREE.WebGLRenderer( { antialias: true} );
  renderer.setClearColor( 0x000000, 0);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth * screen_width_ratio, window.innerHeight );
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
  controls.enableZoom = false;
  controls.rotateSpeed = 0.25;
  controls.target = new THREE.Vector3(0,1,0)

  var scroll_timer = new ScrollTimer(controls);

  // add info diff
  var info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.bottom = '10px';
  info.style.right = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'right';
  info.innerHTML = 'created by <a href="http://timcastelijn.nl">timcastelijn.nl</a> using <a href="http://threejs.org" target="_blank">three.js</a>';
  container.appendChild( info );

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

  // at the end of init, load the models
  var json_loader = new THREE.JSONLoader( );
  for(name in _models){
    if(_models.hasOwnProperty(name)){
      _models_loading++;
      json_loader.load( _models[name].model, modelLoadedCallback(_models[name]));
    }
  }

  return true;
}

function loadConfig(){

  //define materials
  _models.aromatherapy.mesh.material.materials[0] = new THREE.MeshPhongMaterial( { color: colors.interior, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
  _models.backrest.mesh.material = new THREE.MeshPhongMaterial( { color: colors.backrest, shininess:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
  _models.heater.mesh.material.materials[0] = new THREE.MeshPhongMaterial( { color: "#111111", shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
  _models.heater.mesh.material.materials[1] = new THREE.MeshPhongMaterial( { color: colors.interior, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
  _models.vaporizer.mesh.material.materials[0] = new THREE.MeshPhongMaterial( { color: "#D4D2E7", shininess:0.5, reflectivity:0.3, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );

  //create cabine
  cabine = new CabineGrid(1.24, 2.0, 1.4);
  scene.add(cabine);

  //EYE sprite
  // var map = new THREE.TextureLoader().load( "images/eye.png" );
  // var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
  // var sprite = new THREE.Sprite( material );
  // sprite.scale.x = 0.2;
  // sprite.scale.y = 0.2;
  // sprite.position.y = 1
  // sprite.scale.z = 0.2;
  // scene.add( sprite );

}


function onWindowResize() {

  var width_ratio = (window.innerWidth <640)? 1: 0.8;

  camera.aspect = (window.innerWidth * width_ratio) / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth * width_ratio, window.innerHeight );


}



function onDocumentKeyDown( event ) {
  switch( event.key ) {
    // case 8: event.preventDefault(); console.log("Delete"); break;

  }

}



//

function animate() {

  requestAnimationFrame( animate );

  render();
  // stats.update();

}

function render() {

  controls.update();

  renderer.render( scene, camera );

}

function setCameraPosition(index){
  var pos = _camera_position[index].position;
  var tar = _camera_position[index].target;
  camera.position.set( pos[0], pos[1], pos[2] );
  controls.target = new THREE.Vector3().fromArray(tar);

}
