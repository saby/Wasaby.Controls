define('Controls-demo/Suggest/SuggestApplication', [
   'Core/Control',
   'wml!Controls-demo/Suggest/SuggestApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
