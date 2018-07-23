define('Controls-demo/Decorators/Number/Number',
   [
      'Core/Control',
      'Controls/Decorator/Number',
      'tmpl!Controls-demo/Decorators/Number/Number',

      'Controls/Input/Number',
      'css!Controls-demo/Decorators/Number/Number'
   ],
   function(Control, Number, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _number: 0,

         _fractionSize: 0,

         _min: Math.min,

         _numberDecorator: Number
      })
   }
);