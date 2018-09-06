define('Controls-demo/Decorators/Number/Number',
   [
      'Core/Control',
      'wml!Controls-demo/Decorators/Number/Number',

      'Controls/Input/Number',
      'Controls/Decorator/Number',
      'css!Controls-demo/Decorators/Number/Number'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _number: 0,

         _fractionSize: 0
      });
   }
);
