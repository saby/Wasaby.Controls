define('Controls-demo/Example/Input/Password',
   [
      'Core/Control',
      'tmpl!Controls-demo/Example/Input/Password/Password',

      'Controls/Input/Password',
      'css!Controls-demo/Example/Input/Password/Password'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      });
   }
);
