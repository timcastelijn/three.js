var browser_ok = browser_detector.detect()

var container, stats;
var camera, controls, scene, scene_geometry, renderer;
var dragger, selector;
var _mesh_objects =[];
var price =0;

var document_edited = false;
var _models_loading = 0;


var SHADOWS_ENABLED = false;

var block_files = {
  wall:     {type:"wall",     model:'models/wo_i_600.json',  price:480,  size:[0,2.7,0],    mt:[1],    position:[-1,0,0], rotation:[0,0,0]},
  floor:    {type:"floor",    model:'models/floor.json',     price:560,  size:[3.6,0,0],    mt:[0],    position:[-1,0,0], rotation:[0,180,0]},
  fl_e:    {type:"fl_e",      model:'models/floor_end.json', price:560,  size:[3.6,0,0],    mt:[0],    position:[-1,0,0], rotation:[0,0,0]},
  roof:     {type:"roof",     model:'models/roof.json',      price:640,  size:[1.8,1,0.3],  mt:[1,2,3],    position:[-1,0,0], rotation:[0,180,0]},
  wo_oc:    {type:"wo_oc",    model:'models/wo-oc.json',     price:640,  size:[0,2.7,0],    mt:[1],    position:[-1,0,0], rotation:[0,0,0]},
  wo_i_300: {type:"wo_i_300", model:'models/wo-i-300.json',  price:640,  size:[0,2.7,0],    mt:[1],    position:[-1,0,0], rotation:[0,0,0]},
  wo_i_600: {type:"wo_i_600", model:'models/wo_i_600.json',  price:640,  size:[0,2.7,0],    mt:[1],    position:[-1,0,0], rotation:[0,0,0]},
  wo_w_900: {type:"wo_w_900", model:'models/wo-w-900.json',  price:640,  size:[0,2.7,0],    mt:[1],    position:[-1,0,0], rotation:[0,0,0]},
}


var config = {}

var colors = {
  exterior:"#333333",
  interior:"#ffffff",
  floor:"#C28B6B",
  bamboo:"#C28B6B",
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

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.05, 100 );
  camera.position.set( 0, 1.5, 2.5 );

  scene.add( new THREE.AmbientLight( 0x707070 ) );



  var light = new THREE.PointLight( 0xffffff, 0.5 );
  light.position.set( -10, 10, 10 );

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
  controls.enableKeys = false;
  controls.rotateSpeed = 0.25;
  controls.target = new THREE.Vector3(0,0.8,0)



  // add information tag
  addInfo()


  // stats = new Stats();
  // stats.domElement.style.position = 'absolute';
  // stats.domElement.style.top = '0px';
  // stats.domElement.style.right = '0px';
  // container.appendChild( stats.domElement );

  // before-unload warning message
  window.addEventListener("beforeunload", function (e) {
      if (document_edited) {
        var confirmationMessage = 'If you leave now, your changes will be lost.';

        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
      }

  });


  window.addEventListener( 'resize', onWindowResize, false );

  selector = new Selector(camera, controls);
  scene_geometry = new THREE.Object3D();
  scene.add(scene_geometry);

  loadBlocks();

  return true;
}



// load all block and load filename when finished
function loadBlocks(){
  var json_loader = new THREE.JSONLoader( );

  for (var type in block_files) {
      if (block_files.hasOwnProperty(type)) {

        // increment models being loaded
        _models_loading ++;

        // if models are loaded, load the config file
        json_loader.load( block_files[type].model, modelLoadedCallback(type, 'config/model1.json'));
      }
  }

}

function addObject(geometry){

  var block;

  // add to config with new id
  var fid = geometry.type + "_" + new Date().getTime();
  config.geometry[fid] = geometry;
  config.geometry[fid].fid = fid;

  var category = geometry.type.substring(0,2)

  // block = new geometry.class(geometry, selector)

  switch (category) {
    case 'fl':
      if (geometry.type == 'fl_e') {
        block = new FloorEnd(geometry, selector);
      }else{
        block = new Floor(geometry, selector);
      }
      break;
    case 'wa':
      block = new Wall(geometry, selector);
      break;
    case 'wo':
      block = new Wall(geometry, selector);
      break;
    case 'ro':
      block = new Roof(geometry, selector);
      break;
    default:
      console.log('default geometry loaded' ,geometry);
      block = Block(geometry, selector);

  }

  var pos = geometry.position;

  block.position.set(parseFloat(pos[0]),parseFloat(pos[1]),parseFloat(pos[2]));

  block.rotation.set(0, parseFloat(geometry.rotation[1])/180*Math.PI, 0);

  scene_geometry.add(block);

  price += block_files[geometry.type].price;
  updatePriceGui();

  return block;

}

