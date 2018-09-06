define('Controls-demo/Example/Input/Password',
   [
      'Core/Control',
      'wml!Controls-demo/Example/Input/Password/Password',

      'Controls/Input/Password',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      });
   }
);
