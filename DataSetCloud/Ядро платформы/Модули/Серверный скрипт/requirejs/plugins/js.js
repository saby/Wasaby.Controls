(function() {

   'use strict';
   var global = (function(){ return this || (0,eval)('this'); }()),
       define = global.define || (global.requirejs && global.requirejs.define);

   define('js', {
         load: function (name, require, onLoad) {
            var paths;
            try {
               paths = [$ws.helpers.requirejsPathResolver(name, 'js')];
            } catch (e) {
               onLoad.error(e);
            }

            require(paths, function(ctor){
               onLoad(ctor);
            });
         }
   });
}());