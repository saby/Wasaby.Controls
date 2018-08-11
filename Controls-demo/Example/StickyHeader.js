define('Controls-demo/Example/Input',
   [
      'Core/Control',
      'tmpl!Controls-demo/Example/Input'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      });
   }
);
