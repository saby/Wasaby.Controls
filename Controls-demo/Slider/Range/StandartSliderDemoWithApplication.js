define('Controls-demo/Slider/StandartSliderDemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Slider/StandartSliderDemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
