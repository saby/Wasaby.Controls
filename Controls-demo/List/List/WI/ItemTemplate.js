define('Controls-demo/List/List/WI/ItemTemplate', [
   'Core/Control',
   'wml!Controls-demo/List/List/WI/resources/ItemTemplate'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template
   });
});