function clearScene(){
  // reset scene
  scene.remove(scene_geometry)
  scene_geometry = new THREE.Object3D();
  scene.add(scene_geometry);

  // reset config
  config  = {};
  price = 0;

  // reset selector
  selector = new Selector(camera, controls);
}

function loadConfig(filename){
  $.ajaxSetup({ mimeType: "text/plain" });
  // $.ajaxSetup({ mimeType: "application/json" });
  var jqxhr = $.getJSON( filename, function(data) {
    console.log( "config file loaded sucessfully" );

    // deep copy config file
    config = jQuery.extend(true, {}, data);

    for (var name in data.geometry) {
        if (data.geometry.hasOwnProperty(name)) {
          //remove from config
          delete config.geometry[name];

          addObject(data.geometry[name])

        }
    }
    camera.position.set(-3,5,7)
    controls.target = new THREE.Vector3(1.6,2.5,1.8);
    // zoomAll();

  }).fail(function() {
    //in case loading fails, log an error
    console.log( "Error: config file failed to load" );
  })
}

function zoomAll(){
  var bb      =   new THREE.BoundingBoxHelper( scene, 0x000000 );
  bb.update();
  scene.add(bb)

}

function addLights(){
  // ----------------- Sprites --------------------
  function generateSprite() {
      var canvas = document.createElement( 'canvas' );
      canvas.width = 16;
      canvas.height = 16;
      var context = canvas.getContext( '2d' );
      var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
      gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
      gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
      gradient.addColorStop( 0.4, 'rgba(0,0,64,0)' );
      gradient.addColorStop( 1, 'rgba(0,0,0,0)' );
      context.fillStyle = gradient;
      context.fillRect( 0, 0, canvas.width, canvas.height );
      return canvas;
  }

  var material = new THREE.SpriteMaterial( {
      map: new THREE.CanvasTexture( generateSprite() ),
      blending: THREE.AdditiveBlending
  } );


  light1 = new THREE.PointLight( 0x2222ff, 1, 3 );
  light1.position.set(0,1.79,0)
  scene.add( light1 );

  var radius = 10;

  for ( var i = 0; i < 10; i++ ) {
    for( var j =0; j< 10; j++){
      particle = new THREE.Sprite( material );
      particle.position.x = 1.04/10*i -1.0/2 ;
      particle.position.y = 1.78;
      particle.position.z = 1.2/10*j - 1.16 /2;

      var scale = 0.2
      particle.scale.x = scale;
      particle.scale.y = scale;
      particle.scale.z = scale;

      scene.add( particle );
    }
  }
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );


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

//apply dimension change to grid
function applyDim(dim_index, value){

  config.dimensions[dim_index] = value

  value = value/100;

  document_edited = true;

  switch (dim_index) {
    case 0:
        $("#slider-width").val(Math.round(value*100));
        var min = $("#number-width").attr("min");
        var value_temp = value*100<min? min:value*100
        $("#number-width").val(Math.round(value_temp));
        break;
    case 2:
        $("#slider-depth").val(Math.round(value*100));
        var min = $("#number-depth").attr("min");
        var value_temp = value*100<min? min:value*100
        $("#number-depth").val(Math.round(value_temp));
        break;
    case 1:
        $("#slider-height").val(Math.round(value*100));
        var min = $("#number-height").attr("min");
        var value_temp = value*100<min? min:value*100
        $("#number-height").val(Math.round(value_temp));
      break;
    default:
  }
  if(cabine){
    // 0:width 1:height 2:length
    cabine.setDim(dim_index, value);
  }
}

// 0:zoutvernevelaar
// 1:rugsteun
// 2:aromatherapie
function addOption(index, boolean_add){

  switch (parseInt(index)) {
    case 2:
      config.options.vaporizer = boolean_add
      break;
    case 3:
      config.options.backrest = boolean_add
      break;
    case 4:
      config.options.aromatherapy = boolean_add
      break;
    default:


  }


  if(cabine){
    cabine.setOption(parseInt(index), boolean_add);
  }

  document_edited = true;

}

function setColor(id, color){
  colors[id] = color;

  if(cabine){
    cabine.updateColors();
  }
  document_edited = true;
}

function  addInfo(){

  var info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.bottom = '10px';
  info.style.right = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'right';
  info.innerHTML = 'created by <a href="http://timcastelijn.nl">timcastelijn.nl</a> using <a href="http://threejs.org" target="_blank">three.js</a>';
  container.appendChild( info );
}
