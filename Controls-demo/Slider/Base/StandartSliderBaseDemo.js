define('Controls-demo/Slider/Base/StandartSliderBaseDemo',
   [
      'Core/Control',
      'Types/source',
      'wml!Controls-demo/Slider/Base/StandartSliderBaseDemo',
      'css!Controls-demo/Slider/Base/StandartSliderBaseDemo',
      'Controls/slider'
   ],
   function(Control, source, template) {
      'use strict';
      var StandartSliderBaseDemo = Control.extend({
         _template: template,
      });

      return StandartSliderBaseDemo;
   }
);
