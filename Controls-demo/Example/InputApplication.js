define('Controls-demo/Example/InputApplication',
   [
      'Core/Control',
      'wml!Controls-demo/Example/InputApplication',
   ],
   function(Control, template) {
      'use strict';

      return Control.extend({
         _template: template,

      });
   });
