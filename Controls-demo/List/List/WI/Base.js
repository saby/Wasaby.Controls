define('Controls-demo/List/List/WI/Base', [
   'Core/Control',
   'wml!Controls-demo/List/List/WI/Base'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template
   });
});
