(function(){

   "use strict";

   var global = (function(){ return this || (0,eval)('this'); }()),
      define = global.define || (global.requirejs && global.requirejs.define);

   define("template", {
      load: function (name, require, load, conf) {
         try {
            $ws.core.attachTemplate(name, {fast: true}).addCallback(load).addErrback(load.error.bind(load));
         } catch(e) {
            load.error(e);
         }
      }
   });
})();