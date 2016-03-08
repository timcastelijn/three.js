
var browser_detector = {
  sayswho : function() {
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);

    console.log(M);

    return M;
  },


  getCompatible : function (parameters) {

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
      'Please use a modern browser like Chrome 48, Safari 9 or <a href="https://www.mozilla.org/nl/firefox/desktop/" style="color:#00f">Firefox 44</a>.'
    ].join( '\n' );


    var parent, id;

    // set paramater defaults if not set before
		parameters = parameters || {};
		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		parent.appendChild( element );
  },

  browsers:[
    {name:'Firefox', version:44},
    {name:'Chrome', version:48},
    {name:'Safari', version:9},
  ],

  detect : function(){
    browser = browser_detector.sayswho()

    // for each browser in the list
    for(var i = 0; i < browser_detector.browsers.length; i++){
      var name = browser_detector.browsers[i].name;
      var version = browser_detector.browsers[i].version;

      //test name and version
      if (browser[0].match(name)){
        if (browser[1] >= version ){
          return true;
        }
      }
    }

    // return true if browser is OK
    browser_detector.getCompatible();
    return false;
  }
}
