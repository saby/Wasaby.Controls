define('Controls-demo/RootCoreControl/RootCoreControl', [
   'Core/Control',
   'wml!Controls-demo/RootCoreControl/RootCoreControl'
], function(Control, template) {
   'use strict';

   var module = Control.extend({
      _template: template
   });

   return module;
});
