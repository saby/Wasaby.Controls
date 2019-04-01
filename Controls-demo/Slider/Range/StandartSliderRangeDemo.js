define('Controls-demo/Slider/Range/StandartSliderRangeDemo',
   [
      'Core/Control',
      'Types/source',
      'wml!Controls-demo/Slider/Range/StandartSliderRangeDemo',
      'css!Controls-demo/Slider/Range/StandartSliderRangeDemo',
      'Controls/Slider'
   ],
   function(Control, source, template) {
      'use strict';
      var StandartSliderRangeDemo = Control.extend({
         _template: template,
      });

      return StandartSliderRangeDemo;
   }
);
