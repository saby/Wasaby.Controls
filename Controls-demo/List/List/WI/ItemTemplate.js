define('Controls-demo/List/List/WI/ItemTemplate', [
   'Core/Control',
   'wml!Controls-demo/List/List/WI/ItemTemplate'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template
   });
});
