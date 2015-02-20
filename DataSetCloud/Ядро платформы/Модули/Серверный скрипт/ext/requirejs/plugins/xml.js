(function(){

   "use strict";

   var global = (function(){ return this || (0,eval)('this'); }()),
       define = global.define || (global.requirejs && global.requirejs.define);

   define('xml', {
      load: function (name, require, load) {
         try {
            var path = $ws.helpers.requirejsPathResolver(name, 'xml');
            require(['text!' + path], function(xml){
               load(xml);
            }, function(e){
               load.error(e);
            });
         } catch(e) {
            load.error(e);
         }
      }
   });
})();