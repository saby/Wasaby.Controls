define('Controls-demo/ProcessStateIndicator/StandartProcessStateIndicatorDemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/ProcessStateIndicator/StandartProcessStateIndicatorDemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
