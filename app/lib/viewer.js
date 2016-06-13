var browser_ok = browser_detector.detect()

var container, stats;
var camera, controls, scene, scene_geometry, renderer;
var dragger, selector;
var _mesh_objects =[];
var _material_table = {};

var price =0;

var document_edited = false;
var _models_loading = 0;

var SHADOWS_ENABLED = false;
var _AXIS_HELPERS = true;


var block_files = {
  wall:     {type:"wall",     model:'models/wo_i_600.json',  type_class:Wall,     price:480,    mt:[1]     },
  floor:    {type:"floor",    model:'models/floor.json',     type_class:Floor,    price:560,    mt:[0]     },
  fl_e:     {type:"fl_e",     model:'models/floor_end.json', type_class:FloorEnd, price:560,    mt:[0]     },
  roof:     {type:"roof",     model:'models/roof.json',      type_class:Roof,     price:640,    mt:[1,2,3] },
  ro_e:     {type:"ro_e",     model:'models/ro_e.json',      type_class:RoofEnd,  price:640,    mt:[1,2,3] },
  wo_oc:    {type:"wo_oc",    model:'models/wo-oc.json',     type_class:Wall,     price:640,    mt:[1]     },
  wo_i_300: {type:"wo_i_300", model:'models/wo-i-300.json',  type_class:Wall,     price:640,    mt:[1]     },
  wo_i_600: {type:"wo_i_600", model:'models/wo_i_600.json',  type_class:Wall,     price:640,    mt:[1]     },
  wo_w_900: {type:"wo_w_900", model:'models/wo-w-900.json',  type_class:Wall,     price:640,    mt:[1]     },
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


  // var geoi = new THREE.BoxGeometry(1,1,1);
  // var texture = new THREE.TextureLoader().load( "textures/underlayment.jpg" );
  // texture.wrapS = THREE.RepeatWrapping;
  // texture.wrapT = THREE.RepeatWrapping;
  // texture.repeat.set( 1, 1 );
  //
  // var mater3 = new THREE.MeshBasicMaterial( { color: 0xffffff, map:texture} );
  // var meshi = new THREE.Mesh(geoi, mater3);
  //
  // console.log(mater3.color);
  // scene.add(meshi)

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

function updateMaterials(){

  for (var type in _material_table) {
    if (_material_table.hasOwnProperty(type)) {

      for (var name in _material_table[type]) {
        if (_material_table[type].hasOwnProperty(name)) {

          if(config.materials.name){
            console.log("update ", name);
            _material_table[type][name] = config.materials.name;

          }
        }
      }

    }
  }
}

function addObject(object, fid){

  // create new fabfield-id
  var type  = object.type;

  if(!config.geometry[fid]){
    // add to config with new id
    fid   = object.type + "_" + new Date().getTime();

    config.geometry[fid] = object;
    console.log("addconfig", fid);
  }
  object.fid = fid;

  // create new block
  var type_class = block_files[type].type_class;
  var block = new type_class(object, selector);

  block.setTransformations(object.position, object.rotation )
  scene_geometry.add(block);



  // update display price
  price += block_files[type].price;
  config.price = price;
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

    for (var fid in data.geometry) {
        if (data.geometry.hasOwnProperty(fid)) {

          // for each entry add an object
          addObject(data.geometry[fid], fid);


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
