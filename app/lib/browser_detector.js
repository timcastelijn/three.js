
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

		// parent.appendChild( element );
    $("#no-configurator").append(
      "<div id='browser_error_message'>" + message + "</div>"
    );

    // trigger event
    $(function() {
      $("#accordion").trigger('simple_mode');
    })

  },

  browsers:[
    {name:'firefox', version:44},
    {name:'chrome', version:48},
    {name:'safari', version:500},
    {name:'msie', version:11},
  ],
  // browsers:[
  //   {name:'firefox', version:100},
  //   {name:'chrome', version:100},
  //   {name:'safari', version:800},
  //   {name:'msie', version:100},
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

      //test platform and version
      if(current_browser.os == 'windows8.1'){
        // only allow chrome 48 or higher
        if(current_browser.name == 'chrome' && current_browser.version >= 48){
          return true;
        }else{
          return false
        }
      }

      // not 8.1
      if (current_browser.name.match(name)){
        // match one of the names
        if (current_browser.version >= version ){
          // version greater than minimum
          return true;
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
          "WebGL is not supported by your graphics card. You cannot use the dynamic 3d viewer.",
        ].join( '\n' );

      this.message = message;
      browser_detector.getCompatible(message);

      return false;
    } else if (!browser_detector.compatible() ) {

      var message = [
          "Your browser: '" + this.current_browser.name + " " + this.current_browser.version + "' does not support the dynamic 3d viewer.",
          'Try a preferred browser like the latest version of <a href="https://www.google.nl/chrome/browser/desktop/" >Google Chrome</a>.',
        ].join( '\n' );

        this.message = message;
      browser_detector.getCompatible(message);
      return false;

    } else {
      $("#no-configurator").hide();
      return true;
    }


  }
}
