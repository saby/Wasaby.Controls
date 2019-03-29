define('Controls-demo/Slider/SliderDemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Slider/SliderDemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
