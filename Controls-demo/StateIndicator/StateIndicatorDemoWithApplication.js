define('Controls-demo/StateIndicator/StateIndicatorDemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/StateIndicator/StateIndicatorDemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
