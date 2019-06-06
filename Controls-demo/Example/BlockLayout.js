define('Controls-demo/Example/BlockLayout',
   [
      'Core/Control',
      'wml!Controls-demo/Example/BlockLayout',

      'css!Controls-demo/Example/BlockLayout'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      });
   }
);
