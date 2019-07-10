define('Controls-demo/Slider/Base/StandartSliderBaseDemo',
   [
      'Core/Control',
      'wml!Controls-demo/Slider/Base/StandartSliderBaseDemo',
      'css!Controls-demo/Slider/Base/StandartSliderBaseDemo',
      'Controls/slider'
   ],
   function(Control, template) {
      'use strict';
      var StandartSliderBaseDemo = Control.extend({
         _template: template
      });

      return StandartSliderBaseDemo;
   }
);
