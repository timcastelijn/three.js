var browser_ok = browser_detector.detect()

var container, stats;
var camera, controls, scene, scene_geometry, renderer;
var dragger, selector;
var _mesh_objects =[], _patch_table ={};
var _blocks = [];

var price =0;

var document_edited = false;
var _models_loading = 0;
var _view_open = false

var SHADOWS_ENABLED = false;
var _AXIS_HELPERS = true;


textures = {}

textures.wood = new THREE.TextureLoader().load( "textures/underlayment.jpg" );
textures.wood.wrapS = THREE.RepeatWrapping;
textures.wood.wrapT = THREE.RepeatWrapping;
textures.wood.repeat.set( 1,1 );

textures.aluminium = new THREE.TextureLoader().load( "textures/dots.jpg" );
textures.aluminium.wrapS = THREE.RepeatWrapping;
textures.aluminium.wrapT = THREE.RepeatWrapping;
textures.aluminium.repeat.set( 1,1 );



var _materials = {
  cladding:new THREE.MeshPhongMaterial( { map:textures.wood, color: 0xffffff, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } ),
  glass:new THREE.MeshPhongMaterial( {color: 0xeeeeff, shininess:0.5, reflectivity:0.2, transparent:true, opacity:0.2, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } ),
  basic:new THREE.MeshPhongMaterial( { color: 0xffffff, shininess:0, reflectivity:0, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } )
}

var block_files = {
  floor:    {type:"floor",    model:'models/fl.json',         type_class:Floor,    price:560,    mt:[0]     },
  fl_e:     {type:"fl_e",     model:'models/fl_e.json',       type_class:FloorEnd, price:560,    mt:[0]     },
  fl_filler:{type:"fl_filler",model:'models/fl_filler.json',  type_class:Floor,    price:560,    mt:[0]     },
  roof:     {type:"roof",     model:'models/roof.json',       type_class:Roof,     price:640,    mt:[1,2,3] },
  ro_e:     {type:"ro_e",     model:'models/ro_e.json',       type_class:RoofEnd,  price:640,    mt:[1,2,3] },
  wo_oc:    {type:"wo_oc",    model:'models/wo_oc.json',      type_class:Wall,     price:640,    mt:[1]     },
  wo_i_300: {type:"wo_i_300", model:'models/wo_i.json',       type_class:Wall,     price:640,    mt:[1]     },
  wo_i_600: {type:"wo_i_600", model:'models/wo_i.json',       type_class:Wall,     price:640,    mt:[1,2]     },
  wo_w_900: {type:"wo_w_900", model:'models/wo_w_900.json',   type_class:Wall,     price:640,    mt:[1,0]     },
  wi_i:     {type:"wi_i",     model:'models/wi_i.json',       type_class:Block,     price:640,    mt:[1,0]     },
}


var config = {}


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

  scene.add( new THREE.AmbientLight( 0x888888 ) );

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

  controls.target_ball = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshBasicMaterial({color:0xff0000}));
  controls.target_ball.position.copy(controls.target)
  controls.target_ball.visible = false;
  scene.add(controls.target_ball)


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
  // var meshi = new THREE.Mesh(geoi, mi.mat);
  //
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



function addObject(object, fid){


  console.log(object);

  // create new fabfield-id
  var type  = object.type;

  if(!config.geometry[fid]){
    // add to config with new id
    fid   = object.type + "_" + new Date().getTime();

    config.geometry[fid] =  jQuery.extend(true, {}, object);
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

function convertFloat(object){
  for (var i = 0; i < 3; i++) {
    object.position[i] = parseFloat(object.position[i]);
    object.rotation[i] = parseFloat(object.rotation[i])/180*Math.PI;
  }
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

          convertFloat(data.geometry[fid])

          // for each entry add an object
          addObject(data.geometry[fid], fid);
        }
    }

    for (var id in data.materials) {
        if (data.materials.hasOwnProperty(id)) {

          data.materials[id];
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

function checkVisible() {

  if(_view_open ){
    controls.target_ball.visible = true;
    controls.target_ball.position.copy(controls.target)

    if (_blocks.length > 0){
      // check all outer walls
      var camera_dir = new THREE.Vector3().copy(camera.getWorldDirection());
      // var camera_dir = new THREE.Vector3(1,0,0);

      for (var i = 0; i < _blocks.length; i++) {
        var block = _blocks[i];
        if(block.position.y > controls.target.y){
          block.setVisible(false);
        } else{
          var block_outer_wall = (block instanceof Wall) || (block instanceof Roof) || (block instanceof RoofEnd);
          var dot_product = camera_dir.dot(block.getNormal());
          if(block_outer_wall && dot_product >0){
            block.setVisible(false);
          } else {
            block.setVisible(true, "comment");
          }
        }
      }
    }
  }

}

function showAllBlocks(){
  for (var i = 0; i < _blocks.length; i++) {
    var block = _blocks[i];
    block.setVisible(true);
  }
  controls.target_ball.visible = false;
}

function render() {

  controls.update();

  checkVisible();


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
