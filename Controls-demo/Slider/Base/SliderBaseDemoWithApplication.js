define('Controls-demo/Slider/Base/SliderBaseDemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Slider/Base/SliderBaseDemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
