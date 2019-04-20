define('Controls-demo/Slider/Base/StandartSliderBaseDemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Slider/Base/StandartSliderBaseDemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
