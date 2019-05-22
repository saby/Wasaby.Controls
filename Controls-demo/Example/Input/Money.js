define('Controls-demo/Example/Input/Money',
   [
      'Core/Control',
      'wml!Controls-demo/Example/Input/Money/Money',

      'Controls/_input/Money',
      'css!Controls-demo/Example/resource/Base',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, template) {
      'use strict';

      return Control.extend({
         _template: template,

         _value1: '0.00',

         _value2: '0.00'
      });
   });
