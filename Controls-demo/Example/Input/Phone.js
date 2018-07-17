define('Controls-demo/Example/Input/Phone',
   [
      'Core/Control',
      'tmpl!Controls-demo/Example/Input/Phone/Phone',

      'Controls/Input/Phone',
      'css!Controls-demo/Example/resource/Base'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      });
   }
);
