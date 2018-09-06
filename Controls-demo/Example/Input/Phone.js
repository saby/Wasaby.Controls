define('Controls-demo/Example/Input/Phone',
   [
      'Core/Control',
      'wml!Controls-demo/Example/Input/Phone/Phone',

      'Controls/Input/Phone',
      'css!Controls-demo/Example/resource/Base',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      });
   }
);
