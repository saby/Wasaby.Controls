define('Controls-demo/ReceivedStatesDemo/Index',
   [
      'Core/Control',
      'wml!Controls-demo/ReceivedStatesDemo/Index'
   ],
   function(Control, template) {
      'use strict';

      return Control.extend({
         _template: template
      });
   });
