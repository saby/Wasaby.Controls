define('Controls-demo/ProcessStateIndicator/ProcessStateIndicatorDemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/ProcessStateIndicator/ProcessStateIndicatorDemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
