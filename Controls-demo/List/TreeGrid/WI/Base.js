define('Controls-demo/List/TreeGrid/WI/Base', [
   'Core/Control',
   'wml!Controls-demo/List/TreeGrid/WI/resources/Base'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template
   });
});
