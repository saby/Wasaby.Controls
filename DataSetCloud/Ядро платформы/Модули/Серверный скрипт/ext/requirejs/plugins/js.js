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
               for(var prop in ctor) {
                  if (ctor.hasOwnProperty(prop)) {
                     if (typeof ctor.prop == 'function') {
                        ctor.prop.toJSON = function() {
                           return 'wsFuncDecl::' + name + ':' + prop;
                        }
                     }
                  }
               }
               onLoad(ctor);
            }, function(err){
               onLoad.error(err);
            });
         }
   });
}());