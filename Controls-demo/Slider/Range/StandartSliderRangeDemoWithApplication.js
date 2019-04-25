define('Controls-demo/Slider/Range/StandartSliderRangeDemoWithApplication', [
   'Core/Control',
   'wml!Controls-demo/Slider/Range/StandartSliderRangeDemoWithApplication'
], function(Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template
      });
   return ModuleClass;
});
