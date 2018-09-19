define('Controls-demo/Example/StickyHeader',
   [
      'Core/Control',
      'tmpl!Controls-demo/Example/StickyHeader'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      });
   }
);
