define('Controls-demo/List/Grid/WI/ItemActions', [
   'Core/Control',
   'wml!Controls-demo/List/Grid/WI/resources/ItemActions'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template
   });
});
