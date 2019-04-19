define('Controls-demo/Slider/Range/SliderRangeDemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Slider/Range/SliderRangeDemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
