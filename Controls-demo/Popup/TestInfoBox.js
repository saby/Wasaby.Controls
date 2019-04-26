define('Controls-demo/Popup/TestInfoBox',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/TestInfoBox'
   ],
   function (Control, template) {
      'use strict';

      return Control.extend({
         _template: template,
      });
   }
);