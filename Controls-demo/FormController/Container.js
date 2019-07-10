define('Controls-demo/FormController/Container', [
   'Core/Control',
   'wml!Controls-demo/FormController/Container'
], function(Control, tmpl) {
   'use strict';

   var module = Control.extend({
      _template: tmpl
   });

   return module;
});
