define('Controls-demo/AsyncTest/AsyncTestDemo',
   [
      'Core/Control',
      'wml!Controls-demo/AsyncTest/AsyncTestDemo',
      'css!Controls-demo/AsyncTest/AsyncTestDemo',
   ],
   function(Control, template) {
      'use strict';

      var AsyncTestDemo = Control.extend({
         _template: template,
      });
      return AsyncTestDemo;
   }
);
