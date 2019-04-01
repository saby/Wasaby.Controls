define('Controls-demo/Slider/SliderRangeDemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Slider/SliderRangeDemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
