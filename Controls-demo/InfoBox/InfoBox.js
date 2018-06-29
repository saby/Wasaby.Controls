define('Controls-demo/InfoBox/InfoBox',
   [
      'Core/Control',
      'tmpl!Controls-demo/InfoBox/InfoBox',

      'Controls/Popup/InfoBox'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      });
   }
);
