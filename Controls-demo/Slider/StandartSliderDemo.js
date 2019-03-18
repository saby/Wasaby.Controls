define('Controls-demo/Slider/StandartSliderDemo',
   [
      'Core/Control',
      'Types/source',
      'wml!Controls-demo/Slider/StandartSliderDemo',
      'css!Controls-demo/Slider/StandartSliderDemo',
      'Controls/Slider'
   ],
   function(Control, source, template) {
      'use strict';
      var StandartSliderDemo = Control.extend({
         _template: template, 
      });

      return StandartSliderDemo;
   }
);
