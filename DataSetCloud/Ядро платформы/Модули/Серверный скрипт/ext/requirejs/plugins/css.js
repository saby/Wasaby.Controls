(function(){

   "use strict";

   var global = (function(){ return this || (0,eval)('this'); }()),
       define = global.define || (global.requirejs && global.requirejs.define);

   define("css", {
         load: function (name, require, load, conf) {
            if(conf.testing || require.isBrowser === false) {
               load(true);
            } else {
               var path = $ws.helpers.requirejsPathResolver(name, 'css');
               require(["native-css!" + path], function(css){
                  load(css);
               });
            }
         }
   });

})();