define('Controls-demo/ButtonModule/ButtonModule', [
   'Core/Control',
   'wml!Controls-demo/ButtonModule/ButtonModule',
   'Types/source',
   'Controls/toggle',
   'optional!SomeUnknownModules/foo/bar',
   'optional!Controls-demo/foo/bar'
], function(Control, template, source) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template,
         _beforeMount: function() {
         }
      }
   );
   return ModuleClass;
});
