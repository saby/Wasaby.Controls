define('Controls-demo/Input/Password/Basic/Basic',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Password/Basic/Basic',

      'Controls/Input/Password',
      'css!Controls-demo/Input/Password/Basic/Basic'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      });
   }
);
