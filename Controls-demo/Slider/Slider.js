define('Controls-demo/Slider/Slider',
   [
      'Core/Control',
      'wml!Controls-demo/Slider/Slider',
      'css!Controls-demo/Slider/Slider',
      'Controls/Slider'
   ],
   function(Control, template) {
      'use strict';
      var Slider = Control.extend({
         _template: template
      });

      return Slider;
   }
);
