define('Controls-demo/InfoBox/InfoBox',
   [
      'Core/Control',
      'wml!Controls-demo/InfoBox/InfoBox',

      'Controls/Popup/InfoBox'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      });
   }
);
