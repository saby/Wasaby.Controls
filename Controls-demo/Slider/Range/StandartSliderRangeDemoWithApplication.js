define('Controls-demo/Slider/StandartSliderRangeDemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Slider/StandartSliderRangeDemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
