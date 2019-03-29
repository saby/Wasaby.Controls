define('Controls-demo/Slider/StandartSliderBaseDemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Slider/StandartSliderBaseDemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
