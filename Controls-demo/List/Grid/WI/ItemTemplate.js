define('Controls-demo/List/Grid/WI/ItemTemplate', [
   'Core/Control',
   'wml!Controls-demo/List/Grid/WI/resources/ItemTemplate'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template
   });
});
