define('Controls-demo/List/Grid/WI/Base', [
   'Core/Control',
   'wml!Controls-demo/List/Grid/WI/resources/Base'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template
   });
});
