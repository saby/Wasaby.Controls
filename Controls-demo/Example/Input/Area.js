define('Controls-demo/Example/Input/Area',
   [
      'Core/Control',
      'tmpl!Controls-demo/Example/Input/Area/Area',

      'Controls/Input/Area',
      'css!Controls-demo/Example/resource/Base'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      });
   }
);
