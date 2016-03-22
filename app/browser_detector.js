
var browser_detector = {
  sayswho : function() {
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
        break;
      }
    }
    _browser.opera = _browser.opr;
    delete _browser.opr;
    return {
      name: (x === "opr" ? "Opera" : x),
      version: (_browser.version ? _browser.version : "N/A")
    };
  },


  getCompatible : function (current_browser) {

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



    element.innerHTML = [
      'you are using:',
      current_browser.name + " " + current_browser.version,
      'Please use a modern browser like Chrome 48, Safari 9 or <a href="https://www.mozilla.org/nl/firefox/desktop/" style="color:#00f">Firefox 44</a>.'
    ].join( '\n' );


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

  detect : function(){
    var current_browser = browser_detector.sayswho()
    console.log(current_browser.name, current_browser.version)

    // for each browser in the list
    for(var i = 0; i < browser_detector.browsers.length; i++){
      var name = browser_detector.browsers[i].name;
      var version = browser_detector.browsers[i].version;

      //test name and version
      if (current_browser.name.match(name)){
        if (current_browser.version >= version ){
          return true;
        }
      }
    }

    // return false if browser is not OK, add message
    browser_detector.getCompatible(current_browser);
    return false;
  }
}
