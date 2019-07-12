define('Controls-demo/FormController/Container', [
   'Env/Env',
   'Core/Control',
   'wml!Controls-demo/FormController/Container'
], function(Env, Control, tmpl) {
   'use strict';

   var module = Control.extend({
      _template: tmpl,
      _afterUpdate: function (cfg) {
         Env.IoC.resolve('ILogger').info(cfg.record);
      }
   });

   return module;
});
