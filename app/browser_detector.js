
var browser_detector = {
  sayswho : function() {
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name:'IE',version:(tem[1]||'')};
        }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
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
    {name:'Firefox', version:44},
    {name:'Chrome', version:48},
    {name:'Safari', version:9},
    {name:'IE', version:11},
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
