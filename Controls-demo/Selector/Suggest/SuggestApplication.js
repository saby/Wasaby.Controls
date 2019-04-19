define('Controls-demo/Selector/Suggest/SuggestApplication', [
   'Core/Control',
   'wml!Controls-demo/Selector/Suggest/SuggestApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend({
      _template: template
   });

   return ModuleClass;
});
