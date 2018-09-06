define('Controls-demo/Decorators/Decorators',
   [
      'Core/Control',
      'wml!Controls-demo/Decorators/Decorators',

      'Controls-demo/Decorators/Money/Money',
      'Controls-demo/Decorators/Number/Number',
      'Controls-demo/Decorators/PhoneNumber/PhoneNumber',
      'Controls-demo/Decorators/WrapURLs/WrapURLs',
      'css!Controls-demo/Decorators/Decorators'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      })
   }
);