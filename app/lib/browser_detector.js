
var browser_detector = {
  sayswho : function() {
    var os = true;
    var uagent = navigator.userAgent.toLowerCase(),
        match = '';
    _browser ={}
    _browser.chrome  = /webkit/.test(uagent)  && /chrome/.test(uagent) && !/edge/.test(uagent);
    _browser.firefox = /mozilla/.test(uagent) && /firefox/.test(uagent);
    _browser.msie    = /msie/.test(uagent) || /trident/.test(uagent) || /edge/.test(uagent);
    _browser.safari  = /safari/.test(uagent)  && /applewebkit/.test(uagent) && !/chrome/.test(uagent);
    _browser.opr     = /mozilla/.test(uagent) && /applewebkit/.test(uagent) &&  /chrome/.test(uagent) && /safari/.test(uagent) && /opr/.test(uagent);
    _browser.version = '';

    for (x in _browser) {
      if (_browser[x]) {

        // microsoft is "special"
        match = uagent.match(new RegExp("(" + (x === "msie" ? "msie|edge" : x) + ")( |\/)([0-9]+)"));

        if (match) {
          _browser.version = match[3];
        } else {
          match = uagent.match(new RegExp("rv:([0-9]+)"));
          _browser.version = match ? match[1] : "";
        }
        // find os
        var match2 = uagent.match(new RegExp('windows nt 6.3'));
        if (match2){
          os = 'windows8.1';
        }
        break;
      }
    }
    _browser.opera = _browser.opr;
    delete _browser.opr;
    return {
      name: (x === "opr" ? "Opera" : x),
      version: (_browser.version ? _browser.version : "N/A"),
      os: os
    };
  },


  getCompatible : function (message) {

    var element = document.createElement( 'div' );
    element.id = 'browser-error-message';
    element.style.fontFamily = 'monospace';
    element.style.fontSize = '13px';
    element.style.fontWeight = 'normal';
    element.style.textAlign = 'center';
    element.style.background = '#fff';
    element.style.color = '#000';
    element.style.padding = '1.5em';
    element.style.width = '400px';
    element.style.margin = '5em auto 0';



    element.innerHTML = message;


    var parent, id;

    // set paramater defaults if not set before
		var parameters = parameters || {};
		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		parent.appendChild( element );

  },

  browsers:[
    {name:'firefox', version:44},
    {name:'chrome', version:48},
    {name:'safari', version:9},
    {name:'msie', version:11},
  ],
  // browsers:[
  //   {name:'firefox', version:100},
  //   {name:'chrome', version:48},
  //   {name:'safari', version:9},
  //   {name:'msie', version:11},
  // ],

  compatible: function(){
    // check browser_version
    this.current_browser = browser_detector.sayswho()

    var current_browser = this.current_browser;
    console.log(current_browser.name, current_browser.version)

    // for each browser in the list
    for(var i = 0; i < browser_detector.browsers.length; i++){
      var name = browser_detector.browsers[i].name;
      var version = browser_detector.browsers[i].version;

      //test name and version
      if(current_browser.os != 'windows8.1'){
        // not 8.1
        if (current_browser.name.match(name)){
          // match one of the names
          if (current_browser.version >= version ){
            // version greater than minimum
            return true;
          }
        }
      }
    }
    // name or version not ok:
    return false
  },

  detect : function(){

    // check webgl on GPU
    if ( ! Detector.webgl ) {

      var message = [
          "WebGL is not supported by your graphics card. You cannot use the dynamic 3d viewer, but you can still use the user interface to get your customized design",
        ].join( '\n' );

      browser_detector.getCompatible(message);

      return false;
    } else if (!browser_detector.compatible() ) {

      var message = [
          "Your browser: '" + this.current_browser.name + " " + this.current_browser.version + "' is not supported by the dynamic 3d viewer.",
          'Please use a preferred browser like the latest version of <a href="https://www.google.nl/chrome/browser/desktop/" style="color:#00f">Google Chrome</a>.',
        ].join( '\n' );

      browser_detector.getCompatible(message);
      return false;

    } else {
      return true;
    }


  }
}
