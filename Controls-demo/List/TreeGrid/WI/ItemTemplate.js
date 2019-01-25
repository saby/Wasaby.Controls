define('Controls-demo/List/TreeGrid/WI/ItemTemplate', [
   'Core/Control',
   'wml!Controls-demo/List/TreeGrid/WI/resources/ItemTemplate'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template
   });
});
