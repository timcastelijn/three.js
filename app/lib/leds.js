
function Leds(width, height, depth){

  this.width = width;
  this.height = height;
  this.depth = depth;

  // internal constants
  this.DISTANCE = 0.2;
  this.CEILING_DIST = 0.01;
  this.color = 0x2222ff;
  this.visible = false;

  this.sprite_material = this.generateSpriteMaterial()
  this.sprites = [];
  this.createGrid();

  this.light = new THREE.PointLight( this.color, 1, 5 );
  this.light.position.set(0, height-this.CEILING_DIST ,0)
  scene.add( this.light );

}


Leds.prototype.setVisible = function(boolean){

  if (boolean){
    this.createGrid();
  }else{
    for (var i = 0; i < this.sprites.length; i++) {
      scene.remove(this.sprites[i]);
    }
  }

  this.light.visible = boolean
  this.visible = boolean;
}

Leds.prototype.setWidth = function(value){
  this.width = value;

  if(this.visible){

    for (var i = 0; i < this.sprites.length; i++) {
      scene.remove(this.sprites[i]);
    }

    this.sprites = [];
    this.createGrid();
  }
}

Leds.prototype.setDepth = function(value){

  this.depth = value;

  if(this.visible){

    for (var i = 0; i < this.sprites.length; i++) {
      scene.remove(this.sprites[i]);
    }

    this.sprites = [];
    this.createGrid();
  }
}

Leds.prototype.setHeight = function(value){
  this.height = value;
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].position.y = value - this.CEILING_DIST;
  }
  this.light.position.y = value - this.CEILING_DIST

}

Leds.prototype.createGrid = function(width, height, depth, dist){
  var size_width = this.width-(this.DISTANCE);
  var size_depth = this.depth-(this.DISTANCE)
  var n_width = (size_width)/(this.DISTANCE) *2;
  var n_depth = (size_depth)/(this.DISTANCE) *2;



  for ( var i = 0; i < n_width +1 ; i++ ) {
    for( var j =0; j< n_depth +1 ; j++){

      if((i%2==0 && j%2==1) || (i%2==1 && j%2 == 0)){
        // sprites are alternating
        var particle = new THREE.Sprite( this.sprite_material );
        particle.position.x = size_width/(n_width) *i -size_width/2 - this.DISTANCE/4 ;
        particle.position.y = this.height - this.CEILING_DIST;
        particle.position.z = size_depth/(n_depth) *j - size_depth/2 - this.DISTANCE/4;

        var scale = 0.1;
        particle.scale.x = scale;
        particle.scale.y = scale;
        particle.scale.z = scale;

        scene.add( particle );
        this.sprites.push(particle);
      }
    }
  }
}

Leds.prototype.generateSpriteMaterial = function(){
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

      var material = new THREE.SpriteMaterial( {
          map: new THREE.CanvasTexture( canvas ),
          blending: THREE.AdditiveBlending
      } );

      return material;
}


function Heater(parent, x, y, z, w, h, n_width, n_height){

  this.sprite_material = this.generateSpriteMaterial()
  this.sprites = [];
  this.parent = parent;

  var flip = (parent.flip)? parent.flip: 1;


  for ( var i = 0; i < n_width ; i++ ) {
    for( var j =0; j< n_height ; j++){



        // sprites are alternating
        var particle = new THREE.Sprite( this.sprite_material );
        particle.position.x = flip * (x - ( - w/2 +  w/(n_width) *i) );
        particle.position.y = y + h/n_height * j;
        particle.position.z = z;

        var scale = 0.1;
        particle.scale.x = scale;
        particle.scale.y = scale;
        particle.scale.z = scale;

        parent.add( particle );
        this.sprites.push(particle);

    }
  }
}

Heater.prototype.constructor = Heater;

Heater.prototype.ditch = function(){
  for (var i = 0; i < this.sprites.length; i++) {
    this.parent.remove(this.sprites[i]);
  }
}

Heater.prototype.generateSpriteMaterial = function(){
      var canvas = document.createElement( 'canvas' );
      canvas.width = 16;
      canvas.height = 16;
      var context = canvas.getContext( '2d' );
      var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
      gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
      gradient.addColorStop( 0.2, 'rgba(255,0,0,1)' );
      gradient.addColorStop( 0.4, 'rgba(64,0,0,0)' );
      gradient.addColorStop( 1, 'rgba(0,0,0,0)' );
      context.fillStyle = gradient;
      context.fillRect( 0, 0, canvas.width, canvas.height );

      var material = new THREE.SpriteMaterial( {
          map: new THREE.CanvasTexture( canvas ),
          blending: THREE.AdditiveBlending
      } );

      return material;
}
