define('Controls-demo/StateIndicator/StandartStateIndicatorDemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/StateIndicator/StandartStateIndicatorDemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
